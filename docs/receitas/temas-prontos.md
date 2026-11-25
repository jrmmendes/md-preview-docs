---
title: Temas prontos
sidebar_position: 3
description: Instale coleções completas de temas, como o par Tropical claro/escuro, sem criar os JSON do zero.
---

O repositório do md-preview mantém coleções completas em `themes/<família>/`.
Elas são exemplos prontos — não vêm embutidas no binário e não são copiadas por
`theme seed`. Hoje há a coleção **Tropical**, um par claro/escuro em tons
terrosos e quentes (ivory, coral, clay, kraft, céu e oliva) com tema de cores,
Shiki e Mermaid.

| Arquivo | Slug | Onde entra |
| --- | --- | --- |
| `tropical.json` | `tropical` | Tema de cores claro |
| `tropical-dark.json` | `tropical-dark` | Tema de cores escuro |
| `tropical.shiki.json` | `tropical` | Código no card Claro |
| `tropical-dark.shiki.json` | `tropical-dark` | Código no card Escuro |
| `tropical.mermaid.json` | `tropical` | Gráficos no card Claro |
| `tropical-dark.mermaid.json` | `tropical-dark` | Gráficos no card Escuro |

## Instalar

Com o repositório clonado, copie os seis JSON para o diretório de temas do
usuário:

```bash
themes=$(md-preview theme path | sed -n 's/^themes: //p')
cp themes/tropical/*.json "$themes/"
```

O caminho padrão é `~/.config/md-preview/themes/` (ou
`$MDPRV_CONFIG_DIR/themes/`). O daemon observa a pasta e atualiza o catálogo.

## Importar pelo modal

Abra **Temas → Importar** (`Ctrl+,`) e importe um arquivo por vez: primeiro o
tema de cores, depois o Shiki e o Mermaid correspondentes. O importador usa o
`name` como slug, grava `themes/<slug>.json`, `<slug>.shiki.json` ou
`<slug>.mermaid.json` e nunca sobrescreve arquivos existentes.

Depois escolha **Tropical** no seletor de temas e use os slugs `tropical` /
`tropical-dark` nos cards de **Código** e **Gráficos** da página Aparência.

:::note
O tema de cores aponta para os slugs Shiki/Mermaid da coleção. Se importar apenas
`tropical.json`, o código e os diagramas usam os fallbacks (`github-light`,
`github-dark` e `default`) com um aviso — instale os seis arquivos para ver o
conjunto completo.
:::

## Validação

A paleta combina tons terrosos e quentes (ivory, coral, clay, kraft, céu e
oliva) com ajustes de contraste para os tokens do md-preview. Cada arquivo passa
pelos mesmos validadores do daemon (`validateTheme`, `validateShikiCustom`,
`validateMermaidCustom`) e a coleção é coberta por
`tests/theme-collection.test.ts`.
