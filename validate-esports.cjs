// Run with Playwright available; ECHO_CHROMIUM_MODULE optionally provides a portable browser.
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.join(__dirname,'public');
const out=process.env.ECHO_QA_OUTPUT||'/tmp/echo-circuit-qa';
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{let requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let base=root;if(requested.startsWith('/reference/')){base='/tmp/echo-reference-local';requested=requested.slice('/reference'.length);}if(requested.endsWith('/'))requested+='index.html';const file=path.join(base,requested);if(!file.startsWith(base)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end('Not found');return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  let options={headless:true};if(process.env.ECHO_CHROMIUM_EXECUTABLE){options={...options,executablePath:process.env.ECHO_CHROMIUM_EXECUTABLE,args:['--disable-gpu','--disable-dev-shm-usage']};}else if(process.env.ECHO_CHROMIUM_MODULE){const {default:c}=await import(process.env.ECHO_CHROMIUM_MODULE);options={...options,executablePath:await c.executablePath(),args:c.args};}
  const browser=await chromium.launch(options);const report={browser:await browser.version(),checkedAt:new Date().toISOString(),viewports:[],flows:[]};
  try{
    for(const [name,width,height,touch] of [['desktop',1440,1000,false],['tablet',820,1180,true],['tablet-landscape',1180,820,true],['mobile',390,844,true],['small-mobile',320,740,true]]){
      const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:width<621,deviceScaleFactor:1,reducedMotion:'reduce'});
      const page=await context.newPage();const errors=[];const failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
      await page.goto(base+'/esports/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('.event-card').count(),6);
      const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(dimensions.scroll<=dimensions.viewport+1,`${name}: horizontal overflow ${JSON.stringify(dimensions)}`);
      assert.equal(await page.locator('main > section').count(),3);
      if(name!=='tablet-landscape'&&name!=='small-mobile')await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
      if(width<621){await page.click('#menu-button');assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');await page.click('#main-nav a[href="#competicoes"]');assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');}
      await page.click('[data-stage="open"]');assert.match(await page.locator('#stage-panel').innerText(),/SEU TRIO/);await page.click('[data-stage-open]');assert.match(await page.locator('#detail-title').innerText(),/Echo Open/);await page.click('#detail-dialog [data-close]');await page.waitForURL(u=>!u.searchParams.has('competicao'));
      await page.click('[data-stage="syndicate"]');assert.match(await page.locator('#stage-panel').innerText(),/SINDICATO ALFA/);await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('[data-stage="open"]').getAttribute('aria-selected'),'true');await page.click('[data-stage="masters"]');await page.click('[data-stage-open]');assert.equal(await page.locator('[data-detail-tab="matches"]').getAttribute('aria-selected'),'true');await page.click('#detail-dialog [data-close]');await page.waitForURL(u=>!u.searchParams.has('competicao'));
      await page.click('[data-opening]');assert.ok(await page.locator('#opening-dialog').isVisible());assert.match(await page.locator('#opening-title').innerText(),/UMA COMUNIDADE/);await page.click('#opening-next');assert.match(await page.locator('#opening-title').innerText(),/CADA PARTIDA/);await page.keyboard.press('ArrowLeft');assert.match(await page.locator('#opening-title').innerText(),/UMA COMUNIDADE/);await page.click('#opening-next');await page.click('#opening-next');assert.match(await page.locator('#opening-title').innerText(),/O PRÓXIMO NOME/);if(name==='mobile')await page.screenshot({path:path.join(out,'mobile-opening-experience.png')});await page.click('#opening-explore');assert.equal(await page.locator('#opening-dialog').isVisible(),false);assert.ok(page.url().endsWith('#competicoes'));
      await page.locator('[data-category="Sindicatos"]').click();assert.equal(await page.locator('.event-card').count(),1);assert.match(await page.locator('.event-card').innerText(),/Copa dos Sindicatos/);
      await page.locator('[data-category="all"]').click();await page.fill('#search','ascensao');assert.equal(await page.locator('.event-card').count(),1);
      await page.fill('#search','nada-encontrado');assert.ok(await page.locator('#empty').isVisible());await page.click('#reset-filters');
      await page.selectOption('#status-filter','Encerrado');assert.equal(await page.locator('.event-card').count(),1);await page.selectOption('#status-filter','all');
      await page.locator('[data-follow="open"]').click();await page.click('#favorites-filter');assert.equal(await page.locator('.event-card').count(),1);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-follow="open"]').getAttribute('aria-pressed'),'true');
      await page.click('[data-view="calendar"]');assert.equal(await page.locator('.agenda-row').count(),3);await page.click('#next-month');assert.match(await page.locator('#calendar-month').innerText(),/outubro/i);assert.equal(await page.locator('.agenda-row').count(),3);await page.click('#previous-month');
      await page.locator('.agenda-row[data-event="masters"]').click();assert.ok(await page.locator('#detail-dialog').isVisible());assert.match(page.url(),/competicao=masters/);
      await page.click('[data-detail-tab="matches"]');assert.equal(await page.locator('.match-row').count(),2);await page.click('[data-detail-tab="rules"]');assert.match(await page.locator('#detail-content').innerText(),/Não é um regulamento oficial/);
      if(name==='mobile')await page.screenshot({path:path.join(out,'mobile-detail.png')});
      await page.keyboard.press('Escape');assert.equal(await page.locator('#detail-dialog').isVisible(),false);await page.waitForURL(u=>!u.searchParams.has('competicao'));
      await page.goto(base+'/esports/?competicao=night',{waitUntil:'networkidle'});assert.match(await page.locator('#detail-title').innerText(),/Nightfall/);await page.click('[data-detail-tab="matches"]');assert.match(await page.locator('#detail-content').innerText(),/3 : 1/);await page.click('#detail-dialog [data-close]');
      await page.locator('[data-format="groups"]').click();assert.equal(await page.locator('.mini-groups>div').count(),2);await page.locator('[data-format="league"]').click();assert.equal(await page.locator('.league-table tbody tr').count(),3);await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('[data-format="groups"]').getAttribute('aria-selected'),'true');
      await page.click('#echo-id');await page.click('#activate-identity');await page.waitForURL('**/acesso.html?area=central');assert.match(await page.locator('h1').innerText(),/conquista/i);await page.goto(base+'/esports/',{waitUntil:'networkidle'});assert.match(await page.locator('#echo-id').getAttribute('aria-label'),/central de demonstração/);
      await page.click('#circuit-info');assert.ok(await page.locator('#info-dialog').isVisible());await page.click('#info-explore');assert.ok(page.url().endsWith('#competicoes'));
      assert.deepEqual(errors,[],name+' console errors');assert.deepEqual(failed,[],name+' failed assets');
      report.viewports.push({name,width,height,touch,status:'passed',horizontalOverflow:false,javascriptErrors:errors,failedAssets:failed});console.log(name+': all interaction checks passed');await context.close();
    }
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await page.route('https://**/*',r=>r.abort());if(fs.existsSync('/tmp/echo-reference-local/index.html')){await page.goto(base+'/reference/',{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,'reference.png'),fullPage:true});}await page.close();
    report.flows=['Responsive layout with no horizontal overflow','Mobile menu and anchor navigation','Featured event switching and direct matchup access','Cinematic opening: all chapters, keyboard navigation, close and competition CTA','Category, accent-insensitive search, status and empty-state reset','Follow/unfollow persistence after reload','Monthly agenda navigation','Competition overview, matches and regulations','Direct competition URL after fresh load','Dialog close and Escape','Format tabs and keyboard arrow navigation','Demo Echo iD persistence','Circuit information modal','No JavaScript errors or failed assets'];fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(report,null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
