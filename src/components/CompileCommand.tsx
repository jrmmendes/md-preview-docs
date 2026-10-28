import CodeBlock from '@theme/CodeBlock';

import {MD_PREVIEW_REPO, MD_PREVIEW_TAG} from './InstallCommand';

export const cloneCommand = `git clone --depth 1 --branch ${MD_PREVIEW_TAG} ${MD_PREVIEW_REPO} ~/.md-preview`;

export default function CompileCommand() {
  return (
    <CodeBlock language="bash" title="bash">
      {cloneCommand}
    </CodeBlock>
  );
}
