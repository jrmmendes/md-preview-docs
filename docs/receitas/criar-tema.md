---
title: Criar tema
sidebar_position: 2
description: Do seed dos temas embutidos ao theme.json validado, com override de um tema existente.
---

Um tema é um `theme.json` com `schemaVersion: 1` em
`~/.config/md-preview/themes/<nome>.json`. O nome do arquivo é o nome do tema e
precisa seguir `^[a-z0-9][a-z0-9-]{0,63}$`.

## 1. Prepare o diretório

```bash
md-preview theme path
md-preview theme seed
```

`theme path` imprime `config:` e `themes:`. `theme seed` cria o diretório e
copia os nove temas embutidos mais o `theme.schema.json`, sem sobrescrever
arquivos existentes.

## 2. Copie um tema

Partir de um embutido evita inventar todos os tokens:

```bash
themes=$(md-preview theme path | sed -n 's/^themes: //p')
cp "$themes/nord.json" "$themes/meu-tema.json"
```

Mantenha `name` igual ao nome do arquivo. Para ajustar o próprio `nord`, copie
para `nord.json` — o arquivo de usuário sobrescreve o embutido em memória, sem
alterar o original.

## 3. Edite os tokens

```json
{
  "$schema": "./theme.schema.json",
  "schemaVersion": 1,
  "name": "meu-tema",
  "kind": "dark",
  "colors": {
    "background": "#101418",
    "surface": "#161d24",
    "text": "#e6edf3",
    "muted": "#8b98a5",
    "border": "#26313c",
    "accent": "#4cc2a4",
    "code-bg": "#0c1116",
    "quote": "#8b98a5"
  },
  "shiki": { "light": "github-light", "dark": "github-dark" },
  "mermaid": { "theme": "dark", "overrides": {} }
}
```

As oito cores de `colors` são obrigatórias; as demais são derivadas. Grupos
opcionais (`radii`, `typography`, `layout`, `effects`) caem nos padrões. O
contrato completo, com todos os tokens e faixas, está em
[theme.json](/referencia/theme-json).

## 4. Valide

```bash
md-preview theme validate ~/.config/md-preview/themes/meu-tema.json
```

Sucesso imprime `ok: <arquivo>`. Falha imprime o campo inválido e sai com código
`1`. Depois confirme a origem:

```bash
md-preview theme list
```

## 5. Veja no preview

```bash
md-preview documento.md --theme meu-tema --open-browser
```

Ou abra `http://127.0.0.1:8766/documento?theme=meu-tema`. Editar o JSON dispara
o evento `themes`; se o tema atual mudou, a aba recarrega. Não é preciso
reiniciar o daemon.

## Limites

- arquivo maior que 256 KiB é ignorado com aviso;
- symlink é ignorado;
- nome fora do padrão é ignorado;
- `kind: "auto"` aceita só `variants.light` e `variants.dark`, sem `colors`;
- valores de cor e medida passam por validação contra injeção de CSS.

Para gerar um tema assistido por agente, use a skill
[`theme-authoring`](/recursos/ia).
