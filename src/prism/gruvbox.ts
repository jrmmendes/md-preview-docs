import type {PrismTheme} from 'prism-react-renderer';

/**
 * Temas Prism com a paleta oficial do Gruvbox.
 *
 * O mapeamento de tokens segue o critério dos temas Shiki embutidos no
 * md-preview (`gruvbox-light-medium` / `gruvbox-dark-medium`): comentários em
 * cinza itálico, strings em verde, números/constantes em roxo, keywords em
 * vermelho, funções em azul, tipos em roxo, variáveis/propriedades em azul,
 * operadores em laranja e pontuação no tom secundário do texto.
 *
 * `plain.backgroundColor` é o valor que o Docusaurus publica como
 * `--prism-background-color`, então precisa casar com `--ifm-pre-background` em
 * `custom.css`.
 */

const dark = {
  string: '#b8bb26',
  number: '#d3869b',
  keyword: '#fb4934',
  function: '#83a598',
  tag: '#8ec07c',
  operator: '#fe8019',
  comment: '#928374',
  punctuation: '#a89984',
  text: '#ebdbb2',
  background: '#32302f',
};

const light = {
  string: '#79740e',
  number: '#8f3f71',
  keyword: '#9d0006',
  function: '#076678',
  tag: '#427b58',
  operator: '#af3a03',
  comment: '#7c6f64',
  punctuation: '#665c54',
  text: '#3c3836',
  background: '#f2e5bc',
};

type Palette = typeof light;

function buildTheme(palette: Palette): PrismTheme {
  return {
    plain: {
      color: palette.text,
      backgroundColor: palette.background,
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {color: palette.comment, fontStyle: 'italic'},
      },
      {
        types: ['punctuation'],
        style: {color: palette.punctuation},
      },
      {
        types: ['string', 'char', 'attr-value', 'inserted', 'template-string'],
        style: {color: palette.string},
      },
      {
        types: [
          'number',
          'boolean',
          'constant',
          'symbol',
          'class-name',
          'builtin',
          'namespace',
          'type',
        ],
        style: {color: palette.number},
      },
      {
        types: ['keyword', 'atrule', 'important', 'deleted'],
        style: {color: palette.keyword},
      },
      {
        types: [
          'function',
          'function-variable',
          'variable',
          'parameter',
          'property',
          'constant-variable',
        ],
        style: {color: palette.function},
      },
      {
        types: ['tag', 'selector', 'attr-name'],
        style: {color: palette.tag},
      },
      {
        types: ['operator', 'entity', 'url', 'regex'],
        style: {color: palette.operator},
      },
      {
        types: ['bold'],
        style: {fontWeight: 'bold'},
      },
      {
        types: ['italic'],
        style: {fontStyle: 'italic'},
      },
    ],
  };
}

export const gruvboxLight = buildTheme(light);
export const gruvboxDark = buildTheme(dark);
