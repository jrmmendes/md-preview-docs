---
title: Interface
sidebar_position: 3
description: Layout, sumário, histórico Recent, fechar documento, visão raw do Markdown, tabelas interativas, cópia de código, fontes, loaders, modo zen e painel de configurações.
---

A página é renderizada no servidor; o JavaScript cuida de TOC, histórico,
fontes, Mermaid, tree fences, tabelas interativas, visão raw do Markdown, cópia
de código, loader e layout.

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

## Fechar um documento

Cada item do Recent tem um `×` próprio. Não existe um `×` global no cabeçalho.

O `×` desregistra o documento no daemon (`DELETE /__doc/<slug>`): ele sai do
Recent e deixa de ser observado. O arquivo **não** é apagado do disco e nada é
gravado em `localStorage`; para voltar a abri-lo, rode `md-preview <arquivo>` de
novo.

Ao fechar o documento atual — ou o último item da lista — a área do documento dá
lugar ao estado vazio **No document open**, com o foco no título e a instrução
para abrir um arquivo pela CLI ou escolher outro item do Recent. Ao fechar outro
item, o foco vai para o próximo `×`. A região viva anuncia `Document closed`;
uma falha anuncia `Could not close document` e mantém o item na lista.

A interface não tem seletor de pasta. Para registrar todos os Markdown de um
diretório, use o comando [`md-preview folder`](/referencia/cli#folder).

## Copiar código

Passar o cursor ou focar um bloco `pre` (que não seja Mermaid) revela o botão
**Copy**, que usa a API Clipboard. Blocos Mermaid e
[diff](/recursos/markdown#diff-fences) têm controles próprios e não recebem o
botão.

## Tabelas interativas

Cada tabela GFM e cada fence `csv` ganha uma toolbar com pesquisa, cabeçalho da
primeira linha/coluna, pivô, cópia e tela cheia; o `csv` acrescenta o **Raw** do
bloco. A grade mostra letras nas colunas e números nas linhas; clique em uma
letra ou número para selecionar a coluna ou a linha inteira.

| Contexto | Controle | Ação |
| --- | --- | --- |
| Grade | clique, arraste | seleciona célula ou intervalo |
| Grade | `Shift`+clique/seta | estende a seleção a partir da âncora |
| Grade | `Ctrl`/`Cmd`+clique | soma um novo intervalo à seleção |
| Grade | setas, `Home`/`End`, `PageUp`/`PageDown` | navega entre células |
| Grade | `Esc` | limpa a seleção; com a pesquisa aberta, fecha e limpa o filtro |
| Cabeçalho | clique ou `Enter`/`Espaço` | ordena asc → desc → ordem original |
| Cabeçalho | funil | abre o filtro por valor da coluna |
| Alça da letra | arraste, setas, duplo clique ou `Home` | redimensiona pela borda direita ou ajusta ao conteúdo |
| Toolbar | copiar | TSV do intervalo selecionado ou Markdown da tabela exibida |
| Toolbar | tela cheia | abre o diálogo centralizado com zoom de 60% a 220% |

A tabela começa sem nenhuma célula selecionada. Clicar fora dela limpa a
seleção, assim como `Esc`; cliques no popover do funil, na toolbar e na própria
grade preservam o que está selecionado.

O popover do funil tem busca interna, frequência por valor, **Selecionar
todos** e **Limpar**; o contador da toolbar considera a pesquisa global e todos
os filtros de coluna. A pesquisa abre à esquerda com fade e não desloca os
outros botões. O pivô desliga temporariamente o cabeçalho e a ordenação e limpa
os filtros por coluna; ao voltar, restaura o cabeçalho e a ordenação anteriores.

Na tela cheia, o próprio componente passa para um diálogo centralizado, com a
moldura e o raio originais — filtros, seleção e larguras continuam os mesmos.
Arraste pelo título, pelo fundo da toolbar, com o botão do meio ou com `Espaço`
pressionado para mover a tabela; arrastar sobre as células continua
selecionando. As alças nas bordas e nos cantos redimensionam em simetria, com o
centro fixo, entre cerca de 40% e 200% do palco, já descontado o zoom; as alças
também respondem às setas. Use `+`/`−` para o zoom de 60% a 220% e o botão de
porcentagem para voltar a 100% e recentralizar; duplo clique recentraliza e
devolve o tamanho natural, mantendo o zoom. `Esc`, o botão de fechar ou um
clique no fundo encerram. O zoom usa a escala do bloco, não o `font-size` do
documento, então a grade mantém o alinhamento.

O estado é só de memória: recarregar volta ao estado inicial de filtros,
ordenação, seleção, larguras e pivô. A exceção é o tamanho escolhido na tela
cheia, guardado no `sessionStorage` por documento e tabela
(`mdprv:table-lb:v1:<documento>:<tabela>`): fechar e reabrir, ou recarregar a
mesma aba, restaura o tamanho; uma aba nova começa no padrão. Duplo clique e o
botão de porcentagem apagam o valor salvo. A toolbar fica escondida até o
JavaScript iniciar; sem ele, a tabela continua legível e rolável. A grade
acompanha o tamanho de fonte do documento.

## Markdown raw

A barra flutuante no topo do documento traz os botões **Raw** e **Copy raw** —
ela só aparece com um documento aberto. **Raw** troca o documento renderizado
pela fonte Markdown, com o frontmatter incluído; o mesmo botão volta à leitura
normal e `aria-pressed` marca o estado.

A fonte vem do payload da página e não do corpo renderizado, então o HTML
continua sem frontmatter. Na primeira abertura de cada documento o cliente pede
`/__raw-highlight` ao daemon, que realça a fonte com Shiki usando o tema ativo;
até a resposta chegar — ou se ela falhar — o texto aparece sem realce. A troca
não muda a URL nem mexe no Recent.

**Copy raw** copia a fonte intacta, com frontmatter e sem depender do realce, e
mostra o check por cerca de 1,2 s. No modo zen a barra inteira some; com a raw
view aberta, entrar no zen volta ao documento renderizado.

Enquanto a raw view está aberta, tabelas `csv` também entram em raw e o botão
**Raw** do bloco fica desabilitado; ao voltar ao documento, cada bloco recupera
o estado anterior. Tabelas GFM não têm raw por bloco — a raw view do documento
já mostra a fonte completa.

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
| Grade de tabela | setas | Navega entre células |
| Grade de tabela | `Shift`+clique ou `Shift`+seta | Estende a seleção a partir da âncora |
| Grade de tabela | `Ctrl`/`Cmd`+clique | Soma um intervalo à seleção |
| Grade de tabela | `Home` / `End` | Vai ao início ou ao fim da linha |
| Grade de tabela | `PageUp` / `PageDown` | Pula cinco linhas |
| Grade de tabela | `Esc` | Limpa a seleção; com a pesquisa aberta, fecha o filtro antes |
| Tela cheia da tabela | `Espaço`+arraste | Move a tabela |
| Tela cheia da tabela | `Esc` | Fecha; antes, fecha o popover do funil |
| Lightbox (diagrama ou imagem) | `Esc` | Fecha |
| Tree fence | `Enter` / `Espaço` | Expande ou recolhe |
| Tree fence | `↑` / `↓` / `←` / `→` | Navega e recolhe/expande |
| Seletor de fontes | `↑` / `↓`, `Enter`, `Esc` | Navega, aplica, fecha |

Sem JavaScript, o documento continua legível; ficam de fora diagramas,
histórico, TOC interativo, visão raw e controles. Diffs ficam na visão inline.
