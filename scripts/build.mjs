#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

// O Node 26 expõe localStorage experimentalmente e emite um aviso quando o
// Docusaurus o acessa durante a geração estática. A flag não existe em versões
// antigas, então só é aplicada quando o runtime a reconhece.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const env = {...process.env};

if (process.allowedNodeEnvironmentFlags.has('--no-experimental-webstorage')) {
  env.NODE_OPTIONS = [env.NODE_OPTIONS, '--no-experimental-webstorage']
    .filter(Boolean)
    .join(' ');
}

const cli = join(root, 'node_modules', '@docusaurus', 'core', 'bin', 'docusaurus.mjs');
const result = spawnSync(process.execPath, [cli, 'build', ...process.argv.slice(2)], {
  cwd: root,
  env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
