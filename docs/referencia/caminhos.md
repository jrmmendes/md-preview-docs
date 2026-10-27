---
title: Caminhos de configuração
sidebar_position: 5
description: Onde ficam config.json, temas, estado do daemon, temporários e artefatos de build.
---

Todos os caminhos seguem XDG quando disponíveis e podem ser movidos com
`MDPRV_*`. Nada é gravado no diretório do projeto, exceto o binário e o build.

## Configuração

| Caminho | Conteúdo | Criado por |
| --- | --- | --- |
| `${XDG_CONFIG_HOME:-~/.config}/md-preview/` | Raiz de configuração | `config init`, `theme seed` |
| `config.json` | Preferências | `config init` |
| `config.schema.json` | Schema para o editor | `config init` |
| `themes/` | Temas de usuário | `theme seed` ou daemon |
| `themes/<nome>.json` | Tema individual | Você ou `theme seed` |
| `themes/theme.schema.json` | Schema do tema | `theme seed` ou daemon |

`MDPRV_CONFIG_DIR` substitui a raiz inteira. Se definido, os demais caminhos são
relativos a ele.

```text
~/.config/md-preview/
├── config.json
├── config.schema.json
└── themes/
    ├── auto.json
    ├── github-light.json
    ├── nord.json
    ├── theme.schema.json
    └── meu-tema.json
```

## Estado do daemon

| Caminho | Conteúdo |
| --- | --- |
| `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json` | `{ pid, port, token }` |

O arquivo é gravado de forma atômica com permissão `0600` e removido no
encerramento normal. `MDPRV_STATE` substitui o caminho completo.

## Temporários

| Caminho | Conteúdo |
| --- | --- |
| `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md` | Documentos de `--pipe` |

Cada pipe cria um arquivo novo com permissão `0600`. Eles não são removidos
automaticamente. `MDPRV_TMP_DIR` substitui o diretório.

## Artefatos do projeto

| Caminho | Papel |
| --- | --- |
| `bin/md-preview` | Binário único gerado pelo build |
| `dist/client/` | Pacote do cliente no navegador gerado por `build:client` |
| `themes/` (repositório) | Temas embutidos, compilados no binário |
| `src/` | Código-fonte |

O binário embute cliente, temas e Mermaid. `dist/client` não é necessário em
tempo de execução; os temas embutidos também não precisam existir no disco.

## Variáveis que mudam os caminhos

| Variável | Afeta |
| --- | --- |
| `MDPRV_CONFIG_DIR` | Configuração e temas |
| `MDPRV_STATE` | Arquivo de estado completo |
| `MDPRV_TMP_DIR` | Temporários do pipe |
| `XDG_CONFIG_HOME` | Base de configuração |
| `XDG_STATE_HOME` | Base de estado |
| `XDG_CACHE_HOME` | Base de cache |

## Caminhos legados

Esta versão **não lê nem migra**:

- `.md-preview` no projeto;
- `~/.md-preview`;
- `./.md-preview`;
- temas no diretório atual.

Nenhum arquivo legado é apagado ou sobrescrito. Se você usava uma versão
anterior, mova os temas manualmente para
`~/.config/md-preview/themes/<nome>.json` e converta para `schemaVersion: 1`.

## Inspecionar

```bash
md-preview theme path
```

```text
config: /home/ana/.config/md-preview
themes: /home/ana/.config/md-preview/themes
```

```bash
cat "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
ls "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp"
```

## Limpeza

:::warning[Backup de temas]
Os comandos abaixo removem configurações e temas de usuário. Faça backup do que
quiser manter antes de apagar o diretório de configuração.
:::

```bash
md-preview daemon stop
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/md-preview"
rm -rf "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview"
rm -rf "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview"
rm -f "$HOME/.local/bin/md-preview"
```

Para limpar apenas temporários:

```bash
rm -f "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp/"temp-*.md
```

Para recomeçar sem perder temas, apague somente o estado e reinicie:

```bash
md-preview daemon stop
rm -f "${XDG_STATE_HOME:-$HOME/.local/state}/md-preview/daemon.json"
```
