---
title: Fontes
sidebar_position: 4
description: Catálogo de fontes do sistema, busca sem acento, prévia, proxy opcional do Google Fonts e persistência.
---

O seletor de fontes permite trocar a tipografia do documento sem sair do
preview. O **daemon** monta o catálogo — a página nunca lista fontes locais por
conta própria.

<figure>
  <img src="/img/features/font-picker.png" alt="Seletor de fontes com busca, prévia Aa Bb Cc 0123 e indicação da origem" />
  <figcaption>Cada resultado mostra o nome, a categoria e uma prévia com “Aa Bb Cc 0123”.</figcaption>
</figure>

## Catálogo do sistema

O daemon descobre famílias com `fc-list`, agrega os estilos de cada família e
tenta classificá-las em categorias (sans-serif, serif, monospace etc.). O
resultado fica em cache em memória por **5 minutos**.

| Endpoint | Efeito |
| --- | --- |
| `GET /__fonts` | Lista famílias e estilos; resposta `no-store` |
| `GET /__fonts?refresh=1` | Invalida o cache antes de responder |

Se `fc-list` não existir, falhar ou demorar demais, a resposta traz
`available: false` e apenas as famílias genéricas:

```text
system-ui, sans-serif, serif, monospace, cursive, fantasy
```

O seletor continua funcional e informa o estado degradado. As genéricas são
escolhas válidas e não dependem de nenhuma fonte instalada.

## Busca e prévia

A busca acontece no navegador sobre o catálogo já carregado:

- ignora acentos e maiúsculas/minúsculas (`inter` encontra `Inter`, `noto` encontra `Noto Sans`);
- ordena por relevância: correspondência exata, prefixo da família, prefixo de
  palavra, substring e, por último, subsequência;
- devolve no máximo **80 resultados**;
- cada item é renderizado na própria família, com a prévia `Aa Bb Cc 0123`.

A lista se comporta como um combobox: as setas percorrem os resultados, `Enter`
aplica e `Esc` fecha.

## Persistência

A escolha fica em `localStorage`, na chave `mdprv_font`:

```json
{
  "v": 1,
  "family": "IBM Plex Sans",
  "source": "local",
  "stack": "\"IBM Plex Sans\", system-ui, sans-serif"
}
```

- `source` é `local` ou `google`;
- valores antigos, gravados como string simples, migram para `source: "local"`
  com uma pilha de fontes derivada;
- **Reset** remove a chave e a variável `--mdprv-font`;
- a pilha salva é aplicada por um script inline no `<head>`, antes do corpo, para
  evitar o piscar da fonte.

## Google Fonts (opcional)

O seletor oferece buscar famílias no Google Fonts. O navegador **não** fala com o
Google: ele pede ao daemon, que faz o proxy.

```text
GET /__fonts/google?family=IBM+Plex+Sans
```

O daemon:

1. busca a folha de estilo `css2` do Google;
2. baixa apenas arquivos `.woff2` de `https://fonts.gstatic.com`;
3. reescreve cada `@font-face` para `GET /__fonts/file/<sha256>`;
4. serve os arquivos com cache imutável.

| Situação | Resposta |
| --- | --- |
| Família inválida | `400` |
| Falha no serviço de origem | `502` |
| Arquivo desconhecido | `404` |

Uma seleção do Google só adiciona um `<link>` da mesma origem à página. A CSP
continua com `font-src 'self' data:`, sem conexões diretas ao Google.

:::tip[Sem rede?]
O catálogo local continua funcionando offline. O proxy do Google é opcional e só
é acionado quando você busca uma família remota.
:::

## Quando usar cada origem

| Origem | Vantagens | Limitações |
| --- | --- | --- |
| Sistema (`fc-list`) | Instantâneo, offline, zero download | Depende das fontes instaladas |
| Genéricas | Sempre disponível | Pouco controle visual |
| Google (proxy) | Variedade e consistência | Requer rede e autorização do proxy |

A fonte afeta o documento e a interface, mas não altera o tema: cores, espaçamento
e realce de código continuam vindo do `theme.json`.
