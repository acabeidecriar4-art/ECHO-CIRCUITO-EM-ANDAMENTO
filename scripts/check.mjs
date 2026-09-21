import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(project, 'public');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]))).flat();
}
const files = await walk(resolve(root, 'esports'));
let checked = 0;
const errors = [];
for (const file of files) {
  if (!['.html', '.css', '.js'].includes(extname(file))) continue;
  const source = await readFile(file, 'utf8');
  if (extname(file) === '.js') {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(result.stderr || `Sintaxe inválida: ${file}`);
  }
  const refs = extname(file) === '.html'
    ? [...source.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1])
    : extname(file) === '.css'
      ? [...source.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)].map(m => m[1]) : [];
  for (const ref of refs) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(ref)) continue;
    const pathname = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!pathname) continue;
    const target = pathname.startsWith('/') ? resolve(root, '.' + pathname) : resolve(dirname(file), pathname);
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(resolve(target, 'index.html'));
      checked++;
    } catch { errors.push(`${file}: recurso ausente: ${ref}`); }
  }
}
for (const script of ['build.mjs', 'scripts/serve.mjs', 'scripts/check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', resolve(project, script)], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(result.stderr);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Echo Circuit: sintaxe válida e ${checked} referências locais disponíveis.`);
