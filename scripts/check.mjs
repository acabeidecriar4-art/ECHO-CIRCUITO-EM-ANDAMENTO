import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(project, 'public');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(resolve(dir, entry.name))
    : [resolve(dir, entry.name)]));
  return nested.flat();
}

function isWithin(root, path) {
  const rel = relative(root, path);
  return rel === '' || (rel !== '..' && !rel.startsWith('..' + sep) && !rel.startsWith(sep));
}

function localReferences(file, source) {
  const ext = extname(file).toLowerCase();
  if (ext === '.html') {
    const refs = [...source.matchAll(/(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi)]
      .map(match => match[1]);
    for (const match of source.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
      refs.push(...match[1].split(',').map(item => item.trim().split(/\s+/)[0]).filter(Boolean));
    }
    return refs;
  }
  if (ext === '.css') {
    return [...source.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)]
      .map(match => match[1]);
  }
  return [];
}

function checkJavaScript(file, source) {
  const ext = extname(file).toLowerCase();
  const args = ext === '.mjs' || ext === '.cjs'
    ? ['--check', file]
    : ['--input-type=module', '--check'];
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    input: ext === '.js' || ext === '.html' ? source : undefined,
    maxBuffer: 2 * 1024 * 1024,
  });
  if (result.error) return result.error.message;
  if (result.status !== 0) return result.stderr || result.stdout || `Sintaxe inválida: ${file}`;
  return null;
}

