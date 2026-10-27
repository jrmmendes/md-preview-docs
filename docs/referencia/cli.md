---
title: CLI
sidebar_position: 1
description: Comandos, opções, saídas e códigos de saída do md-preview.
---

```text
md-preview [options] [files...]
md-preview [command]
```

A forma raiz registra arquivos. Os subcomandos gerenciam daemon, temas,
configuração e registro via stdin.

```text
Usage: md-preview [options] [command] [files...]

Arguments:
  files               Markdown files (.md, .markdown or .mdc)

Options:
  -V, --version       output the version number
  --theme <name>      theme for this preview
  --open-browser      open the first file in the default browser after registering
  --pipe              read Markdown from stdin and register it as a temporary file
  -h, --help          display help for command
```

## Forma raiz

| Opção | Efeito |
| --- | --- |
| `files...` | Um ou mais `.md`, `.markdown` ou `.mdc` |
| `--theme <name>` | Valida o tema e adiciona `?theme=<name>` às URLs |
| `--open-browser` | Abre o navegador uma vez, no primeiro arquivo |
| `--pipe` | Lê stdin e registra um temporário |

Sem `--open-browser`, imprime uma URL por arquivo e não abre nada. Com vários
arquivos, deduplica pelo caminho real e abre só o primeiro.

`--pipe` não aceita arquivos posicionais, rejeita TTY e stdin vazio, e grava em
`${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md`. O temporário é
observado, então o live reload funciona.

## Subcomandos

| Comando | Função |
| --- | --- |
| `daemon start` | Inicia o daemon se ainda não estiver rodando |
| `daemon stop` | Encerra o daemon e limpa o estado |
| `daemon status` | Status; código `1` quando parado |
| `theme list [--json]` | Lista temas e origem (`builtin`/`user`) |
| `theme validate <file>` | Valida um `theme.json` |
| `theme path` | Imprime os diretórios de config e temas |
| `theme seed` | Cria temas embutidos ausentes |
| `config init` | Cria `config.json` sem sobrescrever |
| `register` | Registra Markdown de stdin |

### `daemon`

| Comando | Saída típica | Código |
| --- | --- | --- |
| `start` | `md-preview daemon started (pid 48211, port 8766)` | `0` |
| `start` (já ativo) | `md-preview daemon already running (pid 48211, port 8766)` | `0` |
| `stop` | `md-preview daemon stopped` | `0` |
| `stop` (parado) | `md-preview daemon is not running` | `0` |
| `stop` (estado obsoleto) | `md-preview daemon was not running (removed stale state)` | `0` |
| `status` (ativo) | `md-preview daemon running (pid 48211, port 8766)` | `0` |
| `status` (parado) | `md-preview daemon stopped` | `1` |

O código `1` de `status` é intencional:

```bash
if ! md-preview daemon status >/dev/null 2>&1; then
  echo "daemon parado"
fi
```

### `theme`

```bash
md-preview theme list           # nome e origem, um por linha
md-preview theme list --json    # [{ "name": "auto", "source": "builtin" }]
md-preview theme validate FILE  # ok: <arquivo> ou erro, código 1
md-preview theme path           # config: ... / themes: ...
md-preview theme seed           # created: N / skipped: N
```

Erros de validação de temas de usuário vão para stderr.

### `config init`

Cria `config.json` com os padrões e `config.schema.json`, sem sobrescrever um
arquivo existente. A saída é `created <path>` ou `already exists: <path>`.

### `register`

```text
Usage: md-preview register [options]

Options:
  --slug <slug>   slug used in the preview URL (required)
  --path <file>   document path (enables live reload and relative images)
  --stdin         read the Markdown content from stdin (required)
  -h, --help      display help for command
```

```bash
cat doc.md | md-preview register --stdin --slug docs/doc --path doc.md
```

| Regra | Comportamento |
| --- | --- |
| `--stdin` ausente | Erro, código `1` |
| `--slug` ausente ou vazio | Erro, código `1` |
| stdin é TTY | Erro, código `1` |
| Sucesso | Imprime **somente** o slug em stdout |
| Navegador | Nunca abre |

## Códigos de saída

| Código | Significado |
| --- | --- |
| `0` | Sucesso |
| `1` | Erro de uso, arquivo inválido, tema desconhecido, validação falhou ou daemon parado em `status` |

Mensagens de erro vão para stderr, prefixadas com `md-preview:`.

:::note[Comando interno]
`__serve` existe só para o processo do daemon se reexecutar. Não aparece na ajuda
e não deve ser chamado manualmente.
:::
