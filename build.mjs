import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('.', import.meta.url);
const source = resolve(fileURLToPath(root), 'public');
const output = resolve(fileURLToPath(root), 'dist');
if (resolve(output, '..') !== fileURLToPath(root).replace(/[\\/]$/, '')) throw new Error('Invalid build output');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

console.log('Echo Circuit static artifact prepared.');
