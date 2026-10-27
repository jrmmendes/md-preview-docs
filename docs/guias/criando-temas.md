---
title: Criando temas
sidebar_position: 3
description: Contrato do theme.json v1, validação, campos obrigatórios, grupos opcionais e sobreposição de temas embutidos.
---

Um tema é um arquivo JSON com `schemaVersion: 1` em
`~/.config/md-preview/themes/<nome>.json`. O nome do arquivo é o nome do tema e
precisa corresponder a `^[a-z0-9][a-z0-9-]{0,63}$`.

```text
~/.config/md-preview/themes/
├── auto.json
├── nord.json
└── meu-tema.json
```

## Fluxo mínimo

```bash
md-preview theme path      # mostra config/ e themes/
md-preview theme seed      # cria themes/ e copia os embutidos ausentes
md-preview theme validate ~/.config/md-preview/themes/meu-tema.json
```

`theme seed` nunca sobrescreve arquivos existentes. `theme validate` valida o
contrato e imprime `ok: <arquivo>` ou a mensagem de erro, com código de saída `1`.

## Tema fixo (claro ou escuro)

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "meu-tema",
  "kind": "dark",
  "colors": {
    "background": "#101418",
    "surface": "#161d24",
    "text": "#e6edf3",
    "muted": "#8b98a5",
    "border": "#26313c",
    "accent": "#4cc2a4",
    "code-bg": "#0c1116",
    "quote": "#8b98a5"
  },
  "shiki": {
    "light": "github-light",
    "dark": "github-dark"
  },
  "mermaid": {
    "theme": "dark",
    "overrides": {}
  }
}
```

Obrigatórios para `kind: "light"` ou `kind: "dark"`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `schemaVersion` | número | exatamente `1` |
| `name` | string | igual ao nome do arquivo |
| `kind` | string | `light` ou `dark` |
| `colors` | objeto | oito cores obrigatórias |
| `shiki` | objeto | `light` e `dark` |
| `mermaid` | objeto | `theme` e `overrides` |

As oito cores obrigatórias são `background`, `surface`, `text`, `muted`,
`border`, `accent`, `code-bg` e `quote`. Cores opcionais como `link`,
`accent-fg`, `danger` e `selection` são derivadas quando omitidas.

:::warning[Valores validados]
Cores aceitam `transparent`, hexadecimal (`#rgb` a `#rrggbbaa`) e
`rgb()`/`rgba()`/`hsl()`/`hsla()`. Medidas aceitam unidades CSS seguras. Strings
que possam injetar CSS são rejeitadas, e o tema inteiro é ignorado.
:::

## Tema automático

`kind: "auto"` não aceita `colors`, `shiki` nem `mermaid` diretamente. Ele
referencia duas variantes pelo nome:

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "meu-auto",
  "kind": "auto",
  "variants": {
    "light": "github-light",
    "dark": "solarized-dark"
  }
}
```

As variantes são resolvidas **depois** da mesclagem entre embutidos e temas de
usuário, então podem apontar para temas que você mesmo criou. As variantes
precisam existir no catálogo no momento da resolução.

## Grupos opcionais

Além de `colors`, você pode ajustar `radii`, `typography`, `layout`, `effects`,
`shiki` e `mermaid`. O contrato completo, com todos os tokens e valores padrão,
está em [Referência do theme.json](/referencia/theme-json).

Exemplo com tipografia e layout:

```json
{
  "typography": {
    "family": "IBM Plex Sans",
    "stack": "\"IBM Plex Sans\", system-ui, sans-serif",
    "base-size": 18,
    "line-height": 1.7
  },
  "layout": {
    "content-width": "48rem",
    "sidebar-width": "17rem"
  }
}
```

## Sobreposição, não substituição

Um tema de usuário com o mesmo nome de um embutido é mesclado em memória:

- o tema do usuário prevalece campo a campo;
- o arquivo embutido e o arquivo do usuário permanecem intactos;
- apagar o arquivo do usuário restaura o embutido;
- remover o arquivo em uso dispara o evento `themes` e recarrega a aba.

```bash
# sobrescreve apenas o nord para esta máquina
$EDITOR ~/.config/md-preview/themes/nord.json
md-preview theme validate ~/.config/md-preview/themes/nord.json
```

## Limites e recarga

| Situação | Comportamento |
| --- | --- |
| JSON inválido | Tema ignorado com erro; embutido continua |
| Nome fora do padrão | Arquivo ignorado |
| `kind: auto` sem variantes | Inválido |
| `kind: auto` com `colors` | Inválido |
| Arquivo maior que 256 KiB | Ignorado com aviso |
| Symlink | Ignorado com aviso |
| Tema atual editado | SSE `themes` recarrega a aba |

O servidor observa o diretório de temas. Não é preciso reiniciar o daemon nem
rodar `theme seed` de novo depois de criar um arquivo.

## Checklist antes de publicar

1. `md-preview theme validate <arquivo>` retorna `ok`.
2. `md-preview theme list` mostra o tema com origem `user`.
3. A página abre com `?theme=<nome>` e sem erros no console.
4. Blocos de código, tabelas, TOC, Mermaid e tree fences continuam legíveis.
5. O contraste de `text` sobre `background` e de `muted` sobre `surface` é
   suficiente em ambos os modos.

Próximo: [Referência do theme.json](/referencia/theme-json).
