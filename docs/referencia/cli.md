---
title: CLI
sidebar_position: 1
description: Referência completa de md-preview, daemon, theme, config e register, com opções e códigos de saída.
---

## Sinopse

```text
md-preview [options] [files...]
md-preview [command]
```

A forma raiz registra arquivos. Os subcomandos gerenciam o daemon, os temas, a
configuração e o registro via stdin.

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

## Opções da forma raiz

| Opção | Efeito | Padrão |
| --- | --- | --- |
| `files...` | Um ou mais arquivos `.md`, `.markdown`, `.mdc` | — |
| `--theme <name>` | Valida o tema e adiciona `?theme=<name>` a todas as URLs | Configuração |
| `--open-browser` | Abre o navegador uma vez, no primeiro arquivo | Desligado |
| `--pipe` | Lê Markdown de stdin e registra um arquivo temporário | Desligado |
| `-V`, `--version` | Imprime a versão e encerra | — |
| `-h`, `--help` | Imprime a ajuda | — |

### Múltiplos arquivos

```bash
md-preview a.md b.markdown c.mdc
```

- deduplica por caminho real (symlinks incluídos);
- imprime uma URL por arquivo, na ordem dos argumentos;
- abre o navegador no primeiro arquivo só com `--open-browser`;
- `--theme` se aplica a todos.

### `--pipe`

```bash
echo '# Olá' | md-preview --pipe
```

- não pode ser combinado com arquivos posicionais;
- rejeita TTY e stdin vazio;
- grava em `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md`;
- registra o arquivo, portanto o live reload funciona;
- imprime a URL com o nome do temporário como slug.

## Subcomandos

| Comando | Função |
| --- | --- |
| `daemon start` | Inicia o daemon se ainda não estiver rodando |
| `daemon stop` | Encerra o daemon e limpa o estado |
| `daemon status` | Mostra o status; código de saída `1` quando parado |
| `theme list` | Lista temas e origem (`builtin`/`user`) |
| `theme list --json` | Lista em JSON |
| `theme validate <file>` | Valida um `theme.json` |
| `theme path` | Imprime os diretórios de config e temas |
| `theme seed` | Cria temas embutidos ausentes |
| `config init` | Cria `config.json` sem sobrescrever |
| `register` | Registra Markdown de stdin |

## `daemon`

```bash
md-preview daemon start
md-preview daemon stop
md-preview daemon status
```

| Comando | Saída típica | Código |
| --- | --- | --- |
| `start` | `md-preview daemon started (pid 48211, port 8766)` | `0` |
| `start` (já ativo) | `md-preview daemon already running (pid 48211, port 8766)` | `0` |
| `stop` | `md-preview daemon stopped` | `0` |
| `stop` (parado) | `md-preview daemon is not running` | `0` |
| `stop` (estado obsoleto) | `md-preview daemon was not running (removed stale state)` | `0` |
| `status` (ativo) | `md-preview daemon running (pid 48211, port 8766)` | `0` |
| `status` (parado) | `md-preview daemon stopped` | `1` |

O código de saída `1` de `status` é intencional e permite usar o comando em
scripts:

```bash
if ! md-preview daemon status >/dev/null 2>&1; then
  echo "daemon parado"
fi
```

## `theme`

### `theme list`

```bash
md-preview theme list
```

```text
auto	builtin
dracula	builtin
github-dark	builtin
github-light	builtin
gruvbox-dark	builtin
gruvbox-light	builtin
nord	builtin
solarized-dark	builtin
solarized-light	builtin
```

```bash
md-preview theme list --json
```

```json
[
  { "name": "auto", "source": "builtin" },
  { "name": "nord", "source": "user" }
]
```

Erros de validação de temas de usuário vão para stderr.

### `theme validate`

```bash
md-preview theme validate ~/.config/md-preview/themes/meu-tema.json
```

| Resultado | Saída | Código |
| --- | --- | --- |
| Válido | `ok: <arquivo>` | `0` |
| JSON inválido | mensagem do parser | `1` |
| Contrato inválido | campo/regra violada | `1` |

### `theme path`

```text
config: /home/ana/.config/md-preview
themes: /home/ana/.config/md-preview/themes
```

### `theme seed`

Cria o diretório de temas e copia os embutidos ausentes:

```text
created: 9
skipped: 0
```

Arquivos existentes nunca são sobrescritos.

## `config init`

```bash
md-preview config init
```

| Situação | Saída |
| --- | --- |
| Não existia | `created /home/ana/.config/md-preview/config.json` |
| Já existia | `already exists: /home/ana/.config/md-preview/config.json` |

Também grava `config.schema.json` para autocomplete no editor.

## `register`

```text
Usage: md-preview register [options]

Options:
  --slug <slug>   slug used in the preview URL
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
| stdin é TTY | Erro, código `1` |
| `--slug` vazio | Erro, código `1` |
| Sucesso | Imprime **somente** o slug em stdout |
| Navegador | Nunca abre |

## Códigos de saída

| Código | Significado |
| --- | --- |
| `0` | Sucesso |
| `1` | Erro de uso, arquivo inválido, tema desconhecido, validação falhou ou daemon parado em `status` |

Mensagens de erro vão para stderr, prefixadas com `md-preview:`.

## Exemplos

```bash
# registrar e imprimir URLs
md-preview docs/a.md docs/b.md

# abrir no primeiro arquivo
md-preview docs/a.md --open-browser

# tema pontual
md-preview docs/a.md --theme solarized-dark

# conteúdo de stdin
git diff | md-preview --pipe

# slug controlado
cat nota.md | md-preview register --stdin --slug notas/hoje --path nota.md

# inspecionar temas
md-preview theme list --json

# parar tudo
md-preview daemon stop
```

:::note[Comando interno]
O subcomando `__serve` existe apenas para o processo do daemon se reexecutar. Ele
não aparece na ajuda e não deve ser chamado manualmente.
:::

Para o comportamento do servidor, veja [Daemon e endpoints](/referencia/daemon).
