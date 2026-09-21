/* Portable, browser-only prototype repository. No authentication or real permission grants. */
(() => {
  'use strict';
  const KEY = 'echo-circuit-access-v1';
  const clean = (value, max=100) => typeof value === 'string' ? value.trim().slice(0,max) : '';
  const same = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const uid = prefix => prefix+'-'+(crypto.randomUUID?.() || Date.now().toString(36)+Math.random().toString(36).slice(2)).slice(0,12);
  const crests = ['nova','vortex','syndicate'];
  const catalog = () => window.EchoCircuitEvents || [];
  const eventById = id => catalog().find(e=>e.id===id);
  const now = () => new Date().toISOString();
  const timestamp = value => typeof value==='string' && Number.isFinite(Date.parse(value)) ? value : null;
  const blank = () => ({version:1,profile:{nick:'Jogador da Arena',region:'Brasil',crest:'nova'},team:null,registrations:[],drafts:[],activity:[]});
  function normalize(raw) {
    const d=blank();
    if(!raw || typeof raw!=='object' || Array.isArray(raw)) return d;
    if(raw.profile && typeof raw.profile==='object')d.profile={nick:clean(raw.profile.nick,24)||d.profile.nick,region:['Brasil','América Latina','Global'].includes(raw.profile.region)?raw.profile.region:'Brasil',crest:crests.includes(raw.profile.crest)?raw.profile.crest:'nova'};
    if(raw.team && typeof raw.team==='object' && clean(raw.team.name,32)){
      const members=Array.isArray(raw.team.members)?raw.team.members.slice(0,4).filter(m=>m && typeof m==='object' && clean(m.nick,24)).map(m=>({id:clean(m.id,40)||uid('m'),nick:clean(m.nick,24),role:['capitao','titular','reserva'].includes(m.role)?m.role:'titular',status:m.role==='capitao'?'confirmado':['confirmado','recusado'].includes(m.status)?m.status:'pendente',acceptedAt:m.status==='confirmado'?timestamp(m.acceptedAt):null,respondedAt:timestamp(m.respondedAt)})):[];
      const captain=members.find(m=>m.role==='capitao');
      if(!captain)members.unshift({id:'captain',nick:d.profile.nick,role:'capitao',status:'confirmado'});
      d.team={id:clean(raw.team.id,40)||uid('team'),name:clean(raw.team.name,32),tag:clean(raw.team.tag,5).toUpperCase().replace(/[^A-Z0-9]/g,'')||'ECHO',syndicate:clean(raw.team.syndicate,36),crest:crests.includes(raw.team.crest)?raw.team.crest:'nova',members:members.slice(0,4)};
    }
    if(Array.isArray(raw.registrations))d.registrations=raw.registrations.slice(0,30).filter(r=>r && eventById(r.eventId) && ['enviada','confirmada','checkin','cancelada','recusada'].includes(r.status)).map(r=>({id:clean(r.id,40)||uid('reg'),eventId:clean(r.eventId,40),status:r.status,createdAt:clean(r.createdAt,40),updatedAt:clean(r.updatedAt,40),teamName:clean(r.teamName,32),teamTag:clean(r.teamTag,5),crest:crests.includes(r.crest)?r.crest:'nova',syndicate:clean(r.syndicate,36),members:Array.isArray(r.members)?r.members.slice(0,4).filter(m=>m&&typeof m==='object').map(m=>({nick:clean(m.nick,24),role:['capitao','titular','reserva'].includes(m.role)?m.role:'titular',status:'confirmado',acceptedAt:timestamp(m.acceptedAt)})):[],note:clean(r.note,200),reviewNote:clean(r.reviewNote,160)}));
    if(Array.isArray(raw.drafts))d.drafts=raw.drafts.slice(0,20).filter(e=>e&&typeof e==='object'&&clean(e.name,60)).map(e=>({id:clean(e.id,40)||uid('draft'),name:clean(e.name,60),category:['Amador','Profissional','Sindicatos','Especial'].includes(e.category)?e.category:'Amador',format:['Mata-mata','Grupos + finais','Liga'].includes(e.format)?e.format:'Mata-mata',capacity:[8,16,24,32,64].includes(Number(e.capacity))?Number(e.capacity):16,date:/^\d{4}-\d{2}-\d{2}$/.test(e.date||'')?e.date:'2026-10-24',time:/^\d{2}:\d{2}$/.test(e.time||'')?e.time:'19:00',description:clean(e.description,400),rules:clean(e.rules,1500),createdAt:clean(e.createdAt,40),updatedAt:clean(e.updatedAt,40)}));
    if(Array.isArray(raw.activity))d.activity=raw.activity.slice(0,30).filter(a=>a&&typeof a==='object'&&clean(a.text,160)).map(a=>({id:clean(a.id,40),text:clean(a.text,160),at:clean(a.at,40),type:['team','registration','draft','profile'].includes(a.type)?a.type:'profile'}));
    return d;
  }
  let data=blank(), storageAvailable=true;
  try {data=normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{storageAvailable=false;}
  const snapshot = () => JSON.parse(JSON.stringify(data));
  function addActivity(d,text,type) {d.activity.unshift({id:uid('a'),text,at:now(),type});d.activity=d.activity.slice(0,30);}
  function commit(change) {
    const next=snapshot();change(next);
    data=next;
    try{localStorage.setItem(KEY,JSON.stringify(data));storageAvailable=true;}catch{storageAvailable=false;}
    window.dispatchEvent(new CustomEvent('echo:portal-change',{detail:{persistent:storageAvailable}}));
    return snapshot();
  }
  const requireText = (value,min,max,label) => {const s=clean(value,max);if(s.length<min)throw Error(label+' precisa de pelo menos '+min+' caracteres.');return s;};
  function readiness(eventId) {
    const reasons=[];const t=data.team;
    if(!t)return {ready:false,reasons:['Crie sua equipe para continuar.'],confirmed:0,pending:0};
    const starters=t.members.filter(m=>m.role!=='reserva' && m.status==='confirmado');
    const pending=t.members.filter(m=>m.status==='pendente');
    const vacant=3-t.members.filter(m=>m.role!=='reserva').length;
    if(vacant<0)reasons.push('Mantenha exatamente 3 titulares, incluindo o capitão. Remova o titular excedente.');
    if(vacant>0)reasons.push('Falta'+(vacant===1?'':'m')+' adicionar '+vacant+' titular'+(vacant===1?'':'es')+' em Minha equipe e confirmar o aceite.');
    t.members.filter(m=>m.status!=='confirmado').forEach(m=>{
      const position=m.role==='reserva'?'Reserva opcional':'Titular';
      reasons.push(position+' '+m.nick+': '+(m.status==='recusado'?'recusou o convite. Simule um novo aceite ou remova '+(m.role==='reserva'?'a reserva para seguir sem ela.':'o jogador e convide outro titular.'):'aguardando resposta. Use “Simular aceite” abaixo'+(m.role==='reserva'?' ou remova a reserva para seguir sem ela.':', ou remova e substitua o jogador.')));
    });
    if(eventById(eventId)?.category==='Sindicatos'&&!t.syndicate)reasons.push('Informe o sindicato da equipe para disputar esta copa.');
    return {ready:!reasons.length,reasons,confirmed:starters.length,pending:pending.length};
  }
  function respondMember(id,decision){
    const m=data.team?.members.find(m=>m.id===id);
    if(!m||m.role==='capitao')throw Error('Convite não encontrado.');
    if(m.status===decision)return snapshot();
    return commit(d=>{const member=d.team.members.find(m=>m.id===id),at=now();member.status=decision;member.respondedAt=at;member.acceptedAt=decision==='confirmado'?at:null;addActivity(d,m.nick+(decision==='confirmado'?' aceitou':' recusou')+' o convite na simulação.','team');});
  }
  function activeRegistration(eventId){return data.registrations.find(r=>r.eventId===eventId&&!['cancelada','recusada'].includes(r.status));}
  function markIdentity(active){try{let s=JSON.parse(localStorage.getItem('echo-circuit-prototype-v1')||'{}');if(!s||typeof s!=='object'||Array.isArray(s))s={};s.identity=active;localStorage.setItem('echo-circuit-prototype-v1',JSON.stringify(s));}catch{}}
  const api={
    read:snapshot,
    persistent:()=>storageAvailable,
    readiness,
    activeRegistration,
    enter:()=>markIdentity(true),
    leave:()=>markIdentity(false),
    saveProfile(input){const nick=requireText(input.nick,2,24,'O nome de jogador');if(data.team?.members.some(m=>m.role!=='capitao'&&same(m.nick)===same(nick)))throw Error('Este nome já pertence a outro jogador do seu elenco.');return commit(d=>{d.profile={nick,region:['Brasil','América Latina','Global'].includes(input.region)?input.region:'Brasil',crest:crests.includes(input.crest)?input.crest:'nova'};if(d.team){const cap=d.team.members.find(m=>m.role==='capitao');if(cap)cap.nick=nick;}addActivity(d,'Echo iD de demonstração atualizado.','profile');});},
    saveTeam(input){const name=requireText(input.name,3,32,'O nome da equipe');const tag=clean(input.tag,5).toUpperCase();if(!/^[A-Z0-9]{2,5}$/.test(tag))throw Error('A sigla precisa de 2 a 5 letras ou números.');return commit(d=>{const existing=d.team;d.team={id:existing?.id||uid('team'),name,tag,syndicate:clean(input.syndicate,36),crest:crests.includes(input.crest)?input.crest:'nova',members:existing?.members||[{id:'captain',nick:d.profile.nick,role:'capitao',status:'confirmado'}]};addActivity(d,existing?'Identidade da equipe atualizada.':'Equipe '+name+' criada na prévia.','team');});},
    addMember(input){if(!data.team)throw Error('Crie uma equipe primeiro.');const nick=requireText(input.nick,2,24,'O nome do jogador');if(data.team.members.some(m=>same(m.nick)===same(nick)))throw Error('Este jogador já está no elenco.');if(data.team.members.length>=4)throw Error('O elenco de exemplo comporta 3 titulares e 1 reserva.');const role=input.role==='reserva'?'reserva':'titular';if(role==='reserva'&&data.team.members.some(m=>m.role==='reserva'))throw Error('A vaga de reserva já está ocupada.');if(role==='titular'&&data.team.members.filter(m=>m.role!=='reserva').length>=3)throw Error('As 3 vagas de titulares já estão ocupadas.');return commit(d=>{d.team.members.push({id:uid('m'),nick,role,status:'pendente'});addActivity(d,'Convite de demonstração preparado para '+nick+'.','team');});},
    acceptMember(id){return respondMember(id,'confirmado');},
    declineMember(id){return respondMember(id,'recusado');},
    removeMember(id){const m=data.team?.members.find(m=>m.id===id);if(!m||m.role==='capitao')throw Error('O capitão não pode ser removido nesta prévia.');return commit(d=>{d.team.members=d.team.members.filter(m=>m.id!==id);addActivity(d,m.nick+' removido do elenco.','team');});},
    fillDemoRoster(){if(!data.team)throw Error('Crie uma equipe primeiro.');return commit(d=>{const names=['Shadow','Vega','Phoenix','Raven'];while(d.team.members.filter(m=>m.role!=='reserva').length<3){const nick=names.find(n=>!d.team.members.some(m=>same(m.nick)===same(n)));if(!nick)break;d.team.members.push({id:uid('m'),nick,role:'titular',status:'confirmado',acceptedAt:now(),respondedAt:now()});}addActivity(d,'Titulares de exemplo adicionados ao elenco.','team');});},
    register(eventId,input){const e=eventById(eventId);if(!e||e.status!=='Inscrições abertas')throw Error('Esta competição não está aberta para inscrições na prévia.');if(activeRegistration(eventId))throw Error('Sua equipe já possui uma inscrição ativa nesta competição.');const r=readiness(eventId);if(!r.ready)throw Error(r.reasons[0]);if(input.accepted!==true)throw Error('Leia e aceite o regulamento demonstrativo.');return commit(d=>{const t=d.team;d.registrations.unshift({id:uid('EC').toUpperCase(),eventId,status:'enviada',createdAt:now(),updatedAt:now(),teamName:t.name,teamTag:t.tag,crest:t.crest,syndicate:t.syndicate,members:t.members.filter(m=>m.status==='confirmado').map(({nick,role,acceptedAt})=>({nick,role,status:'confirmado',acceptedAt:acceptedAt||null})),note:clean(input.note,200),reviewNote:''});addActivity(d,'Inscrição de demonstração enviada para '+e.name+'.','registration');});},
    cancelRegistration(id){const r=data.registrations.find(r=>r.id===id);if(!r||['cancelada','recusada'].includes(r.status))throw Error('Esta inscrição já foi encerrada.');return commit(d=>{const item=d.registrations.find(r=>r.id===id);item.status='cancelada';item.updatedAt=now();addActivity(d,'Inscrição em '+eventById(r.eventId).name+' cancelada na prévia.','registration');});},
    reviewRegistration(id,decision,note=''){const r=data.registrations.find(r=>r.id===id);if(!r||r.status!=='enviada')throw Error('A inscrição não está aguardando análise.');if(!['confirmada','recusada'].includes(decision))throw Error('Decisão inválida.');if(decision==='recusada'&&clean(note,160).length<5)throw Error('Informe um motivo para a recusa (pelo menos 5 caracteres).');return commit(d=>{const item=d.registrations.find(r=>r.id===id);item.status=decision;item.reviewNote=clean(note,160);item.updatedAt=now();addActivity(d,'Organização simulada: inscrição '+(decision==='confirmada'?'confirmada':'recusada')+' em '+eventById(r.eventId).name+'.','registration');});},
    checkin(id){const r=data.registrations.find(r=>r.id===id);if(!r||r.status!=='confirmada')throw Error('O check-in fica disponível após a confirmação da inscrição.');return commit(d=>{const item=d.registrations.find(r=>r.id===id);item.status='checkin';item.updatedAt=now();addActivity(d,'Check-in demonstrativo concluído em '+eventById(r.eventId).name+'.','registration');});},
    saveDraft(input,id){if(data.drafts.length>=20&&!id)throw Error('Você já tem 20 rascunhos nesta prévia.');const name=requireText(input.name,3,60,'O nome da competição');if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date||'')||!Number.isFinite(Date.parse(input.date+'T12:00:00Z')))throw Error('Escolha uma data válida para o evento de exemplo.');if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time||''))throw Error('Escolha um horário válido.');if(id&&!data.drafts.some(d=>d.id===id))throw Error('Rascunho não encontrado.');const item={id:id||uid('draft'),name,category:['Amador','Profissional','Sindicatos','Especial'].includes(input.category)?input.category:'Amador',format:['Mata-mata','Grupos + finais','Liga'].includes(input.format)?input.format:'Mata-mata',capacity:[8,16,24,32,64].includes(Number(input.capacity))?Number(input.capacity):16,date:input.date,time:input.time,description:clean(input.description,400),rules:clean(input.rules,1500),createdAt:data.drafts.find(d=>d.id===id)?.createdAt||now(),updatedAt:now()};commit(d=>{const i=d.drafts.findIndex(d=>d.id===item.id);if(i>=0)d.drafts[i]=item;else d.drafts.unshift(item);addActivity(d,(id?'Rascunho atualizado: ':'Novo rascunho: ')+name+'.','draft');});return item.id;},
    deleteDraft(id){if(!data.drafts.some(d=>d.id===id))throw Error('Rascunho não encontrado.');return commit(d=>{d.drafts=d.drafts.filter(d=>d.id!==id);addActivity(d,'Um rascunho de competição foi removido.','draft');});},
    reset(){data=blank();try{localStorage.removeItem(KEY);storageAvailable=true;}catch{storageAvailable=false;}window.dispatchEvent(new CustomEvent('echo:portal-change'));},
    reload(){try{data=normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{storageAvailable=false;}return snapshot();}
  };
  window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){api.reload();window.dispatchEvent(new CustomEvent('echo:portal-change',{detail:{external:true,persistent:storageAvailable}}));}});
  // Refresh before validation as well as writes, so another tab cannot silently
  // overwrite a response made while this tab was inactive.
  for(const name of ['saveProfile','saveTeam','addMember','acceptMember','declineMember','removeMember','fillDemoRoster','register','cancelRegistration','reviewRegistration','checkin','saveDraft','deleteDraft']){
    const method=api[name];api[name]=(...args)=>{if(storageAvailable)api.reload();return method(...args);};
  }
  window.EchoCircuitRepository=Object.freeze(api);
})();
