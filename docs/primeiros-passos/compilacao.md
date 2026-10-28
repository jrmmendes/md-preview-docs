---
title: Compilar do código-fonte
sidebar_position: 4
description: Clone da tag, build com Bun e uso do binário gerado em bin/md-preview.
---

import CompileCommand from '@site/src/components/CompileCommand';

Os binários publicados nas releases cobrem Linux x64 e arm64. Compilar é o
caminho para outras plataformas, para rodar uma revisão específica do código ou
para alterar o próprio md-preview. Para instalar sem compilar, veja
[Instalação](/primeiros-passos/instalacao).

## Pré-requisitos

| Requisito | Versão | Observação |
| --- | --- | --- |
| Bun | 1.x | O repositório fixa `bun@1.4.3` em `packageManager` |
| Git | qualquer | Usado no clone e no cálculo do slug |
| Navegador | atual | Necessário para a interface e o Mermaid |

```bash
bun --version
```

`bun run build` usa o Bun já instalado; nada além dele precisa estar no sistema.

## Clone

<CompileCommand />

O clone da tag fica em `~/.md-preview`. O comando falha se o diretório já
existir e não estiver vazio.

## Build

```bash
cd ~/.md-preview
bun install --frozen-lockfile
bun run build
```

O build gera o cliente do navegador em `dist/client` e o embute no executável
`bin/md-preview`. Para gerar só o cliente, use `bun run build:client`.

Alternativa equivalente, que instala com lockfile congelado e compila:

```bash
cd ~/.md-preview && ./build.sh
```

## Rodar o binário gerado

```bash
~/.md-preview/bin/md-preview --version
~/.md-preview/bin/md-preview ~/notas/ola.md --open-browser
```

Para usar o comando `md-preview` sem o caminho completo, ligue o binário a um
diretório do `PATH`:

```bash
ln -sf ~/.md-preview/bin/md-preview ~/.local/bin/md-preview
```

Depois do build, o uso é o mesmo do binário baixado: [Início
rápido](/primeiros-passos/inicio-rapido) e [Referência da
CLI](/referencia/cli).

## Testes

```bash
cd ~/.md-preview
bun run typecheck
bun test
```

## Atualizar

Troque `vX.Y.Z` pela tag desejada:

```bash
git -C ~/.md-preview fetch --depth 1 origin tag vX.Y.Z
git -C ~/.md-preview checkout --detach vX.Y.Z
(cd ~/.md-preview && bun install --frozen-lockfile && bun run build)
md-preview daemon stop
```

O `daemon stop` é obrigatório: um daemon em execução continua servindo o binário
antigo até ser encerrado. A próxima invocação inicia o processo novo.

## Desinstalar

```bash
md-preview daemon stop
rm -rf ~/.md-preview
rm -f ~/.local/bin/md-preview
```

Configuração, temas de usuário, estado e temporários ficam no disco. A limpeza
completa está em [Caminhos](/referencia/caminhos).
