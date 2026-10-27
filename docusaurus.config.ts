import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import {gruvboxDark, gruvboxLight} from './src/prism/gruvbox';

const config: Config = {
  title: 'md-preview',
  tagline: 'Visualize Markdown localmente, com live reload, temas e diagramas',
  favicon: 'img/favicon.svg',

  // Site local/projeto: a URL canônica não é usada para servir o conteúdo.
  url: 'https://md-preview.local',
  baseUrl: '/',

  organizationName: 'md-preview',
  projectName: 'md-preview',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Documentação do md-preview: CLI e daemon local para renderizar Markdown com temas, Shiki, Mermaid, tree fences e live reload.',
      },
      {name: 'keywords', content: 'markdown, preview, cli, bun, daemon, shiki, mermaid'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'md-preview',
      hideOnScroll: true,
      logo: {
        alt: 'md-preview',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Primeiros passos',
        },
        {to: '/guias/markdown', label: 'Guias', position: 'left'},
        {to: '/receitas/multiplos-arquivos', label: 'Receitas', position: 'left'},
        {to: '/referencia/cli', label: 'Referência', position: 'left'},
        {to: '/faq', label: 'Perguntas frequentes', position: 'left'},
        {to: '/limitacoes', label: 'Limitações', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Comece aqui',
          items: [
            {label: 'Introdução', to: '/primeiros-passos/introducao'},
            {label: 'Instalação', to: '/primeiros-passos/instalacao'},
            {label: 'Início rápido', to: '/primeiros-passos/inicio-rapido'},
          ],
        },
        {
          title: 'Aprenda',
          items: [
            {label: 'Markdown suportado', to: '/guias/markdown'},
            {label: 'Temas', to: '/guias/temas-embutidos'},
            {label: 'Interface e atalhos', to: '/guias/interface'},
          ],
        },
        {
          title: 'Referência',
          items: [
            {label: 'CLI', to: '/referencia/cli'},
            {label: 'theme.json', to: '/referencia/theme-json'},
            {label: 'Daemon e endpoints', to: '/referencia/daemon'},
          ],
        },
      ],
      copyright: `Documentação do md-preview — construída com Docusaurus.`,
    },
    prism: {
      theme: gruvboxLight,
      darkTheme: gruvboxDark,
      additionalLanguages: ['bash', 'json', 'diff', 'ini', 'lua', 'python', 'markdown'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
