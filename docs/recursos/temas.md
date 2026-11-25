---
title: Temas
sidebar_position: 2
description: Os nove temas embutidos, a precedência entre URL, cookie e configuração e a sobreposição por temas de usuário.
---

O md-preview inclui nove temas. Cada um define cores, tipografia, layout,
paletas do Shiki e configuração do Mermaid.

| Tema | Tipo | Observação |
| --- | --- | --- |
| `auto` | automático | Segue `prefers-color-scheme` |
| `github-light` | claro | Neutro, alto contraste |
| `github-dark` | escuro | Equivalente escuro |
| `dracula` | escuro | Roxo e rosa |
| `gruvbox-dark` | escuro | Tons quentes |
| `gruvbox-light` | claro | Contraparte clara |
| `nord` | escuro | Azul-acinzentado |
| `solarized-dark` | escuro | Paleta Solarized |
| `solarized-light` | claro | Contraparte clara |

```bash
md-preview theme list          # nome e origem: builtin ou user
```

## Precedência

O tema é resolvido a cada requisição:

```text
?theme=  >  cookie mdprv_theme  >  config.json / MDPRV_THEME  >  auto
```

Um nome inexistente é ignorado e o próximo da lista é usado; a página não
quebra.

## Trocar de tema

- **CLI:** `md-preview guia.md --theme nord` valida o nome e acrescenta
  `?theme=nord` às URLs.
- **URL:** acrescente `?theme=solarized-light` à URL impressa pela CLI.
- **Painel:** o seletor grava o cookie `mdprv_theme` e recarrega a página.
- **Configuração:** `"theme": "nord"` em `config.json`, ou `MDPRV_THEME=nord`
  para uma invocação.

Um tema inválido na CLI encerra com `md-preview: unknown theme: <nome>`.

## Temas de usuário

Um arquivo em `~/.config/md-preview/themes/<nome>.json` sobrescreve o embutido
de mesmo nome em memória, campo a campo. Apagar o arquivo devolve o tema
original. O contrato completo está em [theme.json](/referencia/theme-json);
para criar um tema, siga [Criar tema](/receitas/criar-tema).

Editar um tema dispara um evento `themes`. Se o tema atual (ou uma variante de
`auto`) mudou, a aba recarrega. Arquivos inválidos, symlinks e arquivos maiores
que 256 KiB são ignorados com aviso.

## Coleções prontas

O repositório mantém coleções completas em `themes/<família>/`, fora do bundle e
do `theme seed`. A primeira é a **Tropical**, com par claro/escuro em tons
terrosos e quentes (ivory, coral, clay, kraft, céu e oliva): tema de cores,
Shiki e Mermaid. Veja [Temas prontos](/receitas/temas-prontos) para a lista de
arquivos, slugs e instalação.

## Importar um tema de cores

O caminho mais rápido para adicionar um `theme.json` completo é o modal:
**Temas → Importar → Tema de cores**. Cole o arquivo ou selecione o `.json`,
confirme o slug e clique em **Importar**. O servidor valida com o mesmo
`validateTheme` da CLI, grava `themes/<slug>.json` de forma atômica (`0600`),
sem sobrescrever arquivo ou nome embutido, e o tema entra na grade de **Temas**.
Erros aparecem inline. O painel também remove temas de usuário
(`DELETE /__themes/<slug>`); embutidos não podem ser apagados.

Equivalente pela CLI: salve o arquivo em `themes/` e rode
`md-preview theme validate <arquivo>`.

## Temas de diagramas (Mermaid)

Os menus do bloco **Gráficos** listam os cinco temas embutidos e qualquer
`<slug>.mermaid.json` importado. **Temas → Importar → Tema Mermaid** aceita o
arquivo e adiciona o tema ao catálogo. O formato e a resolução estão em
[Temas Mermaid](/referencia/temas-mermaid).

## Temas de código (Shiki)

Além do tema da página, o bloco de código aceita qualquer um dos 65 temas
Shiki embutidos e temas custom importados pelo modal (`.shiki.json` em
`~/.config/md-preview/themes`). Importar não altera o tema ativo: a escolha é
feita nos cards Claro/Escuro do bloco **Código** da página Aparência. Veja
[Temas Shiki](/referencia/temas-shiki).