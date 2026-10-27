---
title: theme.json
sidebar_position: 2
description: Contrato v1 completo — campos, cores, grupos opcionais, valores padrão, Shiki, Mermaid e regras de validação.
---

Um tema é um objeto JSON validado contra o schema v1. Esta página lista todos os
campos aceitos e os valores usados quando um grupo opcional é omitido.

## Estrutura

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "meu-tema",
  "kind": "dark",
  "colors": {
    "background": "#0d1117",
    "surface": "#161b22",
    "text": "#e6edf3",
    "muted": "#8b949e",
    "border": "#30363d",
    "accent": "#58a6ff",
    "code-bg": "#161b22",
    "quote": "#8b949e"
  },
  "shiki": { "light": "github-light", "dark": "github-dark" },
  "mermaid": { "theme": "dark", "overrides": {} }
}
```

## Campos de topo

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| `$schema` | string | Não | Caminho do schema para o editor |
| `schemaVersion` | número | Sim | Exatamente `1` |
| `name` | string | Sim | `^[a-z0-9][a-z0-9-]{0,63}$` e igual ao nome do arquivo |
| `kind` | string | Sim | `auto`, `light` ou `dark` |
| `variants` | objeto | Só em `auto` | `light` e `dark` obrigatórios |
| `colors` | objeto | Só em `light`/`dark` | Oito cores obrigatórias |
| `radii` | objeto | Não | Números em px |
| `typography` | objeto | Não | Tamanhos e pesos |
| `layout` | objeto | Não | Medidas CSS |
| `effects` | objeto | Não | Sombras, durações e curvas de aceleração |
| `shiki` | objeto | Sim em `light`/`dark` | Paletas clara e escura |
| `mermaid` | objeto | Sim em `light`/`dark` | Tema e overrides |

`additionalProperties: false` em todos os níveis: uma chave desconhecida invalida
o arquivo.

## `colors`

| Token | Obrigatório | Padrão quando omitido |
| --- | --- | --- |
| `background` | Sim | — |
| `surface` | Sim | — |
| `surface-raised` | Não | `surface` |
| `text` | Sim | — |
| `muted` | Sim | — |
| `border` | Sim | — |
| `border-strong` | Não | `border` |
| `accent` | Sim | — |
| `accent-fg` | Não | `background` |
| `link` | Não | `accent` |
| `code-bg` | Sim | — |
| `code-fg` | Não | `text` |
| `quote` | Sim | — |
| `danger` | Não | `#c0392b` |
| `warning` | Não | `#b58900` |
| `success` | Não | `#2e7d32` |
| `info` | Não | `#268bd2` |
| `selection` | Não | `accent` |

Formatos aceitos:

```text
transparent
#rgb  #rgba  #rrggbb  #rrggbbaa
rgb(...)  rgba(...)  hsl(...)  hsla(...)
```

Comprimento máximo de 64 caracteres. Qualquer outro formato invalida o tema.

## `radii`

Números em pixels:

| Token | Padrão |
| --- | --- |
| `none` | `0` |
| `sm` | `5` |
| `md` | `6` |
| `lg` | `8` |
| `xl` | `12` |
| `pill` | `999` |
| `circle` | `9999` |

```json
{ "radii": { "sm": 4, "md": 6, "lg": 10 } }
```

## `typography`

| Token | Tipo | Faixa | Padrão |
| --- | --- | --- | --- |
| `family` | string | 1–128 caracteres | `system-ui` |
| `stack` | string | 1–512 caracteres | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif` |
| `mono-stack` | string | 1–512 caracteres | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` |
| `base-size` | número | 8–96 | `17` (px) |
| `ui-size` | número | 8–32 | `13` (px) |
| `small-size` | número | 8–24 | `11.5` (px) |
| `line-height` | número | 0.8–3 | `1.65` |
| `heading-line-height` | número | 0.8–3 | `1.25` |
| `code-line-height` | número | 0.8–3 | `1` |
| `weight-normal` | inteiro | 100–900 | `400` |
| `weight-bold` | inteiro | 100–900 | `600` |

`stack` e `mono-stack` são validados contra injeção de CSS. Use aspas escapadas
dentro do JSON quando o nome da fonte tiver espaços.

## `layout`

Medidas CSS (`rem`, `em`, `px`, `%`, `vh` etc.):

| Token | Padrão |
| --- | --- |
| `content-width` | `46rem` |
| `sidebar-width` | `16rem` |
| `scroll-offset` | `7rem` |
| `article-padding-y` | `2.5rem` |
| `article-padding-x` | `1.25rem` |
| `article-padding-bottom` | `6rem` |
| `control-height` | `1.9rem` |
| `code-padding` | `1em` |
| `table-cell-padding` | `.4em .75em` |

## `effects`

| Token | Tipo | Padrão |
| --- | --- | --- |
| `shadow-panel` | string (até 200) | `0 8px 28px rgba(0,0,0,.28)` |
| `overlay` | cor | `rgba(0,0,0,.55)` |
| `blur` | medida | `8px` |
| `duration-fast` | duração | `.15s` |
| `duration-ui` | duração | `.18s` |
| `easing` | string | `ease` |

## `shiki`

Obrigatório em temas fixos. Aceita exatamente estas oito paletas:

| Campo | Valores permitidos |
| --- | --- |
| `light` | `github-light`, `github-dark`, `dracula`, `nord`, `solarized-dark`, `solarized-light`, `gruvbox-dark-medium`, `gruvbox-light-medium` |
| `dark` | os mesmos oito valores |

```json
{ "shiki": { "light": "github-light", "dark": "nord" } }
```

As duas paletas são usadas na saída dupla; alternar claro/escuro não renderiza
o código de novo.

## `mermaid`

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `theme` | Sim | `default`, `neutral`, `dark`, `forest` ou `base` |
| `overrides` | Sim | Objeto de strings; até 512 chaves |

Chaves de `overrides` começam com letra e contêm apenas letras e números. Valores
têm 1–200 caracteres.

```json
{
  "mermaid": {
    "theme": "base",
    "overrides": {
      "primaryColor": "#1f6feb",
      "lineColor": "#8b949e",
      "fontFamily": "Inter, sans-serif"
    }
  }
}
```

## `kind: "auto"`

Um tema automático **não** declara `colors`, `radii`, `typography`, `layout`,
`effects`, `shiki` nem `mermaid`. Ele referencia outras variantes:

```json
{
  "schemaVersion": 1,
  "name": "meu-auto",
  "kind": "auto",
  "variants": { "light": "github-light", "dark": "github-dark" }
}
```

Regras:

- `variants.light` e `variants.dark` são obrigatórios;
- cada valor precisa existir no catálogo resolvido;
- as variantes são resolvidas depois da mesclagem com temas de usuário;
- declarar `colors` em um `auto` invalida o arquivo.

## Validação

| Camada | Verifica |
| --- | --- |
| Nome do arquivo | Regex e correspondência com `name` |
| Schema | Tipos, campos obrigatórios, `additionalProperties` |
| Cores | Formato e comprimento |
| Medidas | Unidades seguras, sem injeção |
| Shiki | Lista fechada de oito paletas |
| Mermaid | Enum de tema e formato dos overrides |
| Armazenamento | Tamanho ≤ 256 KiB e ausência de symlink |

```bash
md-preview theme validate meu-tema.json
md-preview theme list --json
```

Erros aparecem em stderr na CLI e em `errors` no endpoint `/__themes`.
