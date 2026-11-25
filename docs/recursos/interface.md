---
title: Interface
sidebar_position: 3
description: Layout, sumário, histórico Recent, fechar documento, visão raw do Markdown, tabelas interativas, cópia de código, fontes, loaders, modo zen e modal de configurações.
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
diretório, use [`md-preview <pasta>`](/referencia/cli#abrindo-uma-pasta).

## Aba, foco e navegação

Cada aba conectada informa ao daemon, na conexão SSE (`/__events?doc=<slug>`),
qual documento está mostrando. Quando a CLI registra outro arquivo, o daemon
escolhe o destino sem abrir uma aba nova:

| Situação | O que a aba faz |
| --- | --- |
| Já mostra o documento pedido | só tenta trazer a aba para frente |
| Mostra outro documento | navega a própria aba para a URL nova |
| Nenhuma aba conectada | a CLI chama o opener do sistema |

A navegação é uma troca de documento na mesma aba, com o loader normal;
`?theme=` da URL nova é preservado. Se a aba já está no destino, não há recarga:
o evento `activate` só pede foco.

O foco é melhor esforço porque o navegador exige gesto do usuário para uma
página em segundo plano trazer a janela para frente. Ao receber `activate`, o
cliente chama `window.focus()` e, quando a aba está oculta ou sem foco:

- prefixa o título com `●` (`● notas.md`) até a aba voltar a ficar visível e
  focada;
- marca o ícone com `navigator.setAppBadge(1)`, limpando em
  `clearAppBadge()` ao focar;
- se a permissão de notificações **já** estiver concedida, mostra uma
  notificação curta cujo clique tenta focar a aba. A permissão nunca é pedida
  automaticamente.

Se o navegador ignorar `window.focus()`, a aba continua no lugar: o título, o
badge e a notificação (quando permitida) são as pistas para encontrá-la. O
md-preview não usa `wmctrl`, `xdotool` ou XDG Activation para manipular janelas
do sistema — isso não é portátil e não funciona na maioria dos ambientes
Wayland.

Para reabrir com uma aba nova, feche a aba atual (ou use `--open-browser`). Se
todas as abas forem fechadas, a próxima execução abre o navegador normalmente.

## Copiar código

Passar o cursor ou focar um bloco `pre` (que não seja Mermaid) revela o botão
**Copy**, que usa a API Clipboard. Blocos Mermaid e
[diff](/recursos/markdown#diff-fences) têm controles próprios e não recebem o
botão: o diff copia o patch e o diagrama Mermaid copia o desenho como imagem.

## Tabelas interativas

Cada tabela GFM e cada fence `csv` ganha uma toolbar com pesquisa, cabeçalho da
primeira linha/coluna, pivô, cópia e tela cheia; o `csv` acrescenta o **Raw** do
bloco. A grade mostra letras nas colunas e números nas linhas; clique em uma
letra ou número para selecionar a coluna ou a linha inteira.

| Contexto | Controle | Ação |
| --- | --- | --- |
| Grade | clique, arraste | seleciona célula ou intervalo |
| Grade | duplo clique, duplo toque ou `Enter` | abre o conteúdo completo da célula |
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

Em **Widgets → Tabelas**, **Quebra automática de linhas** (desligada por padrão)
faz células e cabeçalhos longos quebrarem em várias linhas e a altura da linha
acompanhar o conteúdo, em vez de truncar com reticências. A opção vale para a
grade normal, a tela cheia e estados filtrados/ordenados; o painel de detalhe da
lightbox continua com leitura em `pre-wrap`.

Duplo clique (ou duplo toque no celular) em uma célula de dados abre o conteúdo
completo na **mesma lightbox** da tela cheia, mesmo quando a grade trunca o
texto. `Enter` faz o mesmo na célula ativa. O título mostra a coluna e a linha
visível, o corpo preserva quebras de linha e o HTML já renderizado na grade (sem
re-renderizar Markdown), e **Copiar** leva o texto para a área de transferência
com o aviso **Copiado**. A entrada de texto herda o backdrop desfocado, o **X**,
o `Esc`, o foco preso, as alças de redimensionamento, o zoom de 60% a 220% e o
arraste pelo título ou com `Espaço`; duplo clique no título recentraliza sem
resetar o zoom. Cabeçalhos, alças de redimensionamento e links/botões dentro da
célula não abrem o detalhe. Ao abrir a partir da tabela em tela cheia, a tabela
volta ao documento e a mesma lightbox passa a mostrar o detalhe — há um único
backdrop. Fechar devolve o foco à célula de origem; se o detalhe foi aberto da
tela cheia, a tabela permanece no documento (não reabre em tela cheia).

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

## Configurações

O botão de engrenagem no canto inferior esquerdo (ou `Ctrl+,` / `Cmd+,`) abre o
modal de configurações. A barra lateral tem **Temas** (com as páginas **Temas**
e **Importar**), **Aparência**, **Widgets** e **Sistema**. `Esc`, o botão de
fechar ou um clique fora fecham o modal; ao fechar, a âncora original do
documento é restaurada.

O modal usa o fluxo **rascunho → salvar**: nenhuma alteração toca o documento,
cookies ou `localStorage` antes de **Salvar** (ícone de disquete ao lado do
fechar ou `Ctrl`/`Cmd`+`S`). Com alterações pendentes, a borda do modal fica
destacada e a região viva anuncia “Alterações não salvas”; o disquete some
quando não há nada para salvar. Fechar por `Esc`, `X` ou clique fora descarta o
rascunho silenciosamente e reabrir mostra os valores efetivos. Salvar aplica
tudo de uma vez; se tema, Shiki ou Mermaid mudaram, a página recarrega uma única
vez com o loader e o modal reabre na mesma rota.

<figure>
  <img src="/img/features/settings-modal.png" alt="Modal de configurações aberto na página Temas, com a grade de temas" />
  <figcaption>O modal reúne Temas, Aparência, Widgets e Sistema em uma janela única.</figcaption>
</figure>

### Temas

A página **Temas** mostra a grade dos nove temas embutidos (mais os temas de
usuário). A escolha fica no rascunho e só é aplicada ao salvar: cookie
`mdprv_theme`, CSS de `/__theme-css` e atributos `data-theme`/`data-scheme`.
Fonte, loader, código e gráficos não personalizados passam a herdar o preset do
tema escolhido. O bloco **Tema** tem um ícone de importar que leva a
**Temas → Importar**.

### Importar

A página **Importar** (`Temas → Importar`) reúne os três importadores em
blocos iguais: campo de nome, textarea ou arquivo, validação inline e lista dos
temas importados com ação **Remover**.

| Bloco | Aceita | Endpoint |
| --- | --- | --- |
| Tema de cores | `theme.json` completo | `POST/DELETE /__themes` |
| Tema Shiki | `.shiki.json` ou tema VS Code/TextMate cru | `POST/DELETE /__shiki-themes` |
| Tema Mermaid | `.mermaid.json` | `POST/DELETE /__mermaid-themes` |

Importar apenas adiciona o tema ao catálogo. Para usá-lo, escolha-o na grade de
**Temas** ou nos menus Claro/Escuro dos blocos **Código** e **Gráficos** em
**Aparência**. Os menus continuam listando embutidos e importados; o ícone de
importar (seta para bandeja) no cabeçalho dos blocos **Código**, **Gráficos** e
**Tema** leva de volta à página Importar.

### Aparência

| Bloco | O que ajusta |
| --- | --- |
| Fonte | Família usada no documento; catálogo do sistema + Google Fonts |
| Loader | Uma das seis animações de carregamento |
| Código | Tema Shiki claro e escuro, com prévia real do código |
| Gráficos | Tema Mermaid claro e escuro, com prévia dos diagramas |

Cada bloco tem três ações em ícones à direita do título:

| Ícone | Ação |
| --- | --- |
| Lápis | Liga/desliga **Personalizar**. Desligado, o bloco segue o preset do tema; ligado, os valores ficam no rascunho e, ao salvar, vão para o navegador |
| Seta circular | **Restaurar do tema**: volta os valores ao preset atual mantendo a personalização; fica desabilitada quando o bloco não está personalizado |
| Seta para bandeja | **Importar tema…**: abre **Temas → Importar** (só em Código, Gráficos e no bloco Tema) |

Em **Gráficos**, o menu de exemplo (camadas) fica na mesma linha, à esquerda
desses ícones. As prévias do modal já mostram o rascunho; nada muda no documento
antes de salvar. Fonte, loader, zoom, modos simples e quebra automática de
linhas aplicam ao salvar; Shiki e
Mermaid são renderizados no servidor e exigem **um único reload**, preservando a
rota do documento e exibindo o loader.

### Widgets

| Controle | Persistência | Padrão |
| --- | --- | --- |
| Sensibilidade do zoom (Mermaid) | `localStorage` `mdprv_zoom_sensitivity` | `1.1` |
| Modo de tabela simples | `localStorage` `mdprv_simple_table` | desligado |
| Quebra automática de linhas | `localStorage` `mdprv_table_wrap` | desligado |
| Modo de diff simples | `localStorage` `mdprv_simple_diff` | desligado |

A sensibilidade de zoom aceita valores entre 1,01 e 3, em passos de 0,05, e vale
para a tela cheia dos diagramas depois de salvar. O modo de tabela simples oculta
as letras, os números e a moldura de planilha, mantendo filtros, seleção e
gráficos. A quebra automática de linhas faz células e cabeçalhos longos crescerem
em várias linhas, em vez de truncar com reticências; desligada, mantém o
comportamento compacto de uma linha. O modo de diff simples oculta metadados de
arquivo e cabeçalhos de hunk — veja
[Diff fences](/recursos/markdown#modo-simples-de-diff). Os controles entram no
mesmo rascunho do modal e só são gravados ao salvar.

### Sistema

A página Sistema é somente leitura:

- **Daemon** — porta, minutos de inatividade e se os temas embutidos são copiados
  ao iniciar. Os valores vêm de `config.json` e das variáveis `MDPRV_*`; mudanças
  exigem reiniciar o daemon.
- **Caminhos** — arquivo de configuração, diretório de temas e arquivo de
  estado, com botão para copiar.
- **Restaurar padrões** — limpa apenas as preferências locais do modal
  (`mdprv_theme`, `mdprv_font`, `mdprv_loader`, `mdprv_blocks`, `mdprv_shiki`,
  `mdprv_mermaid`, `mdprv_prefs`, `mdprv_zoom_sensitivity`, `mdprv_simple_table`,
  `mdprv_table_wrap`, `mdprv_simple_diff`) e recarrega no tema padrão. Largura do
  conteúdo e colunas recolhidas são mantidas.

### O que fica salvo

| Preferência | Onde |
| --- | --- |
| Tema | cookie `mdprv_theme` |
| Shiki e Mermaid personalizados | `localStorage` `mdprv_shiki` / `mdprv_mermaid` + cookie `mdprv_prefs` |
| Quais blocos estão personalizados | `localStorage` `mdprv_blocks` |
| Fonte | `localStorage` `mdprv_font` |
| Loader | `localStorage` `mdprv_loader` |
| Zoom, tabela e diff simples | `localStorage` `mdprv_zoom_sensitivity`, `mdprv_simple_table`, `mdprv_simple_diff` |

O cookie `mdprv_prefs` carrega somente Shiki e Mermaid, como transporte para o
renderizador do daemon; o servidor valida os nomes contra as allowlists e ignora
cookies inválidos.


## Atalhos

| Contexto | Tecla | Ação |
| --- | --- | --- |
| Página | `z` | Alterna o modo zen |
| Página | `Ctrl+,` / `Cmd+,` | Abre ou fecha as configurações |
| Configurações | `Ctrl+S` / `Cmd+S` | Salva o rascunho do modal |
| Configurações | `Esc` | Fecha e descarta o rascunho |
| Grade de tabela | setas | Navega entre células |
| Grade de tabela | `Enter` | Abre o detalhe da célula ativa |
| Grade de tabela | `Shift`+clique ou `Shift`+seta | Estende a seleção a partir da âncora |
| Grade de tabela | `Ctrl`/`Cmd`+clique | Soma um intervalo à seleção |
| Grade de tabela | `Home` / `End` | Vai ao início ou ao fim da linha |
| Grade de tabela | `PageUp` / `PageDown` | Pula cinco linhas |
| Grade de tabela | `Esc` | Limpa a seleção; com a pesquisa aberta, fecha o filtro antes |
| Detalhe da célula | `Esc` | Fecha e devolve o foco à célula |
| Detalhe da célula | `Tab` / `Shift`+`Tab` | Percorre as ações sem sair da lightbox |
| Detalhe da célula | `Espaço`+arraste | Move o painel de texto |
| Lightbox da tabela | `Espaço`+arraste | Move a tabela |
| Lightbox da tabela | `Esc` | Fecha; antes, fecha o popover do funil |
| Lightbox (diagrama ou imagem) | `Esc` | Fecha |
| Tree fence | `Enter` / `Espaço` | Expande ou recolhe |
| Tree fence | `↑` / `↓` / `←` / `→` | Navega e recolhe/expande |
| Seletor de fontes | `↑` / `↓`, `Enter`, `Esc` | Navega, aplica, fecha |

Sem JavaScript, o documento continua legível; ficam de fora diagramas,
histórico, TOC interativo, visão raw e controles. Diffs ficam na visão inline.
