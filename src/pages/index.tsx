import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const features = [
  {
    tag: 'MD',
    title: 'Markdown completo',
    body: 'GFM, tabelas, listas de tarefas, notas de rodapé, frontmatter, tree fences e imagens relativas resolvidas a partir do documento.',
  },
  {
    tag: '9',
    title: 'Nove temas embutidos',
    body: 'github-light, github-dark, dracula, nord, solarized (claro e escuro), gruvbox (claro e escuro) e auto. Temas de usuário em JSON sobrepõem os embutidos.',
  },
  {
    tag: 'Sh',
    title: 'Shiki + Mermaid',
    body: 'Realce de sintaxe em nove linguagens com saída dupla clara/escura e diagramas Mermaid renderizados no navegador.',
  },
  {
    tag: 'SSE',
    title: 'Live reload por SSE',
    body: 'Um único canal /__events envia snapshot, versão, slugs e temas, com ping a cada 20 segundos. Salve e a página recarrega.',
  },
  {
    tag: '§',
    title: 'Interface configurável',
    body: 'TOC com item ativo, histórico Recent, catálogo de fontes, modo zen, seis loaders, largura ajustável e botão de voltar ao topo.',
  },
  {
    tag: '0',
    title: 'Zero configuração',
    body: 'O daemon sobe sozinho, escuta só em loopback e encerra após 15 minutos ocioso. Um único binário Bun, sem runtime extra.',
  },
];

const sections = [
  {
    to: '/primeiros-passos/introducao',
    label: 'Primeiros passos',
    description: 'Entenda o que é o md-preview, instale, faça o primeiro preview e aprenda os conceitos centrais.',
  },
  {
    to: '/guias/markdown',
    label: 'Guias',
    description: 'Markdown suportado, temas, fontes, interface, live reload e o modelo de segurança do daemon.',
  },
  {
    to: '/receitas/multiplos-arquivos',
    label: 'Receitas',
    description: 'Fluxos prontos: vários arquivos, pipe de comandos, tema próprio e integração com editores.',
  },
  {
    to: '/referencia/cli',
    label: 'Referência',
    description: 'CLI completa, contrato do theme.json, endpoints HTTP, variáveis de ambiente e caminhos no disco.',
  },
  {
    to: '/limitacoes',
    label: 'Limitações',
    description: 'O que o md-preview deliberadamente não faz, para você escolher a ferramenta certa.',
  },
  {
    to: '/faq',
    label: 'Perguntas frequentes',
    description: 'Respostas curtas sobre porta ocupada, tema não aplicado, Mermaid, imagens e daemon.',
  },
];

export default function Home() {
  return (
    <Layout
      title="Documentação"
      description="CLI e daemon local para visualizar Markdown com temas, Shiki, Mermaid, tree fences e live reload.">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.badge}>Bun + TypeScript · 100% local</span>
            <h1 className={styles.title}>md-preview</h1>
            <p className={styles.tagline}>
              Seu Markdown no navegador, com temas de editor e atualização a
              cada salvamento.
            </p>
            <p className={styles.subtitle}>
              Uma CLI que registra documentos em um daemon local, em{' '}
              <code>127.0.0.1:8766</code>. Um documento por vez, uma URL por
              arquivo, sem conta e sem nuvem.            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/primeiros-passos/inicio-rapido">
                Começar
              </Link>
              <Link className="button button--secondary button--lg" to="/referencia/cli">
                Referência da CLI
              </Link>
            </div>
            <p className={styles.install}>
              ou compile a partir do código: <code>bun run build && ./bin/md-preview docs/guia.md</code>
            </p>
          </div>

          <div className={styles.terminal} aria-label="Exemplo de uso da CLI">
            <div className={styles.terminalBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.terminalTitle}>~/projeto</span>
            </div>
            <pre className={styles.terminalBody}>
              <code>
                <span className={styles.prompt}>$</span> md-preview docs/guia.md{'\n'}
                <span className={styles.url}>http://127.0.0.1:8766/docs/guia</span>
                {'\n\n'}
                <span className={styles.muted}>daemon iniciado · live reload ativo</span>
                {'\n'}
                <span className={styles.prompt}>$</span> md-preview docs/guia.md --open-browser{'\n'}
                <span className={styles.muted}>navegador aberto no primeiro arquivo</span>
              </code>
            </pre>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Feito para o ciclo de escrita</h2>
            <p>
              Editor de um lado, preview do outro. Sem servidor de aplicação, sem
              etapa de build e sem recarregar a página na mão.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article className={styles.feature} key={feature.title}>
                <span className={styles.featureTag}>{feature.tag}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.flow}>
          <div className={styles.flowCopy}>
            <h2>Três passos, sem código repetitivo</h2>
            <ol>
              <li>
                <strong>Rode a CLI.</strong> Ela inicia o daemon sob demanda e imprime
                a URL do documento ativo.
              </li>
              <li>
                <strong>Edite o arquivo.</strong> O daemon observa o disco e emite um
                evento pelo SSE.
              </li>
              <li>
                <strong>Veja o resultado.</strong> O navegador recarrega com o tema,
                o TOC e o histórico atualizados.
              </li>
            </ol>
            <Link className={styles.textLink} to="/primeiros-passos/conceitos">
              Entenda slug, daemon e documento ativo →
            </Link>
          </div>
          <div className={styles.flowCode}>
            <pre>
              <code>
                {'# sem abrir o navegador\n'}
                <span className={styles.prompt}>$</span> md-preview a.md b.markdown c.mdc{'\n\n'}
                {'# conteúdo vindo de outro comando\n'}
                <span className={styles.prompt}>$</span> cat rascunho.md | md-preview --pipe{'\n\n'}
                {'# tema por invocação\n'}
                <span className={styles.prompt}>$</span> md-preview guia.md --theme nord --open-browser
              </code>
            </pre>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Explore a documentação</h2>
            <p>
              A mesma organização da documentação do NestJS: comece pelo essencial,
              aprofunde nos guias e consulte a referência quando precisar.
            </p>
          </div>
          <div className={styles.sectionGrid}>
            {sections.map((section) => (
              <Link className={styles.sectionCard} key={section.to} to={section.to}>
                <span className={styles.sectionLabel}>{section.label}</span>
                <p>{section.description}</p>
                <span className={styles.sectionAction}>Ler seção →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>Pronto para o primeiro preview?</h2>
            <p>Do zero ao documento renderizado em menos de cinco minutos.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link className="button button--primary button--lg" to="/primeiros-passos/inicio-rapido">
              Início rápido
            </Link>
            <Link className="button button--outline button--lg" to="/primeiros-passos/instalacao">
              Instalação
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
