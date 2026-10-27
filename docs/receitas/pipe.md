---
title: Pipe de comando
sidebar_position: 2
description: Renderizar a saída de qualquer comando com --pipe, controlar o diretório temporário e evitar os erros mais comuns.
---

`--pipe` transforma stdin em um documento observado. É o caminho para conteúdo
gerado por scripts, seleções de editor e comandos que produzem Markdown.

## Uso básico

```bash
printf '# Olá\n\nGerado às %s.\n' "$(date +%H:%M)" | md-preview --pipe
```

A URL termina com o nome do arquivo temporário:

```text
http://127.0.0.1:8766/temp-3f2c9a1e-7d4b-4c2a-9f10-2b8e6d5a1c77.md
```

O arquivo é gravado em:

```text
${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/
```

Cada chamada cria um UUID novo, portanto **um documento novo** no Recent. O
conteúdo anterior não é sobrescrito.

## A partir de um arquivo

```bash
md-preview --pipe < rascunho.md
cat rascunho.md | md-preview --pipe
```

O arquivo original não é registrado; o daemon observa a cópia temporária. Editar
`rascunho.md` **não** atualiza o preview. Para observar o original, use o modo
por arquivo:

```bash
md-preview rascunho.md
```

## A partir de um gerador

```bash
./scripts/gerar-relatorio.sh | md-preview --pipe --open-browser
```

```bash
git log --oneline -20 | sed 's/^/ - /' | md-preview --pipe
```

O comando só termina depois de ler todo o stdin. Saídas grandes funcionam, mas o
documento só aparece quando o produtor fecha o pipe.

## Diretório temporário

| Variável | Padrão |
| --- | --- |
| `XDG_CACHE_HOME` | `~/.cache` |
| `MDPRV_TMP_DIR` | `${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp` |

`MDPRV_TMP_DIR` tem precedência e é útil para testes ou instalações portáteis:

```bash
MDPRV_TMP_DIR=/tmp/mdprv cat doc.md | md-preview --pipe
```

O arquivo é criado com permissão `0600`. Os temporários **não são apagados
automaticamente**; limpe o diretório de vez em quando:

```bash
rm -f "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp/"temp-*.md
```

## Live reload

Como existe um arquivo real, o preview recarrega quando o temporário muda. Você
pode editar o arquivo diretamente:

```bash
$EDITOR "${XDG_CACHE_HOME:-$HOME/.cache}/md-preview/tmp/temp-<uuid>.md"
```

Isso é útil para ajustar o resultado de uma geração sem repetir o comando. O slug
continua o mesmo enquanto o arquivo existir.

## Erros esperados

| Comando | Erro |
| --- | --- |
| `md-preview --pipe` em um terminal | `--pipe requires piped stdin (received a TTY)` |
| `md-preview --pipe < /dev/null` | `--pipe requires Markdown content on stdin` |
| `md-preview a.md --pipe` | `--pipe cannot be combined with file arguments` |

Redirecione uma fonte real ou gere conteúdo:

```bash
# correto
echo '# título' | md-preview --pipe
```

## Quando preferir `register`

Use `--pipe` quando o slug temporário for aceitável. Use `register` quando
precisar de um slug estável:

```bash
cat relatorio.md | md-preview register --stdin --slug relatorios/semana-12
```

Se o conteúdo também existir em disco e você quiser live reload:

```bash
cat relatorio.md | md-preview register --stdin --slug relatorios/semana-12 --path relatorio.md
```

## Receita completa

Gerar um relatório diário e abrir o preview:

```bash
#!/usr/bin/env bash
set -euo pipefail

saida=$(mktemp)
trap 'rm -f "$saida"' EXIT

{
  echo "# Relatório — $(date +%F)"
  echo
  echo "## Commits"
  git log --since=midnight --pretty='- %h %s'
  echo
  echo "## Status"
  git status --short
} > "$saida"

md-preview --pipe --open-browser < "$saida"
```

O `trap` remove o arquivo intermediário, mas a cópia do md-preview permanece no
diretório temporário até você limpá-la.
