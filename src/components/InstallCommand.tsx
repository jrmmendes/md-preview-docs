import CodeBlock from '@theme/CodeBlock';

export const MD_PREVIEW_TAG = 'v2.0.0';
// Versão sem o prefixo "v", para textos que mostram o que `--version` imprime.
export const MD_PREVIEW_VERSION = MD_PREVIEW_TAG.replace(/^v/, '');
export const MD_PREVIEW_REPO = 'https://github.com/jrmmendes/md-preview.git';
export const MD_PREVIEW_DOWNLOAD = `https://github.com/jrmmendes/md-preview/releases/download/${MD_PREVIEW_TAG}`;

export type MdPreviewAsset = 'linux-x64' | 'linux-arm64';

// sha256 publicado no asset `<nome>.sha256` da mesma release.
export const MD_PREVIEW_SHA256: Record<MdPreviewAsset, string> = {
  'linux-x64': '3d53159d8af9e06983370678a4f6a34a5d4c0e9c9be6caba93c3b296d6b5f9f3',
  'linux-arm64': '516648d302461d9555fe3879af3f741aede4ae77070253f15c65783da88308e4',
};

export function downloadCommand(asset: MdPreviewAsset) {
  const file = `md-preview-${asset}`;
  return [
    `curl -LO ${MD_PREVIEW_DOWNLOAD}/${file} \\`,
    `        ${MD_PREVIEW_DOWNLOAD}/${file}.sha256`,
    `sha256sum -c ${file}.sha256`,
    `chmod +x ${file}`,
    'mkdir -p ~/.local/bin',
    `mv ${file} ~/.local/bin/md-preview`,
  ].join('\n');
}

export default function InstallCommand({asset = 'linux-x64'}: {asset?: MdPreviewAsset}) {
  return (
    <CodeBlock language="bash" title="bash">
      {downloadCommand(asset)}
    </CodeBlock>
  );
}
