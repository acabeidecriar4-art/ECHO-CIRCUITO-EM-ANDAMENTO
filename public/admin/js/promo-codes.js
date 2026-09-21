import { supabase } from '../../js/supabase.js?v=20260823-security-supabase-pin-1&pgv=82901afbc8df';

const form=document.getElementById('promo-form');
const list=document.getElementById('promo-list');
const message=document.getElementById('promo-message');
const formStatus=document.getElementById('promo-form-status');
const deleteButton=document.getElementById('promo-delete');
const previewButton=document.getElementById('promo-preview');
const PROMO_GAME='Bullet Echo';
let rows=[];
let activeId=null;

function setStatus(target,text='',kind=''){
  if(!target)return;
  target.textContent=text;
  target.className=`promo-status${kind?` ${kind}`:''}`;
}
function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function maskCode(value=''){
  const code=String(value||'').trim();
  if(!code)return 'sem código';
  if(code.length<=4)return '••••';
  return `${escapeHtml(code.slice(0,2))}${'•'.repeat(Math.min(8,Math.max(4,code.length-4)))}${escapeHtml(code.slice(-2))}`;
}
function toLocalInput(value){
  if(!value)return '';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '';
  const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);
  return local.toISOString().slice(0,16);
}
function toIso(value){
  if(!value)return null;
  const date=new Date(value);
  return Number.isNaN(date.getTime())?null:date.toISOString();
}
function nowLocal(){ return toLocalInput(new Date().toISOString()); }
function statusCopy(row){
  if(row.published&&row.status==='active'&&row.verification_status==='verified')return ['Publicado','live'];
  if(row.verification_status==='pending')return ['Pendente','pending'];
  if(row.status==='expired')return ['Expirado',''];
  if(row.status==='invalid'||row.verification_status==='rejected')return ['Inválido',''];
  return [row.status||'Rascunho',''];
}
function renderList(){
  if(!rows.length){ list.innerHTML='<div class="promo-status">Nenhum código cadastrado.</div>'; return; }
  list.innerHTML=rows.map(row=>{
    const [label,tone]=statusCopy(row);
    const when=row.discovered_at?new Date(row.discovered_at).toLocaleString('pt-BR'):'—';
    return `<button type="button" class="promo-item ${row.id===activeId?'active':''}" data-id="${escapeHtml(row.id)}"><div class="promo-item-head"><strong>${escapeHtml(row.title)}</strong><span class="promo-pill ${tone}">${escapeHtml(label)}</span></div><span>${escapeHtml(row.source_name)} · ${escapeHtml(when)}</span><span>${maskCode(row.code)} · ${Number(row.likes_count||0)} curtida(s)</span></button>`;
  }).join('');
  list.querySelectorAll('[data-id]').forEach(button=>button.addEventListener('click',()=>selectRow(button.dataset.id)));
}
function resetForm(){
  activeId=null;
  form.reset();
  form.elements.id.value='';
  form.elements.game.value=PROMO_GAME;
  form.elements.banner_label.value='NOVO CÓDIGO PROMOCIONAL';
  form.elements.banner_message.value='Curta para revelar o código.';
  form.elements.verification_status.value='pending';
  form.elements.status.value='pending_verification';
  form.elements.source_type.value='official';
  form.elements.source_name.value='ZeptoLab Support — Bullet Echo';
  form.elements.discovered_at.value=nowLocal();
  form.elements.published.checked=false;
  deleteButton.hidden=true;
  setStatus(formStatus);
  renderList();
}
function selectRow(id){
  const row=rows.find(item=>item.id===id);
  if(!row)return;
  activeId=row.id;
  const values={
    id:row.id,game:PROMO_GAME,title:row.title,reward:row.reward||'',code:row.code||'',
    source_type:'official',source_name:row.source_name,source_url:row.source_url,
    verification_status:row.verification_status,verification_method:row.verification_method||'',
    status:row.status,banner_label:row.banner_label,banner_message:row.banner_message
  };
  Object.entries(values).forEach(([name,value])=>{ if(form.elements[name])form.elements[name].value=value; });
  form.elements.discovered_at.value=toLocalInput(row.discovered_at);
  form.elements.verified_at.value=toLocalInput(row.verified_at);
  form.elements.starts_at.value=toLocalInput(row.starts_at);
  form.elements.expires_at.value=toLocalInput(row.expires_at);
  form.elements.published.checked=row.published===true;
  deleteButton.hidden=false;
  setStatus(formStatus);
  renderList();
}
async function load(){
  setStatus(message,'Carregando códigos…');
  const {data,error}=await supabase.rpc('promo_admin_list');
  if(error){
    console.error('[promo-admin] load failed',error);
    setStatus(message,`Não foi possível carregar: ${error.message}`,'error');
    list.innerHTML='<div class="promo-status error">Falha ao carregar.</div>';
    return;
  }
  rows=Array.isArray(data)?data:[];
  setStatus(message,rows.length?`${rows.length} campanha(s) cadastrada(s).`:'Nenhuma campanha cadastrada.');
  renderList();
  if(activeId&&!rows.some(row=>row.id===activeId))resetForm();
}
function payload(){
  const e=form.elements;
  return {
    p_id:e.id.value||null,
    p_game:PROMO_GAME,
    p_title:e.title.value.trim(),
    p_reward:e.reward.value.trim()||null,
    p_banner_label:e.banner_label.value.trim(),
    p_banner_message:e.banner_message.value.trim(),
    p_source_type:'official',
    p_source_name:e.source_name.value,
    p_source_url:e.source_url.value.trim(),
    p_verification_status:e.verification_status.value,
    p_verification_method:e.verification_method.value.trim()||null,
    p_discovered_at:toIso(e.discovered_at.value),
    p_verified_at:toIso(e.verified_at.value),
    p_starts_at:toIso(e.starts_at.value),
    p_expires_at:toIso(e.expires_at.value),
    p_status:e.status.value,
    p_published:e.published.checked,
    p_code:e.code.value.trim()
  };
}
function friendlySaveError(error){
  const text=String(error?.message||'');
  if(text.includes('promo_official_source_required'))return 'A fonte não corresponde a um canal oficial reconhecido do Bullet Echo/ZeptoLab.';
  if(text.includes('promo_game_must_be_bullet_echo'))return 'Este módulo aceita somente códigos do Bullet Echo.';
  if(text.includes('published_promo_must_be_verified_and_active'))return 'Para publicar, marque Verificação = Confirmada e Estado = Ativo.';
  return `Falha ao salvar: ${text||'erro desconhecido'}`;
}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=payload();
  if(data.p_published&&(data.p_verification_status!=='verified'||data.p_status!=='active')){
    setStatus(formStatus,'Para publicar, marque Verificação = Confirmada e Estado = Ativo.','error');
    return;
  }
  setStatus(formStatus,'Validando fonte oficial e salvando…');
  const {data:id,error}=await supabase.rpc('promo_admin_save',data);
  if(error){
    console.error('[promo-admin] save failed',error);
    setStatus(formStatus,friendlySaveError(error),'error');
    return;
  }
  activeId=id;
  setStatus(formStatus,'Código salvo com fonte oficial validada.','ok');
  await load();
  if(activeId)selectRow(activeId);
});

deleteButton.addEventListener('click',async()=>{
  if(!activeId)return;
  const row=rows.find(item=>item.id===activeId);
  if(!confirm(`Excluir definitivamente “${row?.title||'este código'}”? As curtidas vinculadas também serão removidas.`))return;
  setStatus(formStatus,'Excluindo…');
  const {error}=await supabase.rpc('promo_admin_delete',{p_promo_id:activeId});
  if(error){ setStatus(formStatus,`Falha ao excluir: ${error.message}`,'error'); return; }
  resetForm();
  await load();
  setStatus(message,'Código excluído.','ok');
});

previewButton?.addEventListener('click',()=>{
  const url=new URL('../index.html',location.href);
  url.searchParams.set('promo_preview','1');
  url.searchParams.set('preview_v','20260823-admin-preview-1');
  const opened=window.open(url.href,'_blank');
  if(!opened)location.href=url.href;
});

document.getElementById('promo-new')?.addEventListener('click',resetForm);
document.getElementById('promo-reset')?.addEventListener('click',resetForm);

resetForm();
await load();