import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar manual: a ordem das categorias e das páginas é explícita para
 * espelhar a arquitetura de informação da documentação do NestJS.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Primeiros passos',
      collapsed: false,
      link: {type: 'doc', id: 'primeiros-passos/introducao'},
      items: [
        'primeiros-passos/introducao',
        'primeiros-passos/instalacao',
        'primeiros-passos/inicio-rapido',
        'primeiros-passos/conceitos',
      ],
    },
    {
      type: 'category',
      label: 'Guias',
      collapsed: false,
      link: {type: 'doc', id: 'guias/markdown'},
      items: [
        'guias/markdown',
        'guias/temas-embutidos',
        'guias/criando-temas',
        'guias/fontes',
        'guias/interface',
        'guias/live-reload',
        'guias/seguranca',
        'guias/editor-e-pipe',
      ],
    },
    {
      type: 'category',
      label: 'Receitas',
      collapsed: false,
      link: {type: 'doc', id: 'receitas/multiplos-arquivos'},
      items: [
        'receitas/multiplos-arquivos',
        'receitas/pipe',
        'receitas/tema-de-usuario',
        'receitas/preview-no-editor',
        'receitas/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Referência',
      collapsed: false,
      link: {type: 'doc', id: 'referencia/cli'},
      items: [
        'referencia/cli',
        'referencia/theme-json',
        'referencia/daemon',
        'referencia/variaveis-de-ambiente',
        'referencia/caminhos',
      ],
    },
    'limitacoes',
    'faq',
  ],
};

export default sidebars;
