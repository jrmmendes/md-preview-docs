import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import {gruvboxDark, gruvboxLight} from './src/prism/gruvbox';

const config: Config = {
  title: 'md-preview',
  tagline: 'Markdown local no navegador, com live reload e temas',
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
          'Documentação do md-preview: CLI e daemon local para renderizar Markdown com temas, live reload e diagramas.',
      },
      {name: 'keywords', content: 'markdown, preview, cli, bun'},
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
        {to: '/recursos/markdown', label: 'Recursos', position: 'left'},
        {to: '/receitas/pipe-e-stdin', label: 'Receitas', position: 'left'},
        {to: '/referencia/cli', label: 'Referência', position: 'left'},
        {to: '/faq', label: 'FAQ', position: 'left'},
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
          title: 'Referência',
          items: [
            {label: 'CLI', to: '/referencia/cli'},
            {label: 'theme.json', to: '/referencia/theme-json'},
            {label: 'Daemon', to: '/referencia/daemon'},
            {label: 'Caminhos', to: '/referencia/caminhos'},
          ],
        },
      ],
      copyright: `md-preview — documentação`,
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
