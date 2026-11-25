---
title: Temas Mermaid
sidebar_position: 4
description: Formato .mermaid.json, importação pelo modal, variáveis válidas, resolução no render e fallback.
---

Os diagramas Mermaid usam um tema embutido (`default`, `neutral`, `dark`,
`forest` ou `base`) mais variáveis derivadas das cores do `theme.json`. O modal
também importa temas Mermaid completos, sem rebuild e sem reiniciar o daemon.

## Formato do arquivo

`<slug>.mermaid.json`, com `schemaVersion: 1` e `name` igual ao slug:

```json
{
  "schemaVersion": 1,
  "name": "meu-diagrama",
  "theme": "base",
  "variables": {
    "background": "#faf9f5",
    "primaryColor": "#d97757",
    "mainBkg": "#f5f4ed",
    "primaryTextColor": "#141413",
    "textColor": "#141413",
    "lineColor": "#a14a2e",
    "nodeBorder": "#d97757",
    "fontFamily": "\"Source Sans 3\", sans-serif"
  }
}
```

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `schemaVersion` | Sim | Exatamente `1` |
| `name` | Sim | `^[a-z0-9][a-z0-9-]{0,63}$` e igual ao arquivo |
| `theme` | Não | `base` (padrão), `default`, `neutral`, `dark` ou `forest` |
| `variables` | Sim | Objeto de strings; até 512 chaves |

Chaves seguem `^[A-Za-z][A-Za-z0-9]*$` (as mesmas de
`mermaid.overrides`). Valores são strings de 1–200 caracteres: cores
(`#rgb`, `rgb()`, `hsl()`), comprimentos (`px`, `em`, `%`), famílias de fonte e
números. `url(`, `var(`, `javascript:`, `@import`, `;{}<>`, controles e barra
invertida são rejeitados.

Limites: arquivo ≤ 256 KiB, até 100 arquivos custom, corpo do POST ≤ 256 KiB.
Nome embutido (`default`, `dark`, …), `auto` ou arquivo existente retornam
`409`.

## Importar pela UI

1. Abra o modal (engrenagem ou `Ctrl+,`) → **Temas → Importar**.
2. No bloco **Tema Mermaid**, informe o slug, escolha o `.mermaid.json` ou cole
   o JSON.
3. **Importar** grava o arquivo e adiciona o tema aos menus Claro/Escuro do
   bloco **Gráficos** em Aparência, além da lista de importados com **Remover**.

O painel também remove os temas importados
(`DELETE /__mermaid-themes/<slug>`); temas embutidos nunca podem ser apagados.

## Resolução no render

Quando qualquer origem — `theme.json` (`mermaid.theme`), preset do catálogo,
override por navegador ou cookie — aponta para um tema custom existente, o
payload do render vira:

```json
{
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#d97757",
    "lineColor": "#a14a2e"
  }
}
```

As `variables` do arquivo substituem o par derivado das cores + `overrides`.
O shape `{ light, dark }` do payload da página não muda.

Se o slug não existir na máquina (ou for removido enquanto o documento está
aberto), o render cai no embutido `default` e imprime um aviso uma vez no
stderr. Um cookie com nome desconhecido é descartado na validação contra a
lista dinâmica do servidor; nunca gera erro 500. O evento SSE
`mermaid-themes` mantém catálogo e menus atualizados, e a aba recarrega se o
tema ativo mudou ou sumiu.

## Endpoints

| Método | Rota | Efeito |
| --- | --- | --- |
| `GET` | `/__mermaid-themes` | Lista embutidos + custom com `theme` e `variables` |
| `POST` | `/__mermaid-themes` | Valida, grava `<slug>.mermaid.json` (`0600`, atômico) |
| `DELETE` | `/__mermaid-themes/<slug>` | Remove só um tema custom |
