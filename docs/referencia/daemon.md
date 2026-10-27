---
title: Daemon
sidebar_position: 3
description: Endpoints HTTP, autenticação, SSE, estado e ciclo de vida do daemon local.
---

O daemon é um servidor HTTP em `127.0.0.1:<porta>` que renderiza documentos e
expõe endpoints internos. Todos validam `Host` e `Origin`; os que mudam estado
exigem token.

## Endpoints

| Método | Rota | Token | Função |
| --- | --- | --- | --- |
| `GET`/`HEAD` | `/__health` | Não | Saúde e versão |
| `PUT` | `/__register` | Sim | Registra conteúdo |
| `POST` | `/__shutdown` | Sim | Encerra o daemon |
| `GET` | `/__events` | Não | Fluxo SSE |
| `GET` | `/__themes` | Não | Catálogo e erros de validação |
| `GET` | `/__assets/mermaid.min.js` | Não | Mermaid local |
| `GET` | `/__assets/<arquivo>` | Não | JS/CSS do cliente |
| `GET` | `/__fonts` | Não | Catálogo de fontes |
| `GET` | `/__fonts/google?family=<F>` | Não | Proxy da folha CSS do Google |
| `GET` | `/__fonts/file/<sha256>` | Não | `.woff2` em cache |
| `GET` | `/<slug>` | Não | Página renderizada |
| `GET` | `/img/<slug>/<caminho>` | Não | Imagem do documento |

Métodos não suportados em uma rota existente recebem `405`; rotas desconhecidas
e slugs não registrados recebem `404`. `/` não tem documento raiz.

## Registro

`PUT /__register` autentica pelo cabeçalho `x-mdprv-token`.

```bash
token=$(jq -r .token "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json")

curl -s -X PUT http://127.0.0.1:8766/__register \
  -H "x-mdprv-token: $token" \
  -H "content-type: application/json" \
  -d '{"slug":"exemplo","content":"# Olá"}'
```

| Campo | Obrigatório | Efeito |
| --- | --- | --- |
| `slug` | Sim | Identidade na URL |
| `path` | Não | Caminho para watch e imagens |
| `content` | Não | Conteúdo autoritativo; se ausente, lê de `path` |

Resposta: `{"slug":"exemplo"}`. Sem token: `401`; JSON inválido ou slug vazio:
`400`.

`POST /__shutdown` responde `bye`, agenda o encerramento e também exige token.

## SSE

`GET /__events` mantém a conexão aberta (`text/event-stream`, `no-cache`).

| Evento | Conteúdo | Quando |
| --- | --- | --- |
| `snapshot` | `{ versions, slugs }` | Ao conectar |
| `version` | slug e versão | Mudança no disco |
| `slugs` | lista de documentos | Novo registro |
| `themes` | mudança no catálogo | Tema alterado |
| `ping` | `{ ts }` | A cada 20 s |

## Catálogo e assets

```bash
curl -s http://127.0.0.1:8766/__themes
# {"themes":["auto","dracula",...],"errors":[]}
```

`/__themes` lista os temas carregados e os arquivos rejeitados. `/__assets/`
serve o cliente a partir de `dist/client`, com nomes restritos a
`A-Za-z0-9._-`.

## Fontes

| Rota | Resposta |
| --- | --- |
| `/__fonts` | Famílias, estilos e categoria; `no-store` |
| `/__fonts?refresh=1` | Mesma resposta, invalidando o cache de 5 min |
| `/__fonts/google?family=<F>` | CSS reescrito; `400` inválido, `502` falha na origem |
| `/__fonts/file/<sha256>` | `.woff2` com cache imutável |

Sem `fc-list`, o catálogo traz `available: false` e as famílias genéricas.

## Estado e ciclo de vida

O daemon grava `{ pid, port, token }` em
`${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json`, com permissão
`0600`. A CLI lê esse arquivo para autenticar.

- primeira invocação inicia o daemon automaticamente;
- `POST /__shutdown` ou `daemon stop` encerra e remove o estado;
- 15 minutos sem atividade encerram o processo;
- apagar o estado com o daemon vivo faz a CLI perder o token;
- porta ocupada faz o início automático falhar com erro;
- cada início gera um token novo e um estado novo.
