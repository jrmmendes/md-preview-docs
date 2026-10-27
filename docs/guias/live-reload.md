---
title: Live reload
sidebar_position: 6
description: Como o daemon observa arquivos, o que cada evento SSE faz e quando a página recarrega.
---

O live reload é o motivo de o md-preview manter um daemon. A CLI registra o
documento e sai; o daemon continua observando o disco e avisa o navegador por
Server-Sent Events.

## O canal único

Toda a página usa **uma** conexão SSE:

```text
GET /__events
```

Eventos enviados:

| Evento | Conteúdo | Disparado por |
| --- | --- | --- |
| `snapshot` | versões por slug + lista de slugs | Nova conexão |
| `version` | slug e versão | Conteúdo alterado no disco |
| `slugs` | lista de slugs | Documento registrado |
| `themes` | nomes/erros do catálogo | Tema criado, editado ou removido |
| `ping` | data/hora | A cada 20 segundos |

O `ping` mantém a conexão viva e permite detectar quedas. O navegador não faz
polling do documento: a página só recarrega quando recebe `version` para o slug
atual.

## O que é observado

| Documento registrado como | Fonte observada | Recarrega ao salvar? |
| --- | --- | --- |
| Arquivo (`md-preview doc.md`) | O próprio arquivo | Sim |
| `--pipe` | Arquivo temporário em `md-preview/tmp` | Sim |
| `register --stdin --path P` | Arquivo `P` | Sim |
| `register --stdin` sem `--path` | Nada | Não |

No caso de `--pipe`, o conteúdo de stdin é gravado em
`${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md` e passa a ser
observado como qualquer outro arquivo. Editar esse temporário também recarrega.

Vários documentos podem ser observados ao mesmo tempo: cada um tem sua versão, e
o evento `version` identifica o slug. Se o arquivo de outro documento mudar, a
página atual não recarrega.

## Fluxo de uma alteração

```text
salvar doc.md
      │
      ▼
observador detecta a mudança
      │
      ▼
versão do slug é incrementada
      │
      ▼
SSE envia { event: "version", slug, version }
      │
      ▼
página do slug atual chama location.reload()
      │
      ▼
servidor renderiza o Markdown de novo e envia o HTML
```

A recarga é completa, não um patch de DOM. Isso garante que TOC, frontmatter,
tema e diagramas sejam recalculados juntos.

## Temas e live reload

Editar um `theme.json` gera um evento `themes`. A aba recarrega quando:

- o tema editado é o tema atual; ou
- o tema atual é `auto` e uma das variantes mudou.

Não existe troca de CSS em tempo real: recarregar reaplica também as paletas do
Shiki e a configuração do Mermaid. Arquivos inválidos não disparam recarga útil e
mantêm o tema anterior.

## Comportamento da página

- O loader de navegação aparece durante a recarga e tem limite de 8 segundos.
- O TOC e o Recent são atualizados pelos mesmos eventos.
- Se a conexão SSE cair, o navegador tenta reconectar; ao reconectar, recebe um
  novo `snapshot`.
- Se o daemon encerrar por inatividade, a página deixa de atualizar até você
  rodar a CLI de novo.

## Quando não há recarga

| Situação | Motivo |
| --- | --- |
| Arquivo fora do diretório registrado | Não está sendo observado |
| Documento via `register` sem `--path` | Conteúdo de stdin é autoritativo |
| Navegador com SSE bloqueado | Proxy/extensão impedindo o fluxo SSE |
| Daemon encerrado | Não há observador ativo |

Para o primeiro caso, registre o arquivo pelo caminho:

```bash
md-preview register --stdin --slug notas/ideia --path ~/notas/ideia.md < ~/notas/ideia.md
```

## Inatividade e ciclo de vida

O daemon encerra após **15 minutos** sem atividade. Cada requisição HTTP conta
como atividade; o fluxo SSE e seus sinais de vida não renovam o cronômetro por
si só.
Para manter o daemon vivo durante uma sessão longa, aumente o limite:

```bash
MDPRV_IDLE=120 md-preview doc.md
```

O valor é lido no início do daemon. Alterá-lo com o daemon já em execução não
afeta o processo atual.
