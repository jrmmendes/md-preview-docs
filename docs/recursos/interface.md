---
title: Interface
sidebar_position: 3
description: Layout, sumário, histórico Recent, cópia de código, fontes, loaders, modo zen e painel de configurações.
---

A página é renderizada no servidor; o JavaScript cuida de TOC, histórico,
fontes, Mermaid, tree fences, cópia de código, loader e layout.

<figure>
  <img src="/img/features/ui-overview.png" alt="Tela do md-preview com sumário à esquerda, documento ao centro e histórico Recent à direita" />
  <figcaption>Layout de três colunas: sumário, documento e Recent.</figcaption>
</figure>

## Layout

| Coluna | Conteúdo |
| --- | --- |
| Esquerda | Sumário (TOC) |
| Centro | Documento |
| Direita | Histórico Recent |

As colunas laterais podem ser recolhidas; o estado fica em `localStorage`
(`mdprv_left_collapsed`, `mdprv_right_collapsed`). As divisórias ajustam a
largura, salva em `mdprv_width`, com mínimo de 28 rem. O botão de voltar ao topo
aparece após 300 px de rolagem.

## Sumário

<figure>
  <img src="/img/features/toc-outline.png" alt="Sumário à esquerda com títulos hierárquicos e o item ativo destacado" />
  <figcaption>O sumário lista os títulos com id, de h1 a h6.</figcaption>
</figure>

Lista todos os títulos com `id`. Clicar rola até a âncora e atualiza o hash; o
item visível é destacado com `IntersectionObserver`. Abrir uma URL com `#ancora`
posiciona o documento no título.

## Recent

Alimentado pelo SSE, sem polling: `snapshot` popula a lista ao conectar e
`slugs` a atualiza a cada registro. A ordem é do mais recente para o mais
antigo; o título do frontmatter tem prioridade sobre o nome do arquivo. O
histórico vive em memória e some quando o daemon reinicia.

## Copiar código

Passar o cursor ou focar um bloco `pre` (que não seja Mermaid) revela o botão
**Copy**, que usa a API Clipboard. Blocos Mermaid têm controles próprios.

## Fontes

O seletor troca a tipografia do documento. O catálogo vem do daemon, que usa
`fc-list` e mantém cache de 5 minutos; sem `fc-list`, restam as famílias
genéricas (`system-ui`, `sans-serif`, `serif`, `monospace`, `cursive`,
`fantasy`). A busca ignora acentos e ordena por relevância (exata, prefixo,
palavra, substring, subsequência), com no máximo 80 resultados.

A escolha fica em `localStorage` (`mdprv_font`) e é aplicada no `<head>` para
evitar o piscar da fonte. O Google Fonts é opcional: o navegador pede ao daemon,
que faz o proxy e reescreve os `.woff2` para `/__fonts/file/<sha256>`. Os
endpoints estão em [Daemon](/referencia/daemon).

## Loaders

| Loader | Aparência |
| --- | --- |
| `classic` | Círculo giratório (padrão) |
| `dots` | Três pontos pulsando |
| `bars` | Barras animadas |
| `ring` | Anel girando |
| `pulse` | Pulso radial |
| `braille` | Caracteres braille |

O loader aparece em navegações e recargas e é removido após 8 segundos. É salvo
em `mdprv_loader`, pode vir de `config.json` (`loader`) ou de `MDPRV_LOADER`, e
respeita `prefers-reduced-motion`.

## Modo zen

Ativado pelo botão da barra ou pela tecla `z`. Esconde as colunas laterais e não
é persistido: recarregar volta ao layout normal. A tecla é ignorada quando o
foco está em campos de texto ou há `Ctrl`, `Cmd` ou `Alt` pressionado.

## Painel de configurações

<figure>
  <img src="/img/features/settings-panel.png" alt="Painel de configurações com seletor de tema, fonte, loader e sensibilidade de zoom" />
  <figcaption>O painel reúne tema, fonte, loader e sensibilidade de zoom.</figcaption>
</figure>

| Controle | Persistência | Padrão |
| --- | --- | --- |
| Tema | cookie `mdprv_theme` | `auto` |
| Fonte | `localStorage` `mdprv_font` | sistema |
| Loader | `localStorage` `mdprv_loader` | `classic` |
| Zoom do Mermaid | `localStorage` `mdprv_zoom_sensitivity` | `1.1` |

A sensibilidade de zoom aceita valores entre 1,01 e 3.

## Atalhos

| Contexto | Tecla | Ação |
| --- | --- | --- |
| Página | `z` | Alterna o modo zen |
| Lightbox Mermaid | `Esc` | Fecha |
| Tree fence | `Enter` / `Espaço` | Expande ou recolhe |
| Tree fence | `↑` / `↓` / `←` / `→` | Navega e recolhe/expande |
| Seletor de fontes | `↑` / `↓`, `Enter`, `Esc` | Navega, aplica, fecha |

Sem JavaScript, o documento continua legível; ficam de fora diagramas,
histórico, TOC interativo e controles.
