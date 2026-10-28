---
title: Caminhos
sidebar_position: 4
description: Onde ficam configuração, temas, estado do daemon, temporários e o binário instalado.
---

Os caminhos seguem XDG e podem ser movidos com `MDPRV_*`. Nada é gravado no
diretório do projeto.

## Configuração

```text
${XDG_CONFIG_HOME:-~/.config}/md-preview/
├── config.json            # opcional; criado por `config init`
├── config.schema.json     # schema para o editor
└── themes/
    ├── auto.json
    ├── nord.json
    ├── theme.schema.json
    └── meu-tema.json      # temas de usuário
```

`MDPRV_CONFIG_DIR` substitui a raiz inteira. `theme path` imprime os caminhos
efetivos.

## Estado e temporários

| Caminho | Conteúdo |
| --- | --- |
| `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json` | `{ pid, port, token }`, modo `0600` |
| `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md` | Documentos de `--pipe`, modo `0600` |

O estado é gravado de forma atômica e removido no encerramento normal. Os
temporários não são apagados automaticamente.

## Instalação

| Caminho | Papel |
| --- | --- |
| `~/.local/bin/md-preview` | Binário baixado da release ou link para o build local |
| `~/.md-preview` | Clone do código-fonte, só quando você compila |
| `~/.md-preview/bin/md-preview` | Binário gerado por `bun run build` |

## Variáveis

| Variável | Padrão | Efeito |
| --- | --- | --- |
| `MDPRV_CONFIG_DIR` | `${XDG_CONFIG_HOME:-~/.config}/md-preview` | Raiz de configuração e temas |
| `MDPRV_PORT` | `8766` | Porta do daemon |
| `MDPRV_IDLE` | `15` | Minutos de inatividade |
| `MDPRV_THEME` | `auto` | Tema padrão |
| `MDPRV_LOADER` | `classic` | Loader de navegação |
| `MDPRV_ZOOM_SENSITIVITY` | `1.1` | Passo do zoom do Mermaid |
| `MDPRV_SEED_THEMES` | `1` | Copia embutidos ausentes no início |
| `MDPRV_STATE` | `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json` | Arquivo de estado |
| `MDPRV_TMP_DIR` | `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp` | Diretório do `--pipe` |
| `XDG_CONFIG_HOME` | `~/.config` | Base de configuração |
| `XDG_STATE_HOME` | `~/.local/state` | Base de estado |
| `XDG_CACHE_HOME` | `~/.cache` | Base de cache |

## Precedência

```text
padrões  <  config.json  <  MDPRV_*
```

O tema tem uma camada extra por requisição:
`?theme=` > cookie `mdprv_theme` > `config.json`/`MDPRV_THEME` > `auto`.

`config.json` é opcional e nunca é criado implicitamente. JSON inválido é
reportado e os padrões são usados; chaves desconhecidas são ignoradas com aviso.

## Limpeza

```bash
md-preview daemon stop
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/md-preview"
rm -rf "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview"
rm -rf "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview"
rm -rf ~/.md-preview          # só se você compilou do código-fonte
rm -f ~/.local/bin/md-preview
```

Faça backup dos temas de usuário antes de apagar a configuração. Para limpar só
os temporários:

```bash
rm -f "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp/"temp-*.md
```
