import CodeBlock from '@theme/CodeBlock';

export const MD_PREVIEW_TAG = 'v1.4.1';
// Versão sem o prefixo "v", para textos que mostram o que `--version` imprime.
export const MD_PREVIEW_VERSION = MD_PREVIEW_TAG.replace(/^v/, '');
export const MD_PREVIEW_REPO = 'https://github.com/jrmmendes/md-preview.git';
export const MD_PREVIEW_DOWNLOAD = `https://github.com/jrmmendes/md-preview/releases/download/${MD_PREVIEW_TAG}`;

export type MdPreviewAsset = 'linux-x64' | 'linux-arm64';

// sha256 publicado no asset `<nome>.sha256` da mesma release.
export const MD_PREVIEW_SHA256: Record<MdPreviewAsset, string> = {
  'linux-x64': 'ba1c5bc5074fe56a76c1cf7136eda3c30b57ac419a40223f0b093540c3c4faac',
  'linux-arm64': '0996e128bc3f532729c789982dec5d9c99cb214083c2bc7c5543f9f11d3e877f',
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
