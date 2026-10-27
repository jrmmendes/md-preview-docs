import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Todas as categorias são só toggle (sem link); o doc principal é o primeiro item.
  docs: [
    {
      type: 'category',
      label: 'Primeiros passos',
      collapsed: false,
      items: [
        'primeiros-passos/introducao',
        'primeiros-passos/instalacao',
        'primeiros-passos/inicio-rapido',
      ],
    },
    {
      type: 'category',
      label: 'Recursos',
      collapsed: false,
      items: [
        'recursos/markdown',
        'recursos/temas',
        'recursos/interface',
        'recursos/seguranca',
        'recursos/ia',
      ],
    },
    {
      type: 'category',
      label: 'Receitas',
      collapsed: false,
      items: [
        'receitas/pipe-e-stdin',
        'receitas/criar-tema',
        'receitas/neovim',
        'receitas/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Referência',
      collapsed: false,
      items: [
        'referencia/cli',
        'referencia/theme-json',
        'referencia/daemon',
        'referencia/caminhos',
      ],
    },
    'faq',
  ],
};

export default sidebars;
