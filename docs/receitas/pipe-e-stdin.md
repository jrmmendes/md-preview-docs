---
title: Pipe e stdin
sidebar_position: 1
description: Quando usar arquivos, --pipe ou register --stdin, e como o slug, o live reload e as imagens mudam em cada caso.
---

O md-preview aceita arquivos, stdin de um pipe e conteúdo avulso. Cada forma
tem um efeito diferente no slug, no live reload e nas imagens.

| Forma | Comando | Slug | Watch | Imagens |
| --- | --- | --- | --- | --- |
| Arquivos | `md-preview a.md b.md` | derivado do caminho | sim | sim |
| Pipe | `... \| md-preview --pipe` | `temp-<uuid>.md` | sim (temporário) | não |
| Stdin avulso | `... \| md-preview register --stdin --slug <slug>` | o `--slug` informado | não | não |
| Stdin + path | `... \| md-preview register --stdin --slug <slug> --path /abs/doc.md` | o `--slug` informado | sim | sim |

`--stdin`, `--slug` e `--path` são flags do subcomando `register`, não do
comando raiz. `--slug` é obrigatório.

## Arquivos

```bash
md-preview README.md docs/guia.markdown .cursor/rules.mdc
```

Aceita `.md`, `.markdown` e `.mdc`. Imprime uma URL por arquivo, na ordem dos
argumentos. O navegador só abre com `--open-browser`, uma vez, no primeiro
arquivo.

## Pipe

`--pipe` lê todo o stdin, grava um temporário e registra esse arquivo:

```bash
git log --oneline -20 | md-preview --pipe
```

O temporário fica em
`${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md` (override com
`MDPRV_TMP_DIR`), com permissão `0600`. Como existe um arquivo real, editá-lo
recarrega a página. Cada chamada cria um documento novo.

O comando falha se:

- houver arquivos posicionais junto com `--pipe`;
- o stdin for um terminal (`--pipe requires piped stdin`);
- o conteúdo for vazio.

O pipe só termina depois de ler todo o stdin. Saídas grandes aparecem quando o
produtor fecha o pipe.

## Register

Use `register` quando precisar de um slug estável ou quando o conteúdo não deve
virar um arquivo do projeto:

```bash
cat relatorio.md | md-preview register --stdin --slug relatorios/semana-12
```

Com `--path`, o daemon observa o arquivo e resolve imagens relativas a ele:

```bash
cat relatorio.md | md-preview register --stdin --slug relatorios/semana-12 --path "$PWD/relatorio.md"
```

O comando imprime somente o slug final em stdout:

```bash
slug=$(cat nota.md | md-preview register --stdin --slug temp/nota)
echo "http://127.0.0.1:8766/$slug"
```

`register` nunca abre o navegador.

## Vários arquivos

```bash
md-preview a.md ./a.md link-para-a.md b.md
```

Arquivos repetidos são descartados pelo caminho real, então `a.md`, `./a.md` e
um symlink para ele geram uma única entrada no Recent. Rodar o comando de novo
reutiliza a mesma entrada; cada registro reemite `slugs` e move o documento para
o topo do histórico.

O shell expande globs antes da CLI:

```bash
md-preview docs/*.md
```

## Limpar temporários

Os arquivos de `--pipe` não são apagados automaticamente:

```bash
rm -f "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp/"temp-*.md
```
