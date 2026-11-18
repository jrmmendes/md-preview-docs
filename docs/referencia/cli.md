---
title: CLI
sidebar_position: 1
description: Comandos, opções, saídas e códigos de saída do md-preview.
---

```text
md-preview [options] [files...|directory]
md-preview [command]
```

A forma raiz registra arquivos **ou** uma pasta. Os subcomandos gerenciam daemon,
temas, configuração e registro via stdin.

```text
Usage: md-preview [options] [command] [paths...]

Register Markdown files or a directory in a local preview daemon

Arguments:
  paths               Markdown files (.md, .markdown or .mdc) or a directory

Options:
  -V, --version       output the version number
  --theme <name>      theme for this preview
  --open-browser      always open the first file in the default browser
  --no-open-browser   never open or focus a browser; only register the documents
  --pipe              read Markdown from stdin and register it as a temporary file
  -h, --help          display help for command
```

## Forma raiz

| Opção | Efeito |
| --- | --- |
| `paths...` | Um ou mais `.md`, `.markdown` ou `.mdc`, ou **um diretório** |
| `--theme <name>` | Valida o tema e adiciona `?theme=<name>` às URLs |
| `--open-browser` | Força abrir o navegador, mesmo com aba já conectada |
| `--no-open-browser` | Nunca abre nem foca o navegador; apenas registra |
| `--pipe` | Lê stdin e registra um temporário |

Por padrão, a **primeira execução** abre o navegador e as seguintes reaproveitam
a aba já conectada, sem criar outra. Com vários arquivos, deduplica pelo caminho
real e apresenta só o primeiro; os demais ficam no Recent.

### Abertura, foco e precedência

O daemon sabe quantas abas de preview estão conectadas e qual documento cada
uma mostra. A CLI decide nesta ordem:

1. `--no-open-browser` presente e `--open-browser` ausente → não abre nem foca.
2. `--open-browser` presente e `--no-open-browser` ausente → chama o opener.
3. Com as duas flags, vale a **última** da linha de comando.
4. Sem flags:
   - há aba mostrando o documento → só pede foco, sem recarregar;
   - há aba em outro documento → navega essa aba para o novo documento;
   - não há aba conectada → abre o navegador como na primeira vez.

Uma execução logo após a primeira espera até ~1,2 s por uma aba que ainda está
conectando, evitando abrir uma segunda aba por corrida.

O daemon grava no arquivo de estado (`browserOpened`, `browserOpenedAt` e
`browserUrl`) que já abriu o navegador naquela sessão. O estado some quando o
daemon para, então o próximo daemon volta ao comportamento de primeira execução.

Mensagens de status vão para stderr, uma linha curta, sem poluir as URLs de
stdout:

```text
md-preview: opened in browser
md-preview: focused existing tab
md-preview: tab not connected — opened
```

O foco é **melhor esforço**. Navegadores não deixam uma página em segundo plano
roubar o foco sem gesto do usuário: `window.focus()` é chamado e pode ser
ignorado. Para o usuário achar a aba, o cliente também:

- prefixa o título com `●` enquanto a aba está sem foco ou oculta;
- usa `navigator.setAppBadge(1)` quando disponível;
- mostra uma `Notification` **apenas** se a permissão já tiver sido concedida.

Título, badge e notificação são pistas visuais; a garantia é nunca abrir uma aba
duplicada e sempre navegar a aba existente. Não há manipulação de janelas do
sistema (`wmctrl`, `xdotool`, XDG Activation): isso varia por compositor, não
funciona no Wayland em geral e não é portátil entre Linux, macOS e Windows.

`--pipe` não aceita caminhos posicionais, rejeita TTY e stdin vazio, e grava em
`${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md`. O temporário é
observado, então o live reload funciona. A abertura/foco segue o mesmo padrão da
forma raiz; `--no-open-browser` suprime e `--open-browser` força.

### Abrindo uma pasta

Um diretório é aberto informando o caminho direto, como um arquivo:

```bash
md-preview ~/notas
md-preview .
```

Todos os Markdown regulares **diretamente** na pasta são registrados — sem
entrar em subpastas — e um preview é aberto no navegador.

| Regra | Comportamento |
| --- | --- |
| Extensões | `.md`, `.markdown` e `.mdc` |
| Ignorados | nomes ocultos (começando por `.`), subpastas e symlinks |
| Limite | 200 arquivos; o excedente é ignorado com aviso em stderr |
| Slug | derivado do nome do arquivo, sem caminho absoluto |
| Preview aberto | `index.md` quando existe; senão o primeiro nome em ordem alfabética |
| Saída | uma URL por arquivo registrado |
| `--theme` | aplicado a todas as URLs da pasta |
| Navegador | abre na primeira execução; depois foca/navega a aba conectada |
| `--open-browser` / `--no-open-browser` | forçam ou suprimem a abertura |
| Caminho inexistente ou sem Markdown | erro em stderr e código `1` |

Symlinks que apontam para um diretório são seguidos. Um caminho nomeia uma única
entrada do sistema de arquivos, então `stat` decide: um diretório chamado
`notes.md` é aberto como pasta, não como arquivo. Diretórios só podem ser
abertos sozinhos — combine vários caminhos apenas com arquivos.

:::note[`folder` não é um subcomando]
`md-preview folder` é interpretado como o caminho `./folder`. Se ele não existir,
o erro é `path not found: folder`, com código `1`.
:::

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
| `start` | `md-preview daemon started (pid 48211, port <porta>)` | `0` |
| `start` (já ativo) | `md-preview daemon already running (pid 48211, port <porta>)` | `0` |
| `stop` | `md-preview daemon stopped` | `0` |
| `stop` (parado) | `md-preview daemon is not running` | `0` |
| `stop` (estado obsoleto) | `md-preview daemon was not running (removed stale state)` | `0` |
| `status` (ativo) | `md-preview daemon running (pid 48211, port <porta>)` | `0` |
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
| `1` | Erro de uso, caminho inexistente, arquivo inválido, tema desconhecido, validação falhou ou daemon parado em `status` |

Mensagens de erro vão para stderr, prefixadas com `md-preview:`.

:::note[Comando interno]
`__serve` existe só para o processo do daemon se reexecutar. Não aparece na ajuda
e não deve ser chamado manualmente.
:::
