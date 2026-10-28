---
title: Instalação
sidebar_position: 2
description: Download do binário Linux x64 ou arm64, verificação sha256 e instalação em ~/.local/bin.
---

import InstallCommand, {
  MD_PREVIEW_SHA256,
  MD_PREVIEW_TAG,
  MD_PREVIEW_VERSION,
} from '@site/src/components/InstallCommand';

O md-preview é distribuído como binário único nas releases do GitHub. Não é
publicado no npm. Baixar o binário não exige Bun nem Node na máquina.

Para compilar a partir do código-fonte, veja [Compilar do
código-fonte](/primeiros-passos/compilacao).

## Requisitos

| Requisito | Observação |
| --- | --- |
| Linux | Releases publicam binários só para Linux; `x86-64` ou `aarch64` |
| glibc | Os binários são ligados dinamicamente à glibc |
| Navegador | Necessário para a interface e o Mermaid |

Em macOS e Windows não há asset: compile a partir do código-fonte.

## Escolha o binário

| `uname -m` | Asset |
| --- | --- |
| `x86_64` | `md-preview-linux-x64` |
| `aarch64` | `md-preview-linux-arm64` |

```bash
uname -m
```

## Instalar

Linux x86-64:

<InstallCommand asset="linux-x64" />

Linux arm64:

<InstallCommand asset="linux-arm64" />

Cada binário vem acompanhado de um asset `<binário>.sha256`. O `sha256sum -c`
lê esse arquivo, compara com o binário local e imprime
`md-preview-<arquitetura>: OK`. Os valores esperados na tag <code>{MD_PREVIEW_TAG}</code>:

| Asset | sha256 |
| --- | --- |
| `md-preview-linux-x64` | <code>{MD_PREVIEW_SHA256['linux-x64']}</code> |
| `md-preview-linux-arm64` | <code>{MD_PREVIEW_SHA256['linux-arm64']}</code> |

O último comando move o binário para `~/.local/bin/md-preview`. O diretório de
download fica com o arquivo `.sha256`, que pode ser removido.

## PATH

Se `~/.local/bin` não estiver no `PATH`, adicione ao seu shell:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## Verificar

A versão da tag é <code>{MD_PREVIEW_VERSION}</code>:

```bash
md-preview --version    # confirma a versão do binário baixado
md-preview theme list   # nome e origem; após o daemon semear, os nove temas aparecem como user
```

Na primeira execução o daemon copia os nove temas embutidos para
`~/.config/md-preview/themes/`, então `theme list` passa a mostrar origem
`user`. Editar esses arquivos sobrescreve o tema embutido de mesmo nome.

## Atualizar

Pare o daemon antes de substituir o binário. Um daemon em execução continua
servindo a versão antiga até ser encerrado.

```bash
md-preview daemon stop
curl -LO https://github.com/jrmmendes/md-preview/releases/download/vX.Y.Z/md-preview-linux-x64 \
        https://github.com/jrmmendes/md-preview/releases/download/vX.Y.Z/md-preview-linux-x64.sha256
sha256sum -c md-preview-linux-x64.sha256
chmod +x md-preview-linux-x64
mv md-preview-linux-x64 ~/.local/bin/md-preview
```

Troque `vX.Y.Z` pela tag desejada nas duas URLs e `linux-x64` por
`linux-arm64` se for o caso.

## Desinstalar

```bash
md-preview daemon stop
rm -f ~/.local/bin/md-preview
```

Configuração, temas de usuário, estado e temporários ficam no disco. Os
caminhos e a limpeza completa estão em [Caminhos](/referencia/caminhos). Se você
compilou o binário, o clone em `~/.md-preview` também pode ser removido.

Próximo passo: [Início rápido](/primeiros-passos/inicio-rapido).
