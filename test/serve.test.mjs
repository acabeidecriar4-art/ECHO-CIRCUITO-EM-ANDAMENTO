import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';
import { resolve } from 'node:path';
import { after, before, test } from 'node:test';

let child;
let baseUrl;

before(async () => {
  child = spawn(process.execPath, [resolve('scripts/serve.mjs')], {
    cwd: process.cwd(),
    env: { ...process.env, ECHO_HOST: '127.0.0.1', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let errorOutput = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => { errorOutput += chunk; });

  await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error(`Servidor não iniciou: ${output} ${errorOutput}`)), 5000);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)\/esports\//);
      if (match) {
        clearTimeout(timer);
        baseUrl = `http://127.0.0.1:${match[1]}`;
        resolveReady();
      }
    });
    child.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    child.once('exit', code => {
      if (!baseUrl) {
        clearTimeout(timer);
        reject(new Error(`Servidor encerrou com código ${code}: ${output} ${errorOutput}`));
      }
    });
  });
});

after(async () => {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await once(child, 'exit');
});

test('serve as páginas do circuito e da central', async () => {
  const event = await fetch(`${baseUrl}/esports/`);
  assert.equal(event.status, 200);
  assert.match(event.headers.get('content-type'), /text\/html/);
  assert.match(await event.text(), /Echo Circuit/);

  const portal = await fetch(`${baseUrl}/esports/acesso.html`);
  assert.equal(portal.status, 200);
  assert.match(await portal.text(), /Minha equipe/);
});

test('suporta HEAD, redireciona diretórios e limita métodos HTTP', async () => {
  const head = await fetch(`${baseUrl}/esports/`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');

  const redirect = await fetch(`${baseUrl}/esports`, { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), '/esports/');

  const post = await fetch(`${baseUrl}/esports/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});

test('retorna 404 para rotas ausentes e caminhos fora da pasta pública', async () => {
  const missing = await fetch(`${baseUrl}/nao-existe`);
  assert.equal(missing.status, 404);

  const { port } = new URL(baseUrl);
  const traversal = await new Promise((resolveResponse, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path: '/%2e%2e%2fpackage.json' }, response => {
      response.resume();
      response.on('end', () => resolveResponse(response.statusCode));
    });
    req.on('error', reject);
    req.end();
  });
  assert.equal(traversal, 404);
});
