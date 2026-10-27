# Documentação do md-preview

Site [Docusaurus 3](https://docusaurus.io/) em português (pt-BR) para o
`md-preview`. Conteúdo em `docs/`, landing page em `src/pages/index.tsx`,
imagens em `static/img/`.

## Desenvolvimento

Pré-requisitos: Bun 1.x para instalar/executar os scripts e Node.js 20+ para o
Docusaurus.

```sh
cd docs/wiki
bun install
bun run start
```

O servidor de desenvolvimento abre em `http://localhost:3000`.

## Build

```sh
bun run build
bun run serve
```

O resultado estático é gerado em `build/`.

## Estrutura

```text
docs/wiki/
├── docs/                    # páginas (routeBasePath: "/")
├── src/
│   ├── css/custom.css       # tema visual do site
│   └── pages/index.tsx      # landing page
├── static/img/              # logo, favicon e capturas de tela
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

As capturas de tela referenciadas em `/img/features/` são produzidas fora deste
projeto; o build não falha quando elas ainda não existem.
