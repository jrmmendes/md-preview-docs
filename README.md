# Documentação do md-preview

Site [Docusaurus 3](https://docusaurus.io/) em português (pt-BR) para o
`md-preview`. Conteúdo em `docs/`, landing page em `src/pages/index.tsx` e
imagens em `static/img/`.

## Desenvolvimento

Pré-requisitos: Bun 1.x para instalar/executar os scripts e Node.js 20+ para o
Docusaurus.

```sh
cd md-preview-docs
bun install
bun run start
```

O servidor de desenvolvimento abre em `http://localhost:3000`.

## Build

```sh
bun install --frozen-lockfile
bun run build
bun run serve
```

O resultado estático é gerado em `build/`.

## Estrutura

```text
md-preview-docs/
├── docs/                    # páginas (routeBasePath: "/")
│   ├── primeiros-passos/
│   ├── recursos/
│   ├── receitas/
│   ├── referencia/
│   └── faq.md
├── src/
│   ├── components/
│   │   └── InstallCommand.tsx  # fonte do bloco de instalação da home e da instalação
│   ├── css/custom.css
│   └── pages/index.tsx
├── static/img/              # logo, favicon e capturas de tela
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

A tag instalada fica em `src/components/InstallCommand.tsx` (`MD_PREVIEW_TAG`),
a única fonte da versão. Atualizar a release é mudar essa constante; a home e a
página de instalação usam o mesmo componente, e `MD_PREVIEW_VERSION` (a mesma tag
sem o `v`) é importada por `docs/primeiros-passos/instalacao.md`. Não repita o
número em outros arquivos: em blocos de código que servem de exemplo use
`vX.Y.Z`.
