---
title: Temas Shiki
sidebar_position: 3
description: Catálogo embutido de 65 temas, formato .shiki.json, importação pelo modal, limites e remoção.
---

O bloco de código usa [Shiki](https://shiki.style) para colorir fences. O
md-preview embarca os **65 temas** de `@shikijs/themes@3.23.0`, carregados sob
demanda, e permite importar temas próprios pela página **Código** do modal de
configurações.

## Catálogo embutido

`GET /__shiki-themes` e o payload da página expõem a lista completa:

```json
[
  { "name": "github-light", "label": "Github Light", "kind": "light", "source": "builtin" },
  { "name": "tokyo-night", "label": "Tokyo Night", "kind": "dark", "source": "builtin" }
]
```

`kind` é a polaridade do tema (`light`/`dark`), usada para agrupar os menus do
modal. Um tema escuro pode ser escolhido no card claro (é uma escolha do
usuário), mas o item continua marcado como escuro. No `theme.json`, use o nome
em `shiki.light`/`shiki.dark`; veja [theme.json](/referencia/theme-json).

## Importar pela UI

1. Abra o modal (engrenagem ou `Ctrl+,`) → **Temas → Importar**.
2. No bloco **Tema Shiki**, informe um **nome** (slug `[a-z0-9-]`, até 32
   caracteres), escolha um arquivo `.json` ou cole o JSON.
3. **Importar** grava o arquivo e adiciona o tema aos menus Claro/Escuro do
   bloco **Código** em Aparência, além da lista de importados com **Remover**.

O campo aceita o wrapper `.shiki.json` **ou** o JSON cru de um tema
VS Code/TextMate. O cliente detecta o formato e monta o wrapper antes de
enviar. `.tmTheme` (plist) **não** é aceito: seria necessário um parser
adicional.

Se você colar um `theme.json` de **cores** (o arquivo completo da página) neste
painel, o cliente recusa antes de enviar e indica o lugar certo: **Temas →
Importar → Tema de cores**. Os dois contratos são diferentes: `theme.json` tem
`colors`/`shiki`/`mermaid` no topo; `.shiki.json` tem um wrapper `theme` para o
highlighter.

### Wrapper aceito pelo servidor

```json
{
  "schemaVersion": 1,
  "name": "minha-paleta",
  "type": "dark",
  "theme": {
    "name": "minha-paleta",
    "type": "dark",
    "colors": {
      "editor.background": "#0b0e14",
      "editor.foreground": "#e6e6e6"
    },
    "tokenColors": [
      {
        "scope": ["source.ts", "source.tsx"],
        "settings": { "foreground": "#c0caf5", "fontStyle": "italic" }
      }
    ]
  }
}
```

### JSON cru aceito na UI

```json
{
  "name": "minha-paleta",
  "type": "dark",
  "colors": {
    "editor.background": "#0b0e14",
    "editor.foreground": "#e6e6e6"
  },
  "tokenColors": [
    { "scope": "source.ts", "settings": { "foreground": "#c0caf5" } }
  ]
}
```

## Arquivo em disco

O daemon grava `<slug>.shiki.json` em `~/.config/md-preview/themes`
(ou `MDPRV_CONFIG_DIR/themes`). A escrita é atômica e **nunca sobrescreve**:
nome embutido, `auto` ou arquivo existente retornam `409`.

Regras e cotas:

| Item | Limite |
| --- | --- |
| Arquivo | 256 KiB |
| Temas custom | 100 arquivos |
| `theme.colors` | 1.024 chaves, `^[A-Za-z][A-Za-z0-9._-]*$`, cor segura |
| `theme.settings` / `tokenColors` | 2.000 itens; `scope` com 2.048 caracteres (ou 50 escopos) |
| `theme.semanticTokenColors` | 512 chaves |
| Cor | `#rgb[a]`, `rgb()`, `hsl()`, `transparent`; `url()`, `var()` e controles são rejeitados |
| `type` | `light`/`dark`; se ausente, inferido de `editor.background`/`bg` |

O nome interno do registro no highlighter inclui um hash do conteúdo
(`mdprv-<slug>-<sha8>`), então editar o arquivo invalida o cache de render sem
descarregar a versão anterior até o processo reiniciar.

## Importar não aplica

Importar só adiciona o tema ao catálogo. Para usá-lo, escolha-o no menu do
card **Claro** ou **Escuro**; isso liga a personalização do bloco Código (se
necessário) e grava `mdprv_shiki` + o cookie `mdprv_prefs`. A preferência é por
navegador, não altera `theme.json`/`config.json`.

## Remover

Apagar o arquivo no filesystem é suficiente: o watch do daemon emite
`shiki-themes` e a aba recarrega se o tema estiver ativo; o card cai no fallback
`github-light`/`github-dark`. Também é possível usar
`DELETE /__shiki-themes/<slug>` (mesmas checagens de origem do
`DELETE /__doc/`).

## Veja também

- [theme.json](/referencia/theme-json)
- [Temas Mermaid](/referencia/temas-mermaid)
- [Temas](/recursos/temas) para importar um tema de cores completo

## Portabilidade

`theme.json` pode apontar para um slug custom que não existe na máquina atual.
A validação aceita o slug; no render, o slot ausente cai em
`github-light`/`github-dark`. `md-preview theme validate` imprime um aviso nesse
caso.
