---
title: Início rápido
sidebar_position: 3
description: Crie um arquivo, abra o preview, edite com live reload e troque o tema.
---

Pressupõe o binário instalado e disponível como `md-preview`. Se ainda não
compilou, siga a [Instalação](/primeiros-passos/instalacao).

## 1. Crie um documento

```bash
mkdir -p ~/notas && cd ~/notas
cat > ola.md <<'EOF'
# Olá, md-preview

Este arquivo é renderizado **sem build**.
EOF
```

## 2. Inicie o preview

```bash
md-preview ola.md
```

A CLI inicia o daemon sob demanda e imprime:

```text
http://127.0.0.1:8766/ola
```

Abra a URL. O comando não abre o navegador sozinho; para abrir, use
`md-preview ola.md --open-browser`.

## 3. Edite e veja recarregar

Com a página aberta, altere `ola.md` e salve. O daemon observa o arquivo e a
página recarrega. Não é preciso rodar a CLI de novo.

## 4. Troque o tema

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
