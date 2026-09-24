import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const modes = [
  {
    flag: '--dist',
    label: 'build completo',
    routes: [
      ['/esports/', 200, 'Echo Circuit'],
      ['/esports/acesso.html', 200, 'Minha equipe'],
      ['/admin/', 200, 'Admin'],
    ],
  },
  {
    flag: '--esports-dist',
    label: 'build isolado',
    routes: [
      ['/', 200, 'Echo Circuit'],
      ['/acesso.html', 200, 'Minha equipe'],
      ['/admin/', 404, null],
    ],
  },
];

async function smoke(mode) {
  const child = spawn(process.execPath, [resolve('scripts/serve.mjs'), mode.flag], {
    cwd: process.cwd(),
    env: { ...process.env, ECHO_HOST: '127.0.0.1', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let errorOutput = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => { errorOutput += chunk; });

  try {
    const port = await new Promise((ready, reject) => {
      const timer = setTimeout(() => reject(new Error(`${mode.label}: timeout ao iniciar. ${errorOutput}`)), 5000);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
        if (match) {
          clearTimeout(timer);
          ready(Number(match[1]));
        }
      });
      child.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      child.once('exit', code => {
        if (!output.includes('http://127.0.0.1:')) {
          clearTimeout(timer);
          reject(new Error(`${mode.label}: servidor encerrou (${code}). ${output} ${errorOutput}`));
        }
      });
    });

    for (const [path, expectedStatus, marker] of mode.routes) {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      const body = await response.text();
      if (response.status !== expectedStatus) {
        throw new Error(`${mode.label} ${path}: HTTP ${response.status}; esperado ${expectedStatus}.`);
      }
      if (marker && !body.toLowerCase().includes(marker.toLowerCase())) {
        throw new Error(`${mode.label} ${path}: conteúdo esperado não encontrado (${marker}).`);
      }
    }
    console.log(`${mode.label}: ${mode.routes.length} rotas verificadas.`);
  } finally {
    child.kill('SIGTERM');
    if (child.exitCode === null) await new Promise(ready => child.once('exit', ready));
  }
}

for (const mode of modes) await smoke(mode);
