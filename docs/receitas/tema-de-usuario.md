---
title: Tema de usuário
sidebar_position: 3
description: Passo a passo para criar, validar e ativar um tema próprio, incluindo a sobreposição de um tema embutido.
---

Nesta receita você cria um tema claro chamado `papel`, valida, ativa por URL e
depois transforma um tema embutido em um tema de usuário.

## 1. Prepare o diretório

```bash
md-preview theme seed
md-preview theme path
```

Saída típica na primeira execução (com o diretório vazio):

```text
created: 10
skipped: 0
config: /home/ana/.config/md-preview
themes: /home/ana/.config/md-preview/themes
```

O total inclui os nove temas e o `theme.schema.json`. Se o daemon já iniciou
antes, os arquivos podem existir e aparecer em `skipped`.

## 2. Crie o arquivo

`~/.config/md-preview/themes/papel.json`:

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "papel",
  "kind": "light",
  "colors": {
    "background": "#fbf7ef",
    "surface": "#f4ede0",
    "text": "#2b2620",
    "muted": "#6f6455",
    "border": "#ddd2bf",
    "accent": "#9a5b2c",
    "code-bg": "#f1e8d8",
    "quote": "#7a6a55"
  },
  "typography": {
    "base-size": 17,
    "line-height": 1.7
  },
  "layout": {
    "content-width": "46rem"
  },
  "shiki": {
    "light": "solarized-light",
    "dark": "solarized-dark"
  },
  "mermaid": {
    "theme": "neutral",
    "overrides": {}
  }
}
```

O nome do arquivo precisa ser igual a `name` e corresponder a
`^[a-z0-9][a-z0-9-]{0,63}$`.

## 3. Valide

```bash
md-preview theme validate ~/.config/md-preview/themes/papel.json
```

Sucesso:

```text
ok: /home/ana/.config/md-preview/themes/papel.json
```

Falha típica (campo faltando):

```text
md-preview: colors.text is required
```

## 4. Confirme no catálogo

```bash
md-preview theme list
```

```text
auto	builtin
dracula	builtin
...
papel	user
```

Com `--json`, cada item inclui nome e origem, útil para scripts.

## 5. Ative

```bash
md-preview documento.md --theme papel --open-browser
```

Ou direto na URL:

```text
http://127.0.0.1:8766/documento?theme=papel
```

Também é possível fixar como padrão:

```json
{
  "theme": "papel"
}
```

em `~/.config/md-preview/config.json`, ou usar `MDPRV_THEME=papel`.

:::tip[Teste com um documento representativo]
Valide o tema em uma página que tenha tabela, código, citação, footnotes,
Mermaid e tree fence. Cores de `muted` e `border` costumam falhar em componentes
secundários mesmo quando o texto principal está legível.
:::

## 6. Sobreponha um tema embutido

Para ajustar apenas o `nord` na sua máquina, crie
`~/.config/md-preview/themes/nord.json`. O daemon mescla o arquivo do usuário
sobre o embutido; o arquivo embutido não é alterado.

```bash
cp "$(md-preview theme path | sed -n 's/^themes: //p')/nord.json" \
   ~/.config/md-preview/themes/nord.json
$EDITOR ~/.config/md-preview/themes/nord.json
md-preview theme validate ~/.config/md-preview/themes/nord.json
```

O `name` deve continuar `nord` para que a sobreposição aconteça.

Para voltar ao original:

```bash
rm ~/.config/md-preview/themes/nord.json
```

O daemon detecta a remoção e volta a usar o embutido.

## 7. Tema automático com variantes próprias

Se `papel` for claro e você tiver um `papel-escuro`, combine os dois:

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "papel-auto",
  "kind": "auto",
  "variants": {
    "light": "papel",
    "dark": "papel-escuro"
  }
}
```

As variantes são resolvidas depois da mesclagem, então podem ser temas de
usuário. Ative com `?theme=papel-auto`.

## 8. Checklist

- [ ] `theme validate` retorna `ok`.
- [ ] `theme list` mostra `papel` com origem `user`.
- [ ] A página abre com `?theme=papel` sem erro no console.
- [ ] Tabelas, código, citações e Mermaid estão legíveis.
- [ ] O tema `auto` continua alternando claro/escuro.
- [ ] Editar o JSON recarrega a aba (evento `themes`).

Para todos os tokens disponíveis, veja
[Referência do theme.json](/referencia/theme-json). Para o contrato e as regras
de validação, veja [Criando temas](/guias/criando-temas).
