---
title: Interface e atalhos
sidebar_position: 5
description: Layout de três colunas, TOC, Recent, largura ajustável, loaders, modo zen, cópia de código e painel de configurações.
---

A página é renderizada no servidor e hidratada por pequenos scripts. O HTML
inicial já contém o documento, o tema e as opções; o JavaScript cuida só de
TOC, histórico, fontes, Mermaid, tree fences, lightbox, cópia de código, loader e
layout.

## Layout

Três colunas:

| Coluna | Conteúdo |
| --- | --- |
| Esquerda | Sumário (TOC) do documento |
| Centro | Documento renderizado |
| Direita | Histórico **Recent** |

As colunas laterais podem ser recolhidas, e o estado é persistido em
`localStorage` (`mdprv_left_collapsed` e `mdprv_right_collapsed`). Divisórias
entre as colunas ajustam a largura; a largura do conteúdo é salva em
`mdprv_width` e respeita um mínimo de **28 rem**.

O botão de voltar ao topo aparece após 300 px de rolagem.

## Sumário (TOC)

<figure>
  <img src="/img/features/toc-outline.png" alt="Sumário à esquerda com títulos hierárquicos e o item ativo destacado" />
  <figcaption>O sumário lista todos os títulos com `id`, de `h1` a `h6`.</figcaption>
</figure>

- lista `h1`–`h6` que tenham `id` (gerado automaticamente pelo Markdown);
- clicar em um item rola suavemente até a âncora e atualiza o hash da URL;
- o item visível é destacado com `IntersectionObserver`;
- abrir uma URL com `#ancora` posiciona o documento no título correspondente.

## Recent (histórico)

<figure>
  <img src="/img/features/recent-history.png" alt="Coluna Recent com documentos registrados em ordem reversa" />
  <figcaption>O título do frontmatter é usado quando existe; caso contrário, o nome do arquivo.</figcaption>
</figure>

A coluna é alimentada por SSE, não por polling:

- `snapshot` chega ao conectar e popula a lista;
- `slugs` chega quando um documento é registrado;
- a ordem é reversa, do mais recente para o mais antigo;
- o histórico vive em memória e é perdido quando o daemon reinicia;
- clicar em um item navega para o slug correspondente.

## Copiar código

Passar o cursor ou focar um bloco `pre` que **não** seja Mermaid revela o botão
**Copy**. O botão usa a API Clipboard e dá retorno visual após a cópia.

<figure>
  <img src="/img/features/copy-code.png" alt="Bloco de código com botão Copy visível ao passar o cursor" />
  <figcaption>O botão aparece ao passar o cursor e no foco por teclado, mantendo o bloco acessível.</figcaption>
</figure>

Blocos Mermaid têm controles próprios (lightbox), por isso ficam fora do seletor
`pre:not(.mermaid)`.

## Loaders de navegação

Ao navegar entre documentos ou recarregar, uma camada de carregamento cobre a
página com um dos seis estilos:

| Loader | Aparência |
| --- | --- |
| `classic` | Círculo giratório clássico (padrão) |
| `dots` | Três pontos pulsando |
| `bars` | Barras animadas |
| `ring` | Anel girando |
| `pulse` | Pulso radial |
| `braille` | Padrão de caracteres braille |

<figure>
  <img src="/img/features/loader.png" alt="Camada de carregamento com indicador circular durante a navegação" />
  <figcaption>O loader aparece em navegações e recargas; o tempo limite é de 8 segundos.</figcaption>
</figure>

O estilo é escolhido no painel de configurações e salvo em `mdprv_loader`. Ele
também pode ser definido em `config.json` (`loader`) ou por `MDPRV_LOADER`. Após
**8 segundos**, a camada é removida para não travar a página. Com
`prefers-reduced-motion: reduce`, as animações são reduzidas.

## Modo zen

<figure>
  <img src="/img/features/zen-mode.png" alt="Documento em modo zen, sem as colunas laterais" />
  <figcaption>O modo zen esconde as colunas laterais e deixa o texto em primeiro plano.</figcaption>
</figure>

Ative pelo botão na barra ou pela tecla **`z`**. A tecla é ignorada quando o foco
está em `input`, `select`, `textarea` ou em um elemento `contenteditable`, e
quando há `Ctrl`, `Cmd` ou `Alt` pressionado.

O modo zen não é persistido: recarregar a página volta ao layout normal.

## Painel de configurações

O painel reúne quatro controles:

| Controle | Persistência | Padrão |
| --- | --- | --- |
| Tema | cookie `mdprv_theme` | `auto` |
| Fonte | `localStorage` `mdprv_font` | sistema |
| Loader | `localStorage` `mdprv_loader` | `classic` |
| Sensibilidade de zoom | `localStorage` `mdprv_zoom_sensitivity` | `1.1` |

A sensibilidade de zoom controla o passo do zoom do Mermaid na rolagem e aceita
valores entre **1,01 e 3**. Valores fora da faixa são ajustados para o padrão.

## Atalhos

| Contexto | Tecla | Ação |
| --- | --- | --- |
| Página | `z` | Alterna o modo zen |
| Lightbox Mermaid | `Esc` | Fecha o lightbox |
| Tree fence | `Enter` / `Espaço` | Expande ou recolhe o diretório focado |
| Tree fence | `↑` / `↓` | Move entre linhas visíveis |
| Tree fence | `←` / `→` | Recolhe ou expande |
| Seletor de fontes | `↑` / `↓` | Navega nos resultados |
| Seletor de fontes | `Enter` | Aplica a fonte destacada |
| Seletor de fontes | `Esc` | Fecha a lista |

## Renderização no servidor e hidratação

O conteúdo do documento, o tema e as opções são renderizados no servidor. No
navegador, cada script inicializa só o que precisa:

- TOC, Recent e live reload escutam o SSE;
- Mermaid renderiza os diagramas depois de interpretar o Markdown;
- tree fences habilitam teclado e botões globais;
- fontes consultam `/__fonts` sob demanda;
- copiar e lightbox delegam eventos no documento.

Sem JavaScript, o documento continua legível; ficam de fora os diagramas, o
histórico, o TOC interativo e os controles.
