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
- **URL:** `http://127.0.0.1:8766/docs/guia?theme=solarized-light`.
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
