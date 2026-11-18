---
title: Daemon
sidebar_position: 3
description: Endpoints HTTP, autenticação, SSE, estado e ciclo de vida do daemon local.
---

O daemon é um servidor HTTP em `127.0.0.1:<porta>` que renderiza documentos e
expõe endpoints internos. Todos validam `Host` e `Origin`; os que gravam
conteúdo ou encerram o processo exigem token.

## Endpoints

| Método | Rota | Token | Função |
| --- | --- | --- | --- |
| `GET`/`HEAD` | `/__health` | Não | Saúde e versão |
| `PUT` | `/__register` | Sim | Registra conteúdo |
| `POST` | `/__activate` | Sim | Foca/navega uma aba conectada ou pede abertura |
| `POST` | `/__shutdown` | Sim | Encerra o daemon |
| `GET` | `/__events` | Não | Fluxo SSE |
| `GET` | `/__themes` | Não | Catálogo e erros de validação |
| `GET` | `/__assets/mermaid.min.js` | Não | Mermaid local |
| `GET` | `/__assets/<arquivo>` | Não | JS/CSS do cliente |
| `GET` | `/__fonts` | Não | Catálogo de fontes |
| `GET` | `/__fonts/google?family=<F>` | Não | Proxy da folha CSS do Google |
| `GET` | `/__fonts/file/<sha256>` | Não | `.woff2` em cache |
| `GET`/`HEAD` | `/__doc?from=<slug>&rel=<nome>` | Não | Registra o destino e redireciona (`302`) |
| `DELETE` | `/__doc/<slug>` | Não | Desregistra o documento (sem apagar o arquivo) |
| `GET` | `/<slug>` | Não | Página renderizada |
| `GET` | `/img/<slug>/<caminho>` | Não | Imagem do documento |

Métodos não suportados em uma rota existente recebem `405`; rotas desconhecidas
e slugs não registrados recebem `404`. `/` não tem documento raiz.

## Registro

`PUT /__register` autentica pelo cabeçalho `x-mdprv-token`.

```bash
state="${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
port=$(jq -r .port "$state")
token=$(jq -r .token "$state")

curl -s -X PUT "http://127.0.0.1:$port/__register" \
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

Registrar o mesmo conteúdo de novo **não** incrementa a versão, então uma
segunda chamada da CLI não recarrega a aba aberta; só conteúdo novo (ou um slug
novo) emite `version`.

`POST /__shutdown` responde `bye`, agenda o encerramento e também exige token.

## Ativação de aba

`POST /__activate` autentica pelo cabeçalho `x-mdprv-token` e recebe
`{"slug":"<alvo>","url":"<url>"}`. A URL precisa ser do mesmo `Host` do daemon;
caso contrário, `400`.

| Situação | Resposta | Efeito |
| --- | --- | --- |
| Aba com `doc=<alvo>` conectada | `{"action":"focused"}` | Envia `activate` só para essas abas |
| Abas conectadas em outro documento | `{"action":"navigated"}` | Envia `activate` para a aba mais recente navegar |
| Nenhuma aba conectada | `{"action":"opened","first":<bool>}` | A CLI chama o opener |

Após uma abertura recente (até 6 s), a rota espera até 1,2 s por uma aba que
ainda está conectando antes de concluir que não há nenhuma. `first` é `true`
quando o navegador ainda não tinha sido aberto naquela sessão do daemon.

```bash
curl -s -X POST "http://127.0.0.1:$port/__activate" \
  -H "x-mdprv-token: $token" \
  -H "content-type: application/json" \
  -d '{"slug":"exemplo","url":"/exemplo"}'
```

## Navegação entre documentos

`GET`/`HEAD /__doc?from=<slug>&rel=<nome>` resolve um link relativo entre
documentos:

- `from` precisa ser um slug já registrado com caminho em disco;
- `rel` é percent-encoded e aceita apenas um arquivo irmão com extensão
  `.md`, `.markdown` ou `.mdc`; `?query` e `#fragmento` são preservados;
- a pasta vem do registro do daemon, nunca da requisição; caminho absoluto,
  `../`, subpastas e symlink que escape da pasta retornam `404`;
- sucesso registra o destino sob demanda (ele entra no Recent e passa a ser
  observado) e responde `302` para `/<slug><sufixo>`.

`DELETE /__doc/<slug>` remove um documento já registrado:

- responde `204` sem corpo e não apaga o arquivo do disco; apenas desregistra,
  tira do Recent e para de observar;
- só aceita um slug **já** registrado, então não serve para sondar o filesystem;
  slug desconhecido ou vazio recebe `404`;
- não exige token nem corpo e não aceita caminho; valida `Host`/`Origin` e exige
  `Sec-Fetch-Site` same-origin/none, porque é chamado pelo navegador.

Não existe rota `/__folder`: para registrar uma pasta inteira, use
[`md-preview <pasta>`](/referencia/cli#abrindo-uma-pasta).

## SSE

`GET /__events?doc=<slug>` mantém a conexão aberta (`text/event-stream`,
`no-cache`). O `doc` opcional informa qual documento a aba está mostrando; o
daemon usa essa informação para focar a aba certa em vez de abrir outra.

| Evento | Conteúdo | Quando |
| --- | --- | --- |
| `snapshot` | `{ versions, slugs }` | Ao conectar |
| `version` | slug e versão | Mudança no disco ou conteúdo novo |
| `slugs` | lista de documentos | Novo registro |
| `themes` | mudança no catálogo | Tema alterado |
| `activate` | `{ slug, url, ts }` | Uma execução da CLI quer mostrar o documento |
| `ping` | `{ ts }` | A cada 20 s |

O cliente trata `activate` assim: mesmo documento → tenta focar; documento
diferente → navega a própria aba, sem criar outra. A URL é sempre relativa ao
mesmo daemon (`pathname` + `search`).

## Catálogo e assets

```bash
port=$(jq -r .port "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json")
curl -s "http://127.0.0.1:$port/__themes"
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
`0600`. A CLI lê esse arquivo para autenticar. Na mesma sessão, também grava
`browserOpened`, `browserOpenedAt` e `browserUrl` (última URL entregue ao
opener); esses campos são apagados junto com o estado quando o daemon para.

- primeira invocação inicia o daemon automaticamente;
- `POST /__shutdown` ou `daemon stop` encerra e remove o estado;
- 15 minutos sem atividade encerram o processo;
- apagar o estado com o daemon vivo faz a CLI perder o token;
- porta ocupada faz o início automático falhar com erro;
- cada início gera um token novo e um estado novo.
