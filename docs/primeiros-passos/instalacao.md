---
title: Instalação
sidebar_position: 2
description: Clone da tag mais recente, build com Bun e instalação do binário em ~/.local/bin.
---

import InstallCommand, {
  MD_PREVIEW_TAG,
  MD_PREVIEW_VERSION,
} from '@site/src/components/InstallCommand';

O md-preview não é publicado no npm. A instalação clona a tag mais recente,
compila o binário com Bun e cria um symlink em `~/.local/bin`.

## Requisitos

| Requisito | Versão | Observação |
| --- | --- | --- |
| Bun | 1.x | O repositório fixa `bun@1.4.3` em `packageManager` |
| Git | qualquer | Usado no clone e no cálculo do slug |
| Navegador | atual | Necessário para a interface e o Mermaid |

```bash
bun --version
```

## Instalação

<InstallCommand />

O comando clona a tag <code>{MD_PREVIEW_TAG}</code> em `~/.md-preview`, instala
as dependências com lockfile, compila `bin/md-preview` e cria o link em
`~/.local/bin`. O `cd` roda em subshell, então o diretório atual do seu terminal
não muda.

O clone falha se `~/.md-preview` já existir e não estiver vazio. Nesse caso,
remova o diretório ou escolha outro caminho.

## PATH

Se `~/.local/bin` não estiver no `PATH`, adicione ao seu shell:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Alternativa: `cd ~/.md-preview && bun link` cria o comando em `~/.bun/bin`
(que também precisa estar no `PATH`).

## Verificar

A versão esperada é <code>{MD_PREVIEW_VERSION}</code> — a mesma constante que
monta o comando de instalação acima.

```bash
md-preview --version    # deve imprimir a versão instalada
md-preview theme list   # nome e origem; após o daemon semear, os nove temas aparecem como user
```

Na primeira execução o daemon copia os nove temas embutidos para
`~/.config/md-preview/themes/`, então `theme list` passa a mostrar origem
`user`. Editar esses arquivos sobrescreve o tema embutido de mesmo nome.

## Atualizar

Troque `vX.Y.Z` pela tag desejada nas duas primeiras linhas:

```bash
git -C ~/.md-preview fetch --depth 1 origin tag vX.Y.Z
git -C ~/.md-preview checkout --detach vX.Y.Z
(cd ~/.md-preview && bun install --frozen-lockfile && bun run build)
md-preview daemon stop
```

O `daemon stop` é obrigatório. Um daemon em execução continua servindo o binário
antigo até ser encerrado; a próxima invocação inicia o processo novo.

## Desinstalar

```bash
md-preview daemon stop
rm -rf ~/.md-preview
rm -f ~/.local/bin/md-preview
```

Configuração, temas de usuário, estado e temporários ficam no disco. Os caminhos
e a limpeza completa estão em [Caminhos](/referencia/caminhos).

Próximo passo: [Início rápido](/primeiros-passos/inicio-rapido).
