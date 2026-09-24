import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
if (args.has('--dist') && args.has('--esports-dist')) {
  throw new Error('Escolha apenas um modo de prévia.');
}
const standaloneEsports = args.has('--esports-dist');
const contentDir = standaloneEsports ? 'dist-esports' : args.has('--dist') ? 'dist' : 'public';
const root = await realpath(resolve(project, contentDir));
const host = process.env.ECHO_HOST || '127.0.0.1';
const port = Number(process.env.PORT || '3030');
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT inválida.');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.wasm': 'application/wasm',
};
function inside(path) {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel);
}
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
    let file = resolve(root, '.' + pathname);
    if (!inside(file)) throw new Error('Outside public directory');
    let info = await stat(file);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(308, { Location: url.pathname.replace(/^\/+/, '/') + '/' + url.search }).end();
        return;
      }
      file = resolve(file, 'index.html');
      info = await stat(file);
    }
    file = await realpath(file);
    if (!inside(file) || !info.isFile()) throw new Error('Not a public file');
    res.writeHead(200, {
      'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Arquivo não encontrado.');
  }
});
server.listen(port, host, () => {
  const actualPort = server.address().port;
  const base = `http://${host}:${actualPort}`;
  if (standaloneEsports) {
    console.log(`Echo Circuit E-Sports: ${base}/`);
    console.log(`Central: ${base}/acesso.html`);
  } else {
    console.log(`Echo Circuit E-Sports: ${base}/esports/`);
    console.log(`Central: ${base}/esports/acesso.html`);
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
