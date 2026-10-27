import CodeBlock from '@theme/CodeBlock';

export const MD_PREVIEW_TAG = 'v1.3.0';
// Versão sem o prefixo "v", para textos que mostram o que `--version` imprime.
export const MD_PREVIEW_VERSION = MD_PREVIEW_TAG.replace(/^v/, '');
export const MD_PREVIEW_REPO = 'https://github.com/jrmmendes/md-preview.git';

export const installCommand = [
  `git clone --depth 1 --branch ${MD_PREVIEW_TAG} ${MD_PREVIEW_REPO} ~/.md-preview \\`,
  '  && (cd ~/.md-preview && bun install --frozen-lockfile && bun run build) \\',
  '  && mkdir -p ~/.local/bin \\',
  '  && ln -sf ~/.md-preview/bin/md-preview ~/.local/bin/md-preview',
].join('\n');

export default function InstallCommand() {
  return (
    <CodeBlock language="bash" title="bash">
      {installCommand}
    </CodeBlock>
  );
}
