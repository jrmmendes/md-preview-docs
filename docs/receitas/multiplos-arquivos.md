---
title: Múltiplos arquivos
sidebar_position: 1
description: Registrar vários documentos em uma chamada, entender a deduplicação e abrir o navegador uma única vez.
---

Uma invocação aceita quantos arquivos você quiser, misturando extensões:

```bash
md-preview README.md docs/guia.markdown .cursor/rules.mdc
```

A saída tem uma URL por arquivo, na ordem dos argumentos:

```text
http://127.0.0.1:8766/README
http://127.0.0.1:8766/docs/guia
http://127.0.0.1:8766/.cursor/rules
```

## O que acontece por baixo

1. Cada arquivo é validado (existe, é arquivo, extensão permitida).
2. O caminho real é calculado, resolvendo symlinks.
3. Arquivos repetidos — pelo mesmo caminho ou por symlink — são descartados.
4. Todos os documentos são registrados no mesmo daemon.
5. Com `--open-browser`, o navegador abre **uma vez**, no primeiro arquivo.

| Entrada | Slugs resultantes |
| --- | --- |
| `a.md b.md` | `a`, `b` |
| `a.md ./a.md` | `a` (duplicado) |
| `a.md link-para-a.md` | `a` (symlink) |
| `docs/x.md docs/y.md` | `docs/x`, `docs/y` |

A deduplicação importa porque evita entradas repetidas no **Recent** e mantém o
live reload ligado ao mesmo documento.

## Abrir o navegador

```bash
md-preview a.md b.md c.md --open-browser
```

O primeiro arquivo vira o documento ativo. Os demais ficam disponíveis na coluna
**Recent** e nas URLs impressas. Não há abertura de múltiplas abas.

Se não for possível abrir o navegador, a CLI avisa em stderr e mantém as URLs
válidas:

```text
md-preview: could not open a browser
```

## Tema para o conjunto

`--theme` vale para todos os arquivos da invocação:

```bash
md-preview a.md b.md --theme nord
```

As URLs saem com `?theme=nord`:

```text
http://127.0.0.1:8766/a?theme=nord
http://127.0.0.1:8766/b?theme=nord
```

## Usando globs

O shell expande o glob antes da CLI:

```bash
md-preview docs/*.md
md-preview **/*.markdown
```

Em `bash`, `**` só recursa com `globstar` habilitado:

```bash
shopt -s globstar
md-preview **/*.md
```

Para listar sem depender do shell, use `find`:

```bash
find docs -name '*.md' -print0 | xargs -0 md-preview
```

## Reexecutar a mesma chamada

Rodar de novo não duplica o histórico: o daemon identifica o documento pelo
caminho real e reutiliza a entrada. O conteúdo é relido do disco, então
alterações aparecem normalmente.

```bash
md-preview docs/a.md docs/b.md
md-preview docs/a.md docs/b.md   # mesmas entradas no Recent
```

Cada registro reemite `slugs`; a entrada existente é movida para o topo do
Recent, em vez de duplicada.

## Limites

- Apenas um documento é exibido por vez; a navegação é por URL.
- O histórico é em memória: reiniciar o daemon limpa o Recent.
- Arquivos fora da raiz Git/`$HOME` recebem slugs longos, derivados de `/`.
- Pastas com acentos geram `-` no slug; o link continua funcionando, mas não é
  “bonito”.

Para conteúdo que não existe em disco, use [Pipe de comando](/receitas/pipe).
