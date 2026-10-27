---
title: Daemon e endpoints
sidebar_position: 3
description: "Contrato HTTP do daemon local: health, registro autenticado, desligamento, SSE, temas, assets, fontes, imagens e páginas."
---

O daemon é um servidor HTTP em `127.0.0.1:<porta>` que renderiza documentos e
expõe alguns endpoints internos. Todos os endpoints validam `Host` e `Origin`;
os que mudam estado exigem token.

## Endpoints

| Método | Rota | Token | Função |
| --- | --- | --- | --- |
| `GET` | `/__health` | Não | Saúde e versão |
| `PUT` | `/__register` | Sim | Registra conteúdo |
| `POST` | `/__shutdown` | Sim | Encerra o daemon |
| `GET` | `/__events` | Não | Fluxo SSE |
| `GET` | `/__themes` | Não | Catálogo de temas e erros |
| `GET` | `/__assets/mermaid.min.js` | Não | Biblioteca Mermaid local |
| `GET` | `/__assets/<arquivo>` | Não | Assets do cliente |
| `GET` | `/__fonts` | Não | Catálogo de fontes |
| `GET` | `/__fonts/google` | Não | Proxy da folha CSS do Google |
| `GET` | `/__fonts/file/<sha256>` | Não | Arquivo `.woff2` em cache |
| `GET` | `/<slug>` | Não | Página renderizada |
| `GET` | `/img/<slug>/<caminho>` | Não | Imagem do documento |

Métodos não suportados em uma rota existente recebem `405`; rotas desconhecidas
recebem `404`.

## `GET /__health`

```bash
curl -s http://127.0.0.1:8766/__health
```

```json
{ "status": "ok", "version": "1.3.0" }
```

Usado pela CLI para verificar se o daemon está saudável antes de registrar.

## `PUT /__register`

Autenticado pelo cabeçalho `x-mdprv-token`.

```bash
token=$(jq -r .token "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json")

curl -s -X PUT http://127.0.0.1:8766/__register \
  -H "x-mdprv-token: $token" \
  -H "content-type: application/json" \
  -d '{"slug":"exemplo","content":"# Olá"}'
```

Corpo:

| Campo | Tipo | Obrigatório | Efeito |
| --- | --- | --- | --- |
| `slug` | string | Sim | Identidade na URL |
| `path` | string | Não | Caminho em disco para observação do arquivo e imagens |
| `content` | string | Não | Conteúdo autoritativo; se ausente, lê de `path` |

Resposta:

```json
{ "slug": "exemplo" }
```

| Situação | Status | Corpo |
| --- | --- | --- |
| Sucesso | `200` | `{"slug":"..."}` |
| Sem token | `401` | `unauthorized` |
| JSON inválido | `400` | `bad request` |
| `slug` ausente/vazio | `400` | `bad request` |

O daemon grava o slug como veio (após `trim` feito pela CLI), portanto o cliente
é responsável por evitá-lo vazio ou com barras à esquerda.

## `POST /__shutdown`

Autenticado. Responde `bye` e agenda o encerramento. A CLI aguarda o processo
sumir e, se necessário, envia sinais.

```bash
curl -s -X POST http://127.0.0.1:8766/__shutdown \
  -H "x-mdprv-token: $token"
```

## `GET /__events`

Fluxo SSE com `Content-Type: text/event-stream` e `Cache-Control: no-store`.
O cliente deve manter a conexão aberta.

```bash
curl -N http://127.0.0.1:8766/__events
```

Eventos:

| Evento | Conteúdo | Frequência |
| --- | --- | --- |
| `snapshot` | `{ versions, slugs }` | Ao conectar |
| `version` | identifica slug e versão | Mudança no disco |
| `slugs` | lista de documentos | Novo registro |
| `themes` | `{ names, changed, version }` | Tema alterado |
| `ping` | `{ ts }` | A cada 20 s |

O servidor mantém um sinal de vida por cliente e remove conexões que falham.

## `GET /__themes`

```bash
curl -s http://127.0.0.1:8766/__themes
```

```json
{
  "themes": ["auto", "dracula", "github-dark"],
  "errors": []
}
```

`errors` contém os arquivos de tema rejeitados. Um tema inválido não derruba o
catálogo; o embutido ou o último válido continua disponível.

## Recursos estáticos

| Rota | Conteúdo |
| --- | --- |
| `/__assets/mermaid.min.js` | Mermaid embutido |
| `/__assets/<arquivo>` | JS/CSS do cliente, com nomes validados |

Os recursos do cliente são servidos de `dist/client`. Nomes fora de
`A-Za-z0-9._-` são rejeitados.

## Fontes

| Rota | Resposta |
| --- | --- |
| `/__fonts` | Catálogo com famílias, estilos e categoria; `no-store` |
| `/__fonts?refresh=1` | Mesma resposta, invalidando o cache de 5 min |
| `/__fonts/google?family=<Família>` | CSS reescrito; `400` inválido, `502` falha na origem |
| `/__fonts/file/<sha256>` | `.woff2` com cache imutável |

Quando `fc-list` não está disponível, o catálogo traz `available: false` e as
famílias genéricas.

## Páginas e imagens

`GET /<slug>` renderiza o documento. A resposta é HTML com CSP nonce, tema
resolvido e opções do servidor.

- `/` retorna `404`;
- slug desconhecido retorna `404`;
- `/img/<slug>/<caminho>` resolve a imagem no diretório do documento, bloqueando
  travessia de diretórios e symlinks externos;
- imagens usam extensões conhecidas e o diretório do documento registrado.

## Cabeçalhos HTTP

| Cabeçalho | Valor |
| --- | --- |
| `Cache-Control` | `no-store` (exceto arquivos de fonte) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `no-referrer` |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | nonce por página |

Requisições com `Host` fora de loopback ou `Origin` não-loopback recebem `403`
antes de qualquer roteamento.

## Ciclo de vida

```text
CLI ──inicia──▶ daemon (127.0.0.1:<porta>)
                 │
                 ├── grava { pid, port, token } com 0600
                 ├── observa documentos e temas
                 ├── serve páginas e SSE
                 └── encerra após 15 min ocioso
```

| Evento | Efeito |
| --- | --- |
| Primeira invocação | Auto-start |
| `POST /__shutdown` | Encerra e remove o estado |
| Idle de 15 min | Encerra e remove o estado |
| Estado ausente com processo vivo | CLI não autentica; pare o processo |
| Porta ocupada | Início automático falha com erro claro |

Para o modelo de segurança, veja [Segurança e daemon](/guias/seguranca). Para os
caminhos em disco, [Caminhos de configuração](/referencia/caminhos).
