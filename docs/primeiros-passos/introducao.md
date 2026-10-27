---
title: Introdução
sidebar_position: 1
description: O que é o md-preview, como um arquivo vira uma URL local e quais eventos mantêm a página atualizada.
---

**md-preview** é uma CLI que registra arquivos Markdown em um daemon local. O
daemon renderiza o documento e serve uma URL em `127.0.0.1:8766`; ao salvar o
arquivo, a página recarrega.

Sem `--open-browser`, a CLI só imprime uma URL por arquivo. Isso permite usá-la
em scripts e editores. O navegador é aberto apenas quando a flag é passada.

```bash
md-preview docs/guia.md
# http://127.0.0.1:8766/docs/guia
```

## Como funciona

1. A CLI valida o arquivo e calcula um **slug** a partir do caminho.
2. Se preciso, inicia o **daemon** em segundo plano e registra o documento.
3. O daemon renderiza o Markdown e serve a página em `/<slug>`.
4. Um canal SSE (`GET /__events`) avisa o navegador sobre mudanças.

O slug é relativo à raiz do repositório Git que contém o arquivo. Sem Git, a
raiz é `$HOME` — ou `/`, para caminhos fora dele. A extensão é removida e
espaços ou caracteres fora de `A-Z a-z 0-9 / . _ -` viram `-`.

| Arquivo | Slug |
| --- | --- |
| `~/notas/ideia.md` | `notas/ideia` |
| `docs/guia.md` (dentro de um repositório Git) | `docs/guia` |
| `/etc/exemplo.md` | `etc/exemplo` |

`register --slug` permite escolher o slug manualmente. Documentos de `--pipe`
usam o nome do temporário: `temp-<uuid>.md`.

## Eventos

| Evento | Quando ocorre | Efeito na página |
| --- | --- | --- |
| `snapshot` | Ao conectar | Envia versões e a lista de slugs |
| `version` | Conteúdo muda no disco | Recarrega a página atual |
| `slugs` | Documento é registrado | Atualiza o Recent |
| `themes` | Tema de usuário muda | Recarrega se o tema atual foi afetado |
| `ping` | A cada 20 segundos | Mantém a conexão viva |

O mesmo canal alimenta o live reload, o histórico Recent e a troca de temas. Não
há polling do documento.

Continue em [Instalação](/primeiros-passos/instalacao), [Início
rápido](/primeiros-passos/inicio-rapido) ou [Referência da
CLI](/referencia/cli).
