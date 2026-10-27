---
title: Skill de temas para IA
sidebar_position: 5
description: Skill theme-authoring para agentes criarem temas do md-preview com tokens medidos, contraste WCAG e validação.
---

O repositório do md-preview publica uma skill para agentes: `theme-authoring`.
Ela ensina o agente a derivar um `theme.json` v1 a partir de uma referência
visual, medindo cores e métricas em vez de imitá-las. O site não duplica o
conteúdo: o arquivo fica em `.opencode/skills/theme-authoring/SKILL.md` e é
instalado por `curl`.

## Instalar

```bash
mkdir -p .opencode/skills/theme-authoring
curl -fsSL https://raw.githubusercontent.com/jrmmendes/md-preview/main/.opencode/skills/theme-authoring/SKILL.md \
  -o .opencode/skills/theme-authoring/SKILL.md
```

OpenCode lê `.opencode/skills/`; Claude Code lê `.claude/skills/`. Ajuste o
diretório conforme o agente. O contrato aceito pelo md-preview está em
[theme.json](/referencia/theme-json).

## O que a skill cobre

- princípio de medir antes de escrever: cada cor sai de `getComputedStyle` ou de
  cálculo explícito, nunca de imitação visual;
- onde cada arquivo mora: schema, validador de runtime, temas builtin em
  `themes/` e temas de usuário em `${XDG_CONFIG_HOME:-~/.config}/md-preview/themes/`;
- fluxo em sete fases: fixar escopo, extrair evidência com o MCP do Playwright,
  normalizar para o contrato, fechar contraste WCAG, ajustar Shiki e Mermaid,
  validar com smoke em claro/escuro e derivar a variante dark ou `auto`;
- checklist final, armadilhas comuns e um template mínimo de `theme.json`;
- ponteiro para `docs/theme-authoring-method.md`, a referência longa do método.

## Exemplo de prompt

```text
Use a skill theme-authoring para criar um tema claro a partir de
docs/referencia-visual.png: meça os tokens, monte o theme.json, confira o
contraste e valide com theme validate. Não altere temas existentes.
```

## Limites

A skill cobre apenas autoria de temas. Para trocar de tema, listar temas ou
entender a precedência entre URL, cookie e configuração, use
[Temas](/recursos/temas) e a [CLI](/referencia/cli).
