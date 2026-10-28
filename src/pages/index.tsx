import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import InstallCommand from '../components/InstallCommand';
import styles from './index.module.css';

const usage = `md-preview README.md                 # imprime a URL
md-preview README.md --open-browser  # abre no navegador
cat doc.md | md-preview --pipe       # conteúdo de stdin`;

const links = [
  {
    to: '/primeiros-passos/introducao',
    label: 'Primeiros passos',
    text: 'Instalação, primeiro preview e como o slug e o daemon funcionam.',
  },
  {
    to: '/recursos/markdown',
    label: 'Recursos',
    text: 'Markdown, temas, interface, segurança e skill de tema para IA.',
  },
  {
    to: '/receitas/pipe-e-stdin',
    label: 'Receitas',
    text: 'Pipe, temas próprios, Neovim e solução de problemas.',
  },
  {
    to: '/referencia/cli',
    label: 'Referência',
    text: 'CLI, theme.json, endpoints do daemon e caminhos no disco.',
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentação"
      description="CLI e daemon local para renderizar Markdown com temas, live reload e diagramas.">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.title}>md-preview</h1>
          <p className={styles.tagline}>
            Renderiza Markdown local em <code>127.0.0.1:8766</code> com live
            reload, temas e diagramas Mermaid.
          </p>
          <p className={styles.note}>
            Linux x64 ou arm64 — <a href="https://github.com/jrmmendes/md-preview/releases/latest">releases</a>.
          </p>
          <div className={styles.install}>
            <InstallCommand />
          </div>
          <p className={styles.note}>
            Já instalou? O <code>PATH</code> e a verificação estão em{' '}
            <Link to="/primeiros-passos/instalacao">Instalação</Link>. Para outros
            sistemas, <Link to="/primeiros-passos/compilacao">compile do código-fonte</Link>.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Uso</h2>
          <pre className={styles.codeBlock}>
            <code>{usage}</code>
          </pre>
        </section>

        <nav className={styles.links} aria-label="Seções da documentação">
          {links.map((link) => (
            <Link className={styles.linkCard} key={link.to} to={link.to}>
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkText}>{link.text}</span>
            </Link>
          ))}
        </nav>
      </main>
    </Layout>
  );
}
