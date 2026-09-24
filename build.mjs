import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)));
const standaloneEsports = process.argv.includes('--esports');
const source = resolve(project, standaloneEsports ? 'public/esports' : 'public');
const output = resolve(project, standaloneEsports ? 'dist-esports' : 'dist');

// Only fixed, project-local output directories may be replaced by this script.
if (dirname(output) !== project) throw new Error('Invalid build output');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

console.log(standaloneEsports
  ? 'Echo Circuit E-Sports artifact prepared in dist-esports/.'
  : 'Complete preserved public artifact prepared in dist/.');
