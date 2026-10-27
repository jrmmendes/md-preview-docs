---
title: Editores e pipe
sidebar_position: 8
description: Registrar arquivos, ler de stdin, usar --pipe e conectar o md-preview a qualquer editor ou script.
---

O md-preview tem dois modos de entrada: **arquivos** e **stdin**. Entender a
diferença evita a maior parte dos problemas de integração.

## Arquivos

```bash
md-preview caminho/do/doc.md
md-preview a.md b.markdown c.mdc
```

| Aspecto | Comportamento |
| --- | --- |
| Extensões | `.md`, `.markdown`, `.mdc` |
| Slug | Derivado do caminho relativo à raiz do Git ou `$HOME` |
| Live reload | Sim |
| Imagens relativas | Sim |
| Navegador | Só com `--open-browser` |
| Deduplicação | Por caminho real (symlinks incluídos) |

`.mdc` (formato de regras do Cursor) é renderizado como Markdown normal,
incluindo frontmatter YAML.

## stdin com `--pipe`

`--pipe` lê todo o stdin, grava um arquivo temporário e registra esse arquivo:

```bash
printf '# Rascunho\n\nGerado em %s\n' "$(date)" | md-preview --pipe
```

O arquivo fica em:

```text
${XDG_CACHE_HOME:-~/.cache}/md-preview/tmp/temp-<uuid>.md
```

Com `MDPRV_TMP_DIR`, o diretório é outro:

```bash
MDPRV_TMP_DIR=/tmp/preview cat doc.md | md-preview --pipe
```

Como existe um arquivo real em disco, o **live reload funciona**: editar o
temporário recarrega a página. Cada chamada cria um documento novo.

Regras de erro:

| Entrada | Resultado |
| --- | --- |
| `--pipe` com arquivos posicionais | Erro: não podem ser combinados |
| `--pipe` em um TTY | Erro: exige stdin pipe |
| stdin vazio ou só espaços | Erro: exige conteúdo |

```bash
# inválido: mistura arquivos e pipe
md-preview doc.md --pipe

# inválido: terminal interativo
md-preview --pipe
```

## `register`

`register` existe para quando o conteúdo **não** deve virar um arquivo de
projeto, mas você quer controlar o slug e, opcionalmente, o caminho observado.

```bash
cat rascunho.md | md-preview register --stdin --slug notas/rascunho
```

| Opção | Obrigatória | Efeito |
| --- | --- | --- |
| `--stdin` | Sim | Lê o Markdown do stdin |
| `--slug <slug>` | Sim | Define a URL, sem derivação do caminho |
| `--path <arquivo>` | Não | Habilita live reload e imagens relativas |

O comando imprime **somente o slug final** em stdout, o que facilita o uso em
scripts:

```bash
slug=$(cat nota.md | md-preview register --stdin --slug temp/nota)
echo "http://127.0.0.1:8766/$slug"
```

Erros vão para stderr com código de saída `1`. O navegador nunca é aberto por
`register`.

## Escolhendo o modo

| Necessidade | Use |
| --- | --- |
| Editar no editor e ver ao vivo | Arquivo |
| Conteúdo gerado por comando | `--pipe` |
| Conteúdo gerado, com slug estável | `register --stdin --slug` |
| Conteúdo gerado que também existe em disco | `register --path` |

## Como integrar com editores

A integração é sempre a mesma: executar a CLI com o caminho do arquivo atual. Se
o editor tiver um terminal integrado, basta:

```bash
md-preview "$ARQUIVO_ATUAL" --open-browser
```

Editores que preferem não abrir o navegador podem capturar a URL impressa e
entregá-la a um painel interno:

```bash
url=$(md-preview "$ARQUIVO_ATUAL" | tail -n 1)
printf 'preview: %s\n' "$url"
```

Exemplos concretos para Neovim e VS Code estão em
[Preview a partir do editor](/receitas/preview-no-editor).

## Scripts e automação

Como a CLI não abre o navegador por padrão, ela é segura em scripts:

```bash
#!/usr/bin/env bash
set -euo pipefail

for arquivo in docs/*.md; do
  md-preview "$arquivo"
done
```

Cada linha impressa é uma URL. Para abrir só a primeira:

```bash
md-preview docs/*.md --open-browser
```

:::tip[Um daemon, vários documentos]
Invocar a CLI várias vezes não cria vários daemons. A primeira chamada sobe o
processo; as seguintes só registram documentos no mesmo daemon.
:::

Para receitas completas, continue em [Múltiplos arquivos](/receitas/multiplos-arquivos)
e [Pipe de comando](/receitas/pipe).
