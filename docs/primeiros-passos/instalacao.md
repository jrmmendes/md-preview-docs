---
title: Instalação
sidebar_position: 2
description: Requisitos, build a partir do código-fonte, instalação do binário no PATH e verificação.
---

O md-preview é distribuído como um único binário gerado pelo Bun. Não depende do
Node.js em tempo de execução, e o binário embute o cliente do navegador, os temas
embutidos e o Mermaid.

<figure>
  <img src="/img/features/cli-terminal.png" alt="Terminal executando md-preview e imprimindo a URL do documento" />
  <figcaption>A CLI imprime uma URL por arquivo e não abre o navegador sem --open-browser.</figcaption>
</figure>

## Requisitos

| Requisito | Versão | Observação |
| --- | --- | --- |
| Bun | 1.x | O repositório declara `bun@1.4.3` em `packageManager` |
| Sistema | Linux, macOS ou Windows | Abrir o navegador usa `xdg-open`, `open` ou `explorer.exe` |
| Navegador | Chromium, Firefox ou Safari recente | Necessário para interface, Mermaid e cópia de código |
| `git` | Opcional | Usado para calcular o slug relativo à raiz do repositório |
| `fc-list` | Opcional | Sem ele, o seletor de fontes mostra apenas as famílias genéricas |

Confira a versão do Bun:

```bash
bun --version
```

## Compilar a partir do código-fonte

No diretório do repositório já clonado:

```bash
bun install
bun run build
```

O script `build` compila primeiro o cliente do navegador e depois gera o binário
em `bin/md-preview`. O binário resultante é autocontido: `dist/client` não é
necessário para executar o binário.

```bash
./bin/md-preview --version
```

Saída esperada (a versão acompanha o `package.json`):

```text
1.3.0
```

:::note[Compilação parcial]
`bun run build:client` gera só o pacote do cliente no navegador em `dist/client`,
útil durante o desenvolvimento da interface. Para uso normal, prefira
`bun run build`.
:::

## Desenvolvimento

O projeto usa Bun 1.4.3 como gerenciador e runtime. Os comandos de verificação:

```bash
bun run typecheck   # tsconfig.json (servidor) + tsconfig.ui.json (cliente)
bun test            # testes unitários e de integração
bun run build       # cliente + binário único
```

Para iterar só no cliente do navegador, `bun run build:client` gera
`dist/client` sem recompilar o binário.

## Adicionar ao PATH

Para chamar `md-preview` de qualquer diretório, crie um link simbólico em um
diretório que já esteja no seu `PATH`:

```bash
mkdir -p ~/.local/bin
ln -sf "$PWD/bin/md-preview" ~/.local/bin/md-preview
md-preview --version
```

Se `~/.local/bin` não estiver no `PATH`, adicione ao seu shell:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Alternativa sem instalar: use o caminho completo `./bin/md-preview` ou um alias.

## Verificar a instalação

```bash
md-preview daemon status
```

Com o daemon parado, o comando imprime `md-preview daemon stopped` e termina com
código `1`. Isso é esperado: o daemon sobe automaticamente no primeiro preview.

```bash
md-preview theme list
md-preview theme path
```

`theme list` mostra `auto`, `dracula`, `github-dark`, `github-light`,
`gruvbox-dark`, `gruvbox-light`, `nord`, `solarized-dark` e `solarized-light`,
todos com origem `builtin` antes de qualquer personalização.

## Configuração inicial (opcional)

O md-preview funciona sem arquivo de configuração. Quando quiser fixar tema,
porta ou loader:

```bash
md-preview config init
md-preview theme seed
```

- `config init` cria `config.json` com os padrões e o schema do editor, **sem
  sobrescrever** um arquivo existente.
- `theme seed` cria o diretório de temas e copia os embutidos que ainda não
  existem, também sem sobrescrever.

Os caminhos exatos estão em [Caminhos de configuração](/referencia/caminhos).

## Atualizar

Depois de atualizar o código-fonte:

```bash
bun install
bun run build
md-preview daemon stop
```

Reinicie o daemon para que ele carregue o novo binário. Documentos já
registrados são mantidos apenas em memória; a próxima invocação os registra de
novo.

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `command not found` | `~/.local/bin` fora do `PATH` | Use o caminho completo ou ajuste o `PATH` |
| `unsupported file extension` | Arquivo não é `.md`, `.markdown` ou `.mdc` | Renomeie ou converta |
| `could not open a browser` | Nenhum utilitário para abrir o navegador | Abra a URL impressa manualmente |
| Porta ocupada | Outro processo em `8766` | Veja [Solução de problemas](/receitas/troubleshooting) |

Próximo passo: [Início rápido](/primeiros-passos/inicio-rapido).
