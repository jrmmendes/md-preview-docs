---
title: Início rápido
sidebar_position: 3
description: Baixe o binário da release, confira o sha256, coloque no PATH e abra o primeiro preview.
---

import InstallCommand from '@site/src/components/InstallCommand';

## 1. Baixe e verifique

Linux x86-64:

<InstallCommand asset="linux-x64" />

O `curl` baixa o binário e o asset `.sha256` da mesma release; `sha256sum -c`
compara os dois e imprime `md-preview-linux-x64: OK`. Em arm64, troque
`linux-x64` por `linux-arm64`. Os hashes da tag atual e o ajuste de `PATH` estão
em [Instalação](/primeiros-passos/instalacao).

## 2. Confira a instalação

```bash
md-preview --version    # 1.4.1
```

Se o comando não for encontrado, `~/.local/bin` não está no `PATH`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

## 3. Crie um documento

```bash
mkdir -p ~/notas && cd ~/notas
cat > ola.md <<'EOF'
# Olá, md-preview

Este arquivo é renderizado **sem build**.
EOF
```

## 4. Inicie o preview

```bash
md-preview ola.md
```

A CLI inicia o daemon sob demanda e imprime:

```text
http://127.0.0.1:8766/notas/ola
```

Abra a URL. O comando não abre o navegador sozinho; para abrir, use
`md-preview ola.md --open-browser`.

## 5. Edite e veja recarregar

Com a página aberta, altere `ola.md` e salve. O daemon observa o arquivo e a
página recarrega. Não é preciso rodar a CLI de novo.

## 6. Troque o tema

```bash
md-preview ola.md --theme nord --open-browser
```

A URL sai com `?theme=nord`, que vale para essa invocação. Também é possível
trocar pelo painel de configurações da página ou fixar um tema em
`config.json`. A precedência completa está em [Temas](/recursos/temas).

O daemon encerra sozinho após 15 minutos sem atividade. Para parar agora:

```bash
md-preview daemon stop
```

Próximos passos: [Markdown suportado](/recursos/markdown) e [Pipe e
stdin](/receitas/pipe-e-stdin).
