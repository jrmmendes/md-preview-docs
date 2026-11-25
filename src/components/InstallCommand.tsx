import CodeBlock from '@theme/CodeBlock';

export const MD_PREVIEW_TAG = 'v2.1.0';
// Versão sem o prefixo "v", para textos que mostram o que `--version` imprime.
export const MD_PREVIEW_VERSION = MD_PREVIEW_TAG.replace(/^v/, '');
export const MD_PREVIEW_REPO = 'https://github.com/jrmmendes/md-preview.git';
export const MD_PREVIEW_DOWNLOAD = `https://github.com/jrmmendes/md-preview/releases/download/${MD_PREVIEW_TAG}`;

export type MdPreviewAsset = 'linux-x64' | 'linux-arm64';

// sha256 publicado no asset `<nome>.sha256` da mesma release.
export const MD_PREVIEW_SHA256: Record<MdPreviewAsset, string> = {
  'linux-x64': '156b4d747b099d8601cfe4e74c49bb977367f117ec67feadba7e9c72d8e331eb',
  'linux-arm64': '9faf52ac25e07b898cddd66e3e8b9e6b9bbcd536044fe0705c2cfa27c2b2517d',
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
