// Event presentation. Fictional showcase data; no connection to real registrations.
(() => {
  const stage = document.querySelector('#stage-panel');
  const stageData = {
    masters: { left:'NOVA',right:'VORTEX',leftLabel:'FORÇA E PRECISÃO',rightLabel:'CAOS E ESTRATÉGIA',leftCrest:'nova',rightCrest:'vortex',phase:'SEMIFINAL · MD3',score:'1 <em>:</em> 1',caption:'SÉRIE ILUSTRATIVA',format:'16 equipes',date:'19 SET · 20H',label:'O confronto que vale uma final.',action:'EXPLORAR CONFRONTO' },
    open: { left:'SEU TRIO',right:'A ARENA',leftLabel:'A PRÓXIMA SENSAÇÃO',rightLabel:'UM NOVO DESAFIO',leftCrest:'nova',rightCrest:'syndicate',phase:'COPA ABERTA',score:'<em>VS</em>',caption:'INSCRIÇÕES · DEMO',format:'32 equipes',date:'26 SET · 19H',label:'Toda lenda tem uma primeira vitória.',action:'CONHECER O OPEN' },
    syndicate: { left:'SINDICATO ALFA',right:'CLÃ RUBRO',leftLabel:'JUNTOS ATÉ O FIM',rightLabel:'ORGULHO EM CADA DISPUTA',leftCrest:'syndicate',rightCrest:'nova',phase:'FASE DE GRUPOS',score:'<em>VS</em>',caption:'CONFRONTO EXEMPLO',format:'24 equipes',date:'03 OUT · 18H',label:'O seu sindicato. As suas cores.',action:'EXPLORAR A COPA' }
  };
  let selectedStage = 'masters';
  function showStage(id) {
    if (!stageData[id]) return;
    selectedStage = id;
    const d = stageData[id];
    stage.dataset.active = id;
    stage.setAttribute('aria-labelledby', 'stage-tab-' + id);
    document.querySelectorAll('[data-stage]').forEach(b => {
      const selected = b.dataset.stage === id;
      b.setAttribute('aria-selected', String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    stage.innerHTML = `<div class="stage-match"><div class="stage-team"><svg viewBox="0 0 100 110" aria-hidden="true"><use href="#crest-${d.leftCrest}"></use></svg><div><small>${d.leftLabel}</small><strong>${d.left}</strong></div></div><div class="stage-score"><span class="match-phase">${d.phase}</span><b>${d.score}</b><small>${d.caption}</small></div><div class="stage-team"><svg viewBox="0 0 100 110" aria-hidden="true"><use href="#crest-${d.rightCrest}"></use></svg><div><small>${d.rightLabel}</small><strong>${d.right}</strong></div></div></div><div class="stage-match-footer"><div class="stage-summary"><span><b>${d.date}</b><br>BRASÍLIA · DATA DEMO</span><span>${d.format}<br>${d.label}</span></div><button class="stage-open" data-stage-open>${d.action}<span aria-hidden="true">↗</span></button></div>`;
  }

  const opening = document.querySelector('#opening-dialog');
  const scene = document.querySelector('#opening-scene');
  const progress = [...document.querySelectorAll('.opening-progress > span')];
  const pauseButton = document.querySelector('#opening-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [
    { label:'01 / A CONVOCAÇÃO',eyebrow:'AS LUZES SE ACENDEM.',title:'UMA COMUNIDADE.<br><span>UM NOVO PALCO.</span>',description:'De cada canto da Arena, surge uma equipe pronta para fazer história.' },
    { label:'02 / O CONFRONTO',eyebrow:'A TENSÃO SOBE.',title:'CADA PARTIDA<br><span>MUDA TUDO.</span>',description:'Estratégia, sintonia e aquele último segundo que separa a derrota da consagração.',versus:true },
    { label:'03 / O LEGADO',eyebrow:'A GLÓRIA ESPERA POR VOCÊ.',title:'O PRÓXIMO NOME<br><span>PODE SER O SEU.</span>',description:'Encontre sua competição. Reúna sua equipe. Dê o primeiro passo para deixar sua marca.',cta:true }
  ];
  let chapter = 0, playing = false, timer = null, remaining = 7000, started = 0;
  function cancelTimer() { if(timer !== null){ clearTimeout(timer);timer = null; } }
  function syncPlayback() {
    opening.classList.toggle('is-paused', !playing);
    pauseButton.setAttribute('aria-pressed', String(!playing));
    pauseButton.textContent = playing ? 'Pausar' : (chapter === 2 && remaining <= 0 ? 'Reiniciar' : 'Reproduzir');
  }
  function schedule() {
    cancelTimer();
    if (!playing || !opening.open || document.hidden || reduced.matches) return;
    started = performance.now();
    timer = setTimeout(() => {
      timer = null;
      if (chapter < chapters.length - 1) showChapter(chapter + 1);
      else { remaining = 0;playing = false;syncPlayback(); }
    }, remaining);
  }
  function pause() {
    if(timer !== null) remaining = Math.max(0, remaining - (performance.now() - started));
    playing = false;cancelTimer();syncPlayback();
  }
  function showChapter(index) {
    chapter = Math.max(0, Math.min(chapters.length - 1, index));
    remaining = 7000;
    const c = chapters[chapter];
    scene.classList.remove('enter');
    scene.innerHTML = `<p class="eyebrow">${c.eyebrow}</p>${c.versus?'<div class="opening-versus" aria-hidden="true"><svg viewBox="0 0 100 110"><use href="#crest-nova"></use></svg><span>VS</span><svg viewBox="0 0 100 110"><use href="#crest-vortex"></use></svg></div>':''}<h2 id="opening-title">${c.title}</h2><p>${c.description}</p>${c.cta?'<button class="button primary" id="opening-explore">EXPLORAR COMPETIÇÕES <span aria-hidden="true">↗</span></button>':''}`;
    void scene.offsetWidth;
    scene.classList.add('enter');
    progress.forEach((bar,i) => {
      bar.className = '';
      void bar.offsetWidth;
      if(i < chapter)bar.className = 'done';
      if(i === chapter)bar.className = 'current';
    });
    document.querySelector('#opening-chapter').textContent = c.label;
    document.querySelector('#opening-previous').disabled = chapter === 0;
    document.querySelector('#opening-next').disabled = chapter === chapters.length - 1;
    syncPlayback();schedule();
  }
  function startOpening() {
    playing = !state.paused && !reduced.matches;
    showChapter(0);
    showDialog(opening);
    schedule();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if(!button) return;
    if(button.hasAttribute('data-stage')) showStage(button.dataset.stage);
    else if(button.hasAttribute('data-stage-open')) {
      openEvent(selectedStage);
      if(selectedStage === 'masters'){state.detailTab = 'matches';renderDetail();}
    }
    else if(button.hasAttribute('data-opening')) startOpening();
    else if(button.id === 'opening-previous') showChapter(chapter-1);
    else if(button.id === 'opening-next') showChapter(chapter+1);
    else if(button.id === 'opening-pause') {
      if(playing)pause();
      else {playing = true;if(chapter === 2 && remaining <= 0)showChapter(0);else{syncPlayback();schedule();}}
    }
    else if(button.id === 'opening-explore') {opening.close();location.hash = 'competicoes';}
  });
  opening.addEventListener('close', () => {cancelTimer();playing = false;});
  opening.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight'){e.preventDefault();showChapter(chapter+1);}
    if(e.key === 'ArrowLeft'){e.preventDefault();showChapter(chapter-1);}
  });
  document.addEventListener('visibilitychange', () => {if(document.hidden && playing)pause();});
  reduced.addEventListener('change', () => {if(reduced.matches)pause();});
  showStage('masters');
})();
