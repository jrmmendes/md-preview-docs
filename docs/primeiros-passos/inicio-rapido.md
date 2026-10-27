---
title: Início rápido
sidebar_position: 3
description: Crie um arquivo, abra o preview, edite com live reload e troque de tema em cinco minutos.
---

Este roteiro pressupõe o binário instalado e disponível como `md-preview`. Se ainda
não compilou, siga a [Instalação](/primeiros-passos/instalacao).

## 1. Crie um documento

Fora de um repositório Git, um arquivo em `~/notas/ola.md` recebe o slug `ola`:

````bash
mkdir -p ~/notas
cd ~/notas
cat > ola.md <<'EOF'
# Olá, md-preview

Este arquivo é renderizado **sem build**.

- [x] live reload
- [x] temas
- [ ] escrever mais

```ts
const mensagem = "funciona";
console.log(mensagem);
```
EOF
````

## 2. Inicie o preview

```bash
md-preview ola.md
```

A CLI inicia o daemon sob demanda e imprime uma URL:

```text
http://127.0.0.1:8766/ola
```

Abra a URL no navegador. O comando **não** abre o navegador sozinho; esse é o
comportamento padrão para não interferir em scripts.

## 3. Edite e veja a atualização

Com a página aberta, altere `ola.md` e salve:

```bash
printf '\nAdicionado às %s.\n' "$(date +%H:%M)" >> ola.md
```

O daemon observa o arquivo, emite um evento e a página recarrega em menos de um
segundo. Não é necessário rodar a CLI de novo.

:::tip[Abra direto no navegador]
Use `--open-browser` quando quiser que o primeiro arquivo seja aberto
automaticamente:

```bash
md-preview ola.md --open-browser
```
:::

## 4. Troque o tema

Três formas, da mais pontual à mais permanente:

```bash
# só nesta invocação (a URL sai com ?theme=nord)
md-preview ola.md --theme nord --open-browser
```

```text
# direto na URL
http://127.0.0.1:8766/ola?theme=dracula
```

Abra o painel de configurações na página e escolha o tema; a preferência fica no
cookie `mdprv_theme` e passa a valer para as próximas visitas. A precedência
completa está em [Temas embutidos](/guias/temas-embutidos).

## 5. Adicione estrutura

No mesmo arquivo, experimente frontmatter e um diagrama:

````markdown
---
title: Olá, md-preview
tags: [demo, markdown]
---

# Olá, md-preview

```mermaid
flowchart LR
  A[Arquivo] --> B[Daemon]
  B --> C[Navegador]
```
````

O título do frontmatter vira o título da aba e um cartão de metadados aparece no
topo do documento. O bloco `mermaid` é renderizado como diagrama e pode ser
aberto em lightbox com zoom.

## 6. Encerre o daemon

O daemon encerra sozinho após 15 minutos sem atividade. Para parar agora:

```bash
md-preview daemon stop
```

O comando responde `md-preview daemon stopped`. O estado em disco é removido e a
próxima invocação inicia um daemon novo, com um token renovado. A porta volta ao
padrão `8766` (ou à porta configurada).

## Resultado esperado

```text
$ md-preview ola.md
http://127.0.0.1:8766/ola
$ md-preview daemon status
md-preview daemon running (pid 48211, port 8766)
$ md-preview daemon stop
md-preview daemon stopped
```

## Próximos passos

- Entenda [slug, daemon e documento ativo](/primeiros-passos/conceitos).
- Veja tudo o que o [Markdown suportado](/guias/markdown) oferece.
- Aprenda a usar [múltiplos arquivos e pipe](/receitas/pipe).
