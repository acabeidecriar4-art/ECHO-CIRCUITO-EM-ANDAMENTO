// WCAG 2.1 A/AA audit of the E-Sports experience with axe-core.
// Set A11Y_STRICT=1 to fail on serious/critical violations after triage.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const project = __dirname;
const outputDir = path.resolve(process.env.ECHO_A11Y_OUTPUT || '/tmp/echo-circuit-a11y');
fs.mkdirSync(outputDir, { recursive: true });

async function startServer() {
  const child = spawn(process.execPath, [path.join(project, 'scripts/serve.mjs')], {
    cwd: project,
    env: { ...process.env, ECHO_HOST: '127.0.0.1', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '';
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => { stderr += chunk; });

  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Servidor não iniciou: ${stderr}`)), 5000);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', chunk => {
        stdout += chunk;
        const match = stdout.match(/http:\/\/127\.0\.0\.1:(\d+)\/esports\//);
        if (match) {
          clearTimeout(timer);
          resolve(Number(match[1]));
        }
      });
      child.once('error', error => {
        clearTimeout(timer);
        reject(error);
      });
      child.once('exit', code => {
        if (!stdout.includes('http://127.0.0.1:')) {
          clearTimeout(timer);
          reject(new Error(`Servidor encerrou (${code}): ${stdout} ${stderr}`));
        }
      });
    });
    return { child, baseUrl: `http://127.0.0.1:${port}` };
  } catch (error) {
    child.kill('SIGTERM');
    throw error;
  }
}

async function launchBrowser() {
  let options = { headless: true };
  if (process.env.ECHO_CHROMIUM_EXECUTABLE) {
    options = {
      ...options,
      executablePath: process.env.ECHO_CHROMIUM_EXECUTABLE,
      args: ['--disable-gpu', '--disable-dev-shm-usage'],
    };
  } else if (process.env.ECHO_CHROMIUM_MODULE) {
    const { default: portableChromium } = await import(process.env.ECHO_CHROMIUM_MODULE);
    options = {
      ...options,
      executablePath: await portableChromium.executablePath(),
      args: portableChromium.args,
    };
  }
  return chromium.launch(options);
}

function summarizeViolation(violation) {
  return {
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map(node => ({
      target: node.target,
      summary: node.failureSummary,
    })),
  };
}

(async () => {
  const { child: server, baseUrl } = await startServer();
  let browser;
  const report = {
    checkedAt: new Date().toISOString(),
    standard: 'WCAG 2.1 A/AA',
    browser: null,
    scans: [],
  };
  try {
    browser = await launchBrowser();
    report.browser = await browser.version();
    for (const [viewport, width, height] of [
      ['desktop', 1440, 1000],
      ['mobile', 390, 844],
    ]) {
      for (const [pageName, route] of [
        ['circuito', '/esports/'],
        ['central', '/esports/acesso.html?area=central'],
        ['perfil', '/esports/acesso.html?area=perfil'],
        ['rascunho-evento', '/esports/acesso.html?area=novo-evento'],
      ]) {
        const context = await browser.newContext({
          viewport: { width, height },
          isMobile: width < 621,
          hasTouch: width < 621,
          reducedMotion: 'reduce',
        });
        const page = await context.newPage();
        await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const scan = {
          viewport,
          page: pageName,
          url: route,
          violations: results.violations.map(summarizeViolation),
          incomplete: results.incomplete.map(item => ({ id: item.id, impact: item.impact })),
        };
        report.scans.push(scan);
        console.log(`${viewport}/${pageName}: ${scan.violations.length} violações, ${scan.incomplete.length} verificações manuais.`);

        if (pageName === 'circuito') {
          await page.click('#echo-id');
          const dialogResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          const dialogScan = {
            viewport,
            page: 'dialogo-identidade',
            url: route,
            violations: dialogResults.violations.map(summarizeViolation),
            incomplete: dialogResults.incomplete.map(item => ({ id: item.id, impact: item.impact })),
          };
          report.scans.push(dialogScan);
          console.log(`${viewport}/dialogo-identidade: ${dialogScan.violations.length} violações, ${dialogScan.incomplete.length} verificações manuais.`);
        }
        await context.close();
      }
    }

    fs.writeFileSync(path.join(outputDir, 'accessibility-report.json'), JSON.stringify(report, null, 2));
    const serious = report.scans.flatMap(scan => scan.violations)
      .filter(violation => ['serious', 'critical'].includes(violation.impact));
    if (serious.length) {
      console.warn(`Encontradas ${serious.length} violações sérias/críticas. Relatório: ${path.join(outputDir, 'accessibility-report.json')}`);
      if (process.env.A11Y_STRICT === '1') process.exitCode = 1;
    } else {
      console.log(`Relatório salvo em ${path.join(outputDir, 'accessibility-report.json')}`);
    }
  } finally {
    await browser?.close();
    server.kill('SIGTERM');
    if (server.exitCode === null) await new Promise(resolve => server.once('exit', resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
