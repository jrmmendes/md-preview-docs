import CodeBlock from '@theme/CodeBlock';

export const MD_PREVIEW_TAG = 'v1.10.0';
// Versão sem o prefixo "v", para textos que mostram o que `--version` imprime.
export const MD_PREVIEW_VERSION = MD_PREVIEW_TAG.replace(/^v/, '');
export const MD_PREVIEW_REPO = 'https://github.com/jrmmendes/md-preview.git';
export const MD_PREVIEW_DOWNLOAD = `https://github.com/jrmmendes/md-preview/releases/download/${MD_PREVIEW_TAG}`;

export type MdPreviewAsset = 'linux-x64' | 'linux-arm64';

// sha256 publicado no asset `<nome>.sha256` da mesma release.
export const MD_PREVIEW_SHA256: Record<MdPreviewAsset, string> = {
  'linux-x64': '99ce0f79bc01e4815c3faeb9e092011930b6fda1a58cb04213a9410dad2875df',
  'linux-arm64': 'ce51129f60c5b06a0248b1022bca7a3035b45ad0f9c862bba748842c77844d3a',
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
