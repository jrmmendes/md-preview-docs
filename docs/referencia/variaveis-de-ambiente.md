---
title: Variáveis de ambiente
sidebar_position: 4
description: MDPRV_*, XDG_CONFIG_HOME, XDG_STATE_HOME e XDG_CACHE_HOME — valores padrão e precedência.
---

## Precedência

Para cada opção, o valor efetivo é:

```text
padrões  <  config.json  <  MDPRV_*
```

O tema tem uma camada extra por requisição:

```text
?theme=  >  cookie mdprv_theme  >  config.json / MDPRV_THEME  >  auto
```

## Variáveis

| Variável | Padrão | Efeito |
| --- | --- | --- |
| `MDPRV_CONFIG_DIR` | `${XDG_CONFIG_HOME:-~/.config}/md-preview` | Raiz de configuração e temas |
| `MDPRV_PORT` | `8766` | Porta do daemon |
| `MDPRV_IDLE` | `15` | Minutos de inatividade antes de encerrar |
| `MDPRV_THEME` | `auto` | Tema padrão |
| `MDPRV_LOADER` | `classic` | Estilo do loader de navegação |
| `MDPRV_ZOOM_SENSITIVITY` | `1.1` | Passo do zoom do Mermaid |
| `MDPRV_SEED_THEMES` | `1` | Copia temas embutidos ausentes no início |
| `MDPRV_STATE` | `${XDG_STATE_HOME:-~/.local/state}/md-preview/daemon.json` | Arquivo de estado |
| `MDPRV_TMP_DIR` | `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp` | Diretório do `--pipe` |
| `XDG_CONFIG_HOME` | `~/.config` | Base de configuração |
| `XDG_STATE_HOME` | `~/.local/state` | Base de estado |
| `XDG_CACHE_HOME` | `~/.cache` | Base de cache |

## Detalhes por variável

### `MDPRV_PORT`

Inteiro entre `0` e `65535`. Valores inválidos caem em `8766`; `0` faz o sistema
escolher uma porta livre, e a porta real aparece no estado e em
`daemon status`.

```bash
MDPRV_PORT=9000 md-preview doc.md
```

### `MDPRV_IDLE`

Minutos, mínimo `1`. Aceita frações; o valor é convertido para milissegundos.
Valores inválidos ou menores que zero usam `15`.

```bash
MDPRV_IDLE=120 md-preview doc.md
```

O limite é lido quando o daemon inicia. Um daemon já em execução não muda.

### `MDPRV_THEME`

Nome válido do catálogo. Nomes fora do padrão são ignorados e o valor do
`config.json` (ou `auto`) assume.

### `MDPRV_LOADER`

Um de `classic`, `dots`, `bars`, `ring`, `pulse`, `braille`. Qualquer outro valor
usa `classic`.

### `MDPRV_ZOOM_SENSITIVITY`

Número maior que `1` e no máximo `3`. Valores `<= 1` ou não numéricos usam `1.1`.
Na interface, o campo é normalizado para o intervalo `1.01`–`3`.

### `MDPRV_SEED_THEMES`

Aceita `1`/`true`/`yes`/`on` e `0`/`false`/`no`/`off`. Quando desligado, o daemon
não copia embutidos para o diretório de temas; os embutidos continuam disponíveis
em memória.

### `MDPRV_CONFIG_DIR`

Substitui o diretório inteiro. `config.json`, `config.schema.json`, `themes/` e
`theme.schema.json` passam a viver nele. Não é um local alternativo de leitura:
os caminhos legados não são consultados.

```bash
MDPRV_CONFIG_DIR=/tmp/portatil md-preview theme path
```

### `MDPRV_STATE`

Caminho completo do arquivo de estado. O arquivo é gravado com permissão `0600`
e contém `{ pid, port, token }`.

### `MDPRV_TMP_DIR`

Diretório onde o `--pipe` grava `temp-<uuid>.md`. Útil para testes e instalações
portáteis.

## `config.json`

```json
{
  "$schema": "./config.schema.json",
  "theme": "auto",
  "port": 8766,
  "idle": 15,
  "loader": "classic",
  "zoomSensitivity": 1.1,
  "seedThemes": true
}
```

| Campo | Tipo | Padrão |
| --- | --- | --- |
| `theme` | string | `auto` |
| `port` | inteiro | `8766` |
| `idle` | número (minutos) | `15` |
| `loader` | string | `classic` |
| `zoomSensitivity` | número | `1.1` |
| `seedThemes` | booleano | `true` |

- o arquivo é opcional e nunca é criado implicitamente;
- `config init` cria com os valores padrão e não sobrescreve;
- JSON inválido é reportado uma vez e os valores padrão são usados;
- chaves desconhecidas são ignoradas com aviso.

## Exemplos

```bash
# porta alternativa e sem cópia de temas
MDPRV_PORT=9001 MDPRV_SEED_THEMES=0 md-preview doc.md

# configuração isolada para um projeto
MDPRV_CONFIG_DIR="$PWD/.config-mdprv" md-preview theme seed
MDPRV_CONFIG_DIR="$PWD/.config-mdprv" md-preview doc.md

# pipe em diretório temporário próprio
MDPRV_TMP_DIR=/tmp/mdprv cat doc.md | md-preview --pipe
```

Para saber onde cada arquivo fica, veja
[Caminhos de configuração](/referencia/caminhos).
