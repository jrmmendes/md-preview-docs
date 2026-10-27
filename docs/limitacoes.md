---
title: Limitações
sidebar_position: 20
description: O que o md-preview deliberadamente não faz e qual usar no lugar.
---

O md-preview é deliberadamente pequeno. Esta página lista o que **não** está
incluído, para evitar expectativas erradas.

## Sem busca de texto completo

Não há índice nem busca entre documentos. A coluna Recent lista apenas os
documentos registrados, sem filtrar por conteúdo.

**Alternativas:** `grep -R` no projeto, a busca do editor, ou uma ferramenta de
documentação com índice.

## Sem exportação para PDF ou HTML

A interface não gera arquivos. A página é servida dinamicamente e o HTML contém
scripts e URLs próprias do daemon.

**Alternativas:** a ferramenta de impressão do navegador para PDF (resultado não
é um formato suportado), ou um gerador de site dedicado.

## Sem admonitions, KaTeX e emoji

O Markdown não interpreta:

| Recurso | Situação |
| --- | --- |
| `:::note` / `:::warning` | Não existe extensão de admonitions |
| `$...$` / `$$...$$` | Sem KaTeX ou MathJax |
| `:smile:` | Sem shortcodes de emoji |

**Alternativas:** use blockquotes com um rótulo em negrito, HTML inline para
callouts simples (`<details>`), imagens para fórmulas e emoji Unicode literal.
Lembre que HTML inline passa pela CSP e scripts continuam bloqueados.

## Mermaid depende de JavaScript

Diagramas Mermaid são renderizados no cliente. Sem JavaScript, o bloco aparece
como texto. Não há pré-renderização para SVG no servidor.

**Alternativa:** exporte o diagrama em outra ferramenta e inclua como imagem.

## Shiki cobre nove linguagens

Só JavaScript, TypeScript, JSON, Lua, Bash, HTML, CSS, Markdown e Python têm
realce. Outras linguagens caem no bloco de código sem cores.
**Alternativa:** um fence sem linguagem, ou aceitar o bloco sem realce.

## Não existe rota raiz

`/` responde `404`. O md-preview não tem “documento inicial” nem índice
automático.

**Alternativa:** registre um documento com slug conhecido e use essa URL, ou crie
um índice manual com links para os demais slugs.

## Histórico em memória

O Recent não é persistido. Reiniciar o daemon — inclusive por inatividade — limpa a
lista.

**Alternativa:** mantenha um arquivo de índice com links, ou reexecute a CLI com
os arquivos que quer reabrir.

## Um documento por vez

Cada URL mostra um documento. Não há abas internas, navegação hierárquica entre
documentos nem “próximo/anterior”.

**Alternativa:** registre vários arquivos e navegue pelo Recent ou por links
Markdown entre documentos (usando as URLs do daemon).

## Imagens restritas ao diretório do documento

Imagens relativas só são servidas se estiverem dentro do diretório do documento
registrado. Symlinks para fora são bloqueados.

**Alternativa:** copie a imagem para o diretório do documento ou use uma URL
externa (que não passa pelo proxy de imagens).

## Sem colaboração ou acesso remoto

O daemon escuta apenas em loopback, valida `Host` e `Origin` e exige token para
mudanças de estado. Não há autenticação de usuários, TLS nem compartilhamento.

**Alternativa:** use a ferramenta na mesma máquina. Não exponha a porta.

## Interface sem i18n

Os rótulos da interface são fixos: a maioria em inglês (por exemplo, `Recent` e
`Copy`), com alguns controles em português (por exemplo, `Expandir tudo`). Esta
documentação é em português, mas o produto não tem seletor de idioma.

## Resumo

| Limitação | Impacto |
| --- | --- |
| Sem busca | Encontrar conteúdo é manual |
| Sem exportação | Compartilhar exige outra ferramenta |
| Sem admonitions/KaTeX/emoji | Markdown mais simples |
| Mermaid exige JavaScript | Diagramas ausentes sem JavaScript |
| 9 linguagens | Blocos de outras linguagens sem cor |
| Sem `/` | Toda visita precisa de um slug |
| Histórico volátil | Recent some ao reiniciar |
| Um documento por URL | Sem abas internas |
| Imagens restritas ao documento | Sem recursos compartilhados fora do diretório |
| Sem acesso remoto | Uso restrito à máquina |

Se alguma dessas ausências for bloqueante, o md-preview provavelmente não é a
ferramenta certa. Para o que ele faz bem, veja
[Markdown suportado](/guias/markdown) e [Interface e atalhos](/guias/interface).
