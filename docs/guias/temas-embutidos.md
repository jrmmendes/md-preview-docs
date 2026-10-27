---
title: Temas embutidos
sidebar_position: 2
description: Os nove temas incluídos, o modo auto e a precedência entre query, cookie, configuração e ambiente.
---

O md-preview inclui nove temas prontos. Todos definem cores de interface,
tipografia, layout, paletas do Shiki e configuração do Mermaid.

| Tema | Tipo | Observação |
| --- | --- | --- |
| `auto` | automático | Alterna entre `github-light` e `github-dark` |
| `github-light` | claro | Neutro, alto contraste |
| `github-dark` | escuro | Equivalente escuro do anterior |
| `dracula` | escuro | Roxo e rosa característicos |
| `gruvbox-dark` | escuro | Tons quentes e baixa saturação |
| `gruvbox-light` | claro | Contraparte clara do gruvbox |
| `nord` | escuro | Azul-acinzentado |
| `solarized-dark` | escuro | Paleta Solarized |
| `solarized-light` | claro | Contraparte clara do Solarized |

<figure>
  <img src="/img/features/theme-light.png" alt="Documento renderizado com o tema github-light" />
  <figcaption>Tema claro: superfícies brancas e código com paleta github-light.</figcaption>
</figure>

<figure>
  <img src="/img/features/theme-dark.png" alt="O mesmo documento renderizado com o tema github-dark" />
  <figcaption>Tema escuro: o mesmo conteúdo, com a paleta github-dark no código e nos diagramas.</figcaption>
</figure>

## Como o tema `auto` funciona

`auto` não é um conjunto fixo de cores: ele referencia dois temas por nome.

```json
{
  "schemaVersion": 1,
  "name": "auto",
  "kind": "auto",
  "variants": {
    "light": "github-light",
    "dark": "github-dark"
  }
}
```

A escolha entre as variantes segue `prefers-color-scheme` do sistema
operacional. Mudar o tema do sistema altera o preview sem tocar na configuração.

## Precedência

O tema efetivo é resolvido a cada requisição, nesta ordem:

1. parâmetro `?theme=` na URL;
2. cookie `mdprv_theme`;
3. campo `theme` do `config.json` (ou `MDPRV_THEME`);
4. `auto`.

```text
?theme=nord  >  cookie mdprv_theme  >  config.json / MDPRV_THEME  >  auto
```

Se um valor não existir no catálogo, ele é ignorado e o próximo da lista é
tentado. Um `?theme=inexistente` não quebra a página: cai no cookie ou no padrão.

:::note[Por que só o tema fica em cookie]
O servidor precisa saber o tema **antes** de renderizar o HTML. Por isso o tema é
o único valor guardado em cookie. As demais preferências (fonte, loader, largura)
ficam em `localStorage` e são aplicadas pelos scripts no navegador.
:::

## Trocar de tema

### Pela CLI

`--theme` valida o nome antes de registrar e acrescenta `?theme=` a todas as URLs
impressas:

```bash
md-preview guia.md --theme nord
md-preview a.md b.md --theme dracula --open-browser
```

Um nome inválido encerra com erro:

```text
md-preview: unknown theme: noturno
```

### Pela URL

```text
http://127.0.0.1:8766/docs/guia?theme=solarized-light
```

### Pelo painel de configurações

O seletor de tema no painel grava o cookie e recarrega a página com o novo tema.
Escolher `auto` remove o parâmetro da URL e volta a seguir o sistema.

<figure>
  <img src="/img/features/settings-panel.png" alt="Painel de configurações com seletor de tema, fonte, loader e sensibilidade de zoom" />
  <figcaption>O painel reúne tema, fonte, loader e sensibilidade de zoom.</figcaption>
</figure>

### Pela configuração

```json
{
  "$schema": "./config.schema.json",
  "theme": "nord"
}
```

Ou, temporariamente:

```bash
MDPRV_THEME=nord md-preview guia.md
```

## Temas de usuário

Um arquivo em `~/.config/md-preview/themes/<nome>.json` com o mesmo nome de um
tema embutido **sobrepõe** o embutido em memória. O arquivo original nunca é
reescrito; apagar o arquivo do usuário devolve o tema embutido.

```bash
md-preview theme list          # mostra a origem: builtin ou user
md-preview theme list --json   # mesma informação em JSON
```

Para criar um tema próprio, siga [Criando temas](/guias/criando-temas).

## Recarga de temas em tempo real

Editar um arquivo de tema dispara um evento `themes` no SSE. Se o tema alterado
for o atual — ou se o tema atual for `auto` e uma das variantes mudar — a aba
recarrega. Não há substituição de CSS em tempo real: a página é recarregada para
reaplicar também as paletas do Shiki e do Mermaid.

Arquivos inválidos, symlinks e arquivos maiores que 256 KiB são ignorados com
aviso; o tema anterior continua disponível.