const files = await walk(publicRoot);
const errors = [];
let checkedReferences = 0;
let checkedScripts = 0;
let checkedInlineScripts = 0;
let checkedJson = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.html', '.css', '.js', '.mjs', '.json'].includes(ext)) continue;
  const source = await readFile(file, 'utf8');

  if (ext === '.js' || ext === '.mjs') {
    checkedScripts++;
    const error = checkJavaScript(file, source);
    if (error) errors.push(`${relative(project, file)}: ${error}`);
  }

  if (ext === '.json') {
    checkedJson++;
    try { JSON.parse(source); }
    catch (error) { errors.push(`${relative(project, file)}: JSON inválido: ${error.message}`); }
  }

  if (ext === '.html') {
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      const attributes = match[1];
      const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase() || '';
      if (/\bsrc\s*=/i.test(attributes) || ['importmap', 'application/json', 'application/ld+json'].includes(type)) continue;
      if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
      const inlineSource = match[2];
      if (!inlineSource.trim()) continue;
      checkedInlineScripts++;
      const error = checkJavaScript(file, inlineSource);
      if (error) errors.push(`${relative(project, file)}: JavaScript inline inválido: ${error}`);
    }
  }

  for (const ref of localReferences(file, source)) {
    if (!ref || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(ref)) continue;
    let pathname;
    try { pathname = decodeURIComponent(ref.split(/[?#]/)[0]); }
    catch { errors.push(`${relative(project, file)}: URL local inválida: ${ref}`); continue; }
    if (!pathname) continue;

    const target = resolve(pathname.startsWith('/')
      ? resolve(publicRoot, '.' + pathname)
      : resolve(dirname(file), pathname));
    if (!isWithin(publicRoot, target)) {
      errors.push(`${relative(project, file)}: referência sai de public/: ${ref}`);
      continue;
    }
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(resolve(target, 'index.html'));
      else if (!info.isFile()) throw new Error('não é arquivo');
      checkedReferences++;
    } catch {
      errors.push(`${relative(project, file)}: recurso local ausente: ${ref}`);
    }
  }
}

// The repository-root entry is also used by direct static hosting; its paths
// are relative to the repository root, not to public/.
const rootEntry = resolve(project, 'index.html');
const rootEntrySource = await readFile(rootEntry, 'utf8');
for (const ref of localReferences(rootEntry, rootEntrySource)) {
  if (!ref || /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\?)/i.test(ref)) continue;
  let pathname;
  try { pathname = decodeURIComponent(ref.split(/[?#]/)[0]); }
  catch { errors.push(`index.html: URL local inválida: ${ref}`); continue; }
  if (!pathname) continue;
  const target = resolve(dirname(rootEntry), pathname);
  try {
    const info = await stat(target);
    if (info.isDirectory()) await stat(resolve(target, 'index.html'));
    else if (!info.isFile()) throw new Error('não é arquivo');
    checkedReferences++;
  } catch {
    errors.push(`index.html: recurso local ausente: ${ref}`);
  }
}

const manifest = JSON.parse(await readFile(resolve(project, 'docs/source-v7-manifest.json'), 'utf8'));
const localChanges = JSON.parse(await readFile(resolve(project, 'docs/source-v7-local-changes.json'), 'utf8'));
if (localChanges.baseline !== 'source-v7-manifest.json') {
  errors.push('O registro de alterações locais aponta para um manifesto-base inesperado.');
}
const manifestByPath = new Map();
const changesByPath = new Map();
const actualPublicPaths = new Set(files.map(file => relative(project, file).split(sep).join('/')));
let verifiedBaselineFiles = 0;
let verifiedLocalPatches = 0;

for (const record of manifest.files) {
  if (manifestByPath.has(record.path)) {
    errors.push(`Manifesto contém caminho duplicado: ${record.path}`);
    continue;
  }
  manifestByPath.set(record.path, record);
  const file = resolve(project, record.path);
  try {
    const bytes = await readFile(file);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const patch = localChanges.changes.find(change => change.path === record.path);
    if (patch) {
      changesByPath.set(patch.path, patch);
      if (patch.baseline_sha256 !== record.sha256) {
        errors.push(`${record.path}: hash de origem do patch não corresponde ao manifesto.`);
      }
      if (patch.current_bytes !== bytes.length || patch.current_sha256 !== sha256) {
        errors.push(`${record.path}: conteúdo atual não corresponde ao registro de alteração local.`);
      } else verifiedLocalPatches++;
    } else if (record.bytes !== bytes.length || record.sha256 !== sha256) {
      errors.push(`${record.path}: arquivo diverge do manifesto sem alteração local registrada.`);
    } else verifiedBaselineFiles++;
  } catch {
    errors.push(`${record.path}: arquivo registrado no manifesto está ausente.`);
  }
}

for (const path of actualPublicPaths) {
  if (!manifestByPath.has(path)) errors.push(`${path}: arquivo de public/ ausente do manifesto de origem.`);
}
for (const patch of localChanges.changes) {
  if (!manifestByPath.has(patch.path)) errors.push(`${patch.path}: alteração local sem arquivo de origem no manifesto.`);
  if (!changesByPath.has(patch.path)) errors.push(`${patch.path}: não foi validada como alteração local.`);
}

for (const name of [
  'package.json',
  'package-lock.json',
  'esports-validation.json',
  'portal-validation.json',
  'docs/source-v7-manifest.json',
  'docs/source-v7-local-changes.json',
]) {
  const file = resolve(project, name);
  const source = await readFile(file, 'utf8');
  checkedJson++;
  try { JSON.parse(source); }
  catch (error) { errors.push(`${name}: JSON inválido: ${error.message}`); }
}

for (const name of [
  'build.mjs',
  'scripts/serve.mjs',
  'scripts/check.mjs',
  'scripts/smoke-builds.mjs',
  'validate-esports.cjs',
  'validate-portal.cjs',
  'validate-accessibility.cjs',
]) {
  const file = resolve(project, name);
  const source = await readFile(file, 'utf8');
  const error = checkJavaScript(file, source);
  if (error) errors.push(`${name}: ${error}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  const patchSummary = verifiedLocalPatches === 1
    ? '1 patch local conferido'
    : `${verifiedLocalPatches} patches locais conferidos`;
  console.log(`Echo Circuit: ${checkedScripts} scripts JS/MJS e ${checkedInlineScripts} scripts inline válidos, ${checkedJson} JSONs válidos, ${checkedReferences} referências locais disponíveis; ${verifiedBaselineFiles} arquivos do manifesto preservados e ${patchSummary}.`);
}
