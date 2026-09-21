import {
  humanizeAttributeKey,
  resolveEquipmentRule,
  targetLabel
} from '../../js/equipment-audit-rules.js?v=2&pgv=82901afbc8df';
import { resolveExternalDataEffect } from '../../js/equipment-data-limits.js?v=2&pgv=82901afbc8df';
import {
  refreshEquipmentAttributeClassifications,
  resolvePersistedAttributeClassification
} from '../../js/equipment-attribute-classifications.js?v=3&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df';
import { showAdminDecisionModal } from './admin-decision-modal.js?v=1&pgv=82901afbc8df';

const form = document.getElementById('form');
const rarityHost = document.getElementById('rarities');
let allowNextSubmit = false;

await refreshEquipmentAttributeClassifications();

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function numberFrom(value) {
  const text = String(value ?? '').trim().replace(',', '.');
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function persistedFor(rawKey = '') {
  return resolvePersistedAttributeClassification(rawKey);
}

function resolveAnyExternal(rawKey = '') {
  const persisted = persistedFor(rawKey);
  if (persisted?.classification === 'external_data_required') {
    return {
      label: persisted.label,
      reason: persisted.reason,
      missingData: persisted.missingData,
      publicNote: persisted.publicNote,
      persisted: true
    };
  }
  return resolveExternalDataEffect(rawKey);
}

function ensureStyles() {
  if (document.getElementById('equipment-attribute-assistant-style')) return;
  const style = document.createElement('style');
  style.id = 'equipment-attribute-assistant-style';
  style.textContent = `
    .attribute-assistant-guide{margin:0 0 14px;padding:12px 13px;border:1px solid #33445f;border-radius:11px;background:#081321;color:#9eabc0;font-size:10px;line-height:1.5}
    .attribute-assistant-guide strong{display:block;color:#eef3fa;font-size:11px}.attribute-assistant-guide span{display:block;margin-top:4px}
    .attribute-assistant-summary{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.attribute-assistant-pill{padding:4px 7px;border-radius:999px;border:1px solid #31425d;font-size:8px;font-weight:900}.attribute-assistant-pill.ok{color:#86efac;border-color:#225d49}.attribute-assistant-pill.warn{color:#fde68a;border-color:#76591c}.attribute-assistant-pill.bad{color:#fecdd3;border-color:#7f1d1d}.attribute-assistant-pill.external{color:#fde68a;border-color:#76591c;background:rgba(120,83,8,.08)}.attribute-assistant-pill.informational{color:#bfdbfe;border-color:#315a8b;background:rgba(30,64,175,.08)}
    .attr-row .attribute-assistant{grid-column:1/-1;margin-top:2px;padding:8px 9px;border:1px solid #26344d;border-radius:8px;background:#07101d;font-size:9px;line-height:1.45}.attribute-assistant strong{display:block;font-size:9px}.attribute-assistant span{display:block;margin-top:3px;color:#8f9db1}.attribute-assistant.ok{border-color:rgba(74,222,128,.28)}.attribute-assistant.ok strong{color:#86efac}.attribute-assistant.info{border-color:rgba(125,211,252,.28)}.attribute-assistant.info strong{color:#bae6fd}.attribute-assistant.warn{border-color:rgba(251,191,36,.3)}.attribute-assistant.warn strong{color:#fde68a}.attribute-assistant.bad{border-color:rgba(251,113,133,.35)}.attribute-assistant.bad strong{color:#fecdd3}.attribute-assistant.external{border-color:rgba(251,191,36,.34);background:rgba(120,83,8,.08)}.attribute-assistant.external strong{color:#fde68a}.attribute-assistant.external span{color:#c6b77b}.attribute-assistant.informational{border-color:rgba(96,165,250,.34);background:rgba(30,64,175,.08)}.attribute-assistant.informational strong{color:#bfdbfe}.attribute-assistant.informational span{color:#9fb8d8}
    .attr-row.attribute-invalid input{border-color:#7f1d1d!important}.attr-row.attribute-unrecognized input:first-child{border-color:#76591c!important}.attr-row.attribute-external input:first-child{border-color:#76591c!important}.attr-row.attribute-informational input:first-child{border-color:#315a8b!important}
    .attribute-audit-after-save{padding:13px 14px;border:1px solid #7f1d1d;border-radius:12px;background:rgba(127,29,29,.13);color:#fecdd3;font-size:10px;line-height:1.55}.attribute-audit-after-save strong{display:block;color:#fff;font-size:12px}.attribute-audit-after-save a{display:inline-flex;margin-top:9px;color:#fff}.attribute-audit-after-save.setup,.attribute-audit-after-save.external{border-color:#76591c;background:rgba(120,83,8,.12);color:#fde68a}
  `;
  document.head.appendChild(style);
}

function ensureGuide() {
  if (!rarityHost || document.getElementById('attribute-assistant-guide')) return;
  const guide = document.createElement('div');
  guide.id = 'attribute-assistant-guide';
  guide.className = 'attribute-assistant-guide';
  guide.innerHTML = `
    <strong>Validação automática dos atributos</strong>
    <span>O sistema separa quatro situações: calculável, aguardando dado oficial, efeito informativo e correção necessária. Classificações decididas na Auditoria são reaproveitadas aqui e nenhum valor-base oculto é estimado.</span>
    <div class="attribute-assistant-summary">
      <span class="attribute-assistant-pill ok" id="attribute-ok-count">0 reconhecidos</span>
      <span class="attribute-assistant-pill external" id="attribute-external-count">0 aguardando dados oficiais</span>
      <span class="attribute-assistant-pill informational" id="attribute-informational-count">0 informativos</span>
      <span class="attribute-assistant-pill warn" id="attribute-review-count">0 para revisar</span>
      <span class="attribute-assistant-pill bad" id="attribute-invalid-count">0 valores inválidos</span>
    </div>`;
  rarityHost.parentElement?.insertBefore(guide, rarityHost);
}

function rowInputs(row) {
  const inputs = row.querySelectorAll('input');
  return { label: inputs[0] || null, value: inputs[1] || null };
}

function ensureAssistant(row) {
  let node = row.querySelector('.attribute-assistant');
  if (!node) {
    node = document.createElement('div');
    node.className = 'attribute-assistant';
    row.appendChild(node);
  }
  return node;
}

function analyzeRow(row) {
  const { label, value } = rowInputs(row);
  const assistant = ensureAssistant(row);
  const rawKey = String(label?.value || '').trim();
  const rawValue = String(value?.value || '').trim();

  row.classList.remove('attribute-invalid', 'attribute-unrecognized', 'attribute-external', 'attribute-informational');
  row.dataset.attributeState = 'empty';

  if (!rawKey) {
    assistant.className = 'attribute-assistant';
    assistant.innerHTML = '<strong>Digite o nome do atributo.</strong><span>A validação aparecerá aqui antes de você salvar.</span>';
    refreshSummary();
    return;
  }

  const persisted = persistedFor(rawKey);
  if (persisted?.classification === 'informational') {
    row.dataset.attributeState = 'informational';
    row.classList.add('attribute-informational');
    assistant.className = 'attribute-assistant informational';
    assistant.innerHTML = `
      <strong>🔵 Efeito informativo — sem cálculo.</strong>
      <span><b>${escapeHtml(persisted.label)}</b> é uma mecânica real preservada para exibição, mas não representa um atributo matemático da build. O valor pode ser textual ou numérico e não será enviado ao motor.</span>
      <span>${escapeHtml(persisted.publicNote || persisted.reason || 'Classificação registrada pela equipe na Auditoria.')}</span>`;
    refreshSummary();
    return;
  }

  if (rawValue && numberFrom(rawValue) === null) {
    row.dataset.attributeState = 'invalid';
    row.classList.add('attribute-invalid');
    assistant.className = 'attribute-assistant bad';
    assistant.innerHTML = `<strong>Valor inválido para cálculo.</strong><span>“${escapeHtml(rawValue)}” não é um número. Se o equipamento for salvo assim, ele será registrado normalmente e esta pendência ficará destacada na Auditoria até ser corrigida ou classificada corretamente.</span>`;
    refreshSummary();
    return;
  }

  const externalEffect = resolveAnyExternal(rawKey);
  if (externalEffect) {
    row.dataset.attributeState = 'external';
    row.classList.add('attribute-external');
    assistant.className = 'attribute-assistant external';
    assistant.innerHTML = `
      <strong>🟡 Aguardando dado oficial — não é erro de cadastro.</strong>
      <span><b>${escapeHtml(externalEffect.label)}</b> é um efeito conhecido do equipamento, mas o jogo não disponibiliza publicamente a base necessária para um resultado final confiável. O valor será preservado e exibido, porém ficará fora do cálculo.</span>
      <span><b>O que falta:</b> ${escapeHtml(externalEffect.missingData || 'Valor-base oficial e regra exata de aplicação.')}${externalEffect.persisted ? ' Esta classificação foi registrada pela Auditoria.' : ''}</span>`;
    refreshSummary();
    return;
  }

  const rule = resolveEquipmentRule(rawKey);
  if (!rule.recognized) {
    row.dataset.attributeState = 'unknown';
    row.classList.add('attribute-unrecognized');
    assistant.className = 'attribute-assistant warn';
    assistant.innerHTML = `
      <strong>Esta regra ainda precisa de classificação.</strong>
      <span>Confirme se “${escapeHtml(humanizeAttributeKey(rawKey))}” é outra escrita de uma regra existente, uma mecânica nova calculável, um efeito informativo ou um efeito real cuja base ainda não é pública. Se salvar, o equipamento será cadastrado e esta pendência ficará na Auditoria aguardando uma decisão.</span>`;
    refreshSummary();
    return;
  }

  const operation = rule.operation === 'percent' ? 'percentual sequencial' : 'soma direta';
  const approximate = /aproximada/i.test(rule.source || '');
  row.dataset.attributeState = approximate ? 'approximate' : 'ok';
  assistant.className = `attribute-assistant ${approximate ? 'info' : 'ok'}`;
  assistant.innerHTML = `
    <strong>${approximate ? 'Correspondência automática encontrada.' : 'Regra reconhecida.'}</strong>
    <span>Será aplicado em <b>${escapeHtml(targetLabel(rule.target))}</b> usando <b>${escapeHtml(operation)}</b>.${approximate ? ' A escrita é diferente do nome oficial; revise apenas se o significado não for este.' : ''}</span>`;
  refreshSummary();
}

let summaryFrame = 0;
function refreshSummary() {
  cancelAnimationFrame(summaryFrame);
  summaryFrame = requestAnimationFrame(() => {
    const rows = [...document.querySelectorAll('#rarities .attr-row')];
    const ok = rows.filter(row => ['ok', 'approximate'].includes(row.dataset.attributeState)).length;
    const external = rows.filter(row => row.dataset.attributeState === 'external').length;
    const informational = rows.filter(row => row.dataset.attributeState === 'informational').length;
    const review = rows.filter(row => row.dataset.attributeState === 'unknown').length;
    const invalid = rows.filter(row => row.dataset.attributeState === 'invalid').length;
    const okNode = document.getElementById('attribute-ok-count');
    const externalNode = document.getElementById('attribute-external-count');
    const informationalNode = document.getElementById('attribute-informational-count');
    const reviewNode = document.getElementById('attribute-review-count');
    const invalidNode = document.getElementById('attribute-invalid-count');
    if (okNode) okNode.textContent = `${ok} reconhecido${ok === 1 ? '' : 's'}`;
    if (externalNode) externalNode.textContent = external === 1 ? '1 aguardando dado oficial' : `${external} aguardando dados oficiais`;
    if (informationalNode) informationalNode.textContent = `${informational} informativo${informational === 1 ? '' : 's'}`;
    if (reviewNode) reviewNode.textContent = `${review} para revisar`;
    if (invalidNode) invalidNode.textContent = `${invalid} valor${invalid === 1 ? '' : 'es'} inválido${invalid === 1 ? '' : 's'}`;
  });
}

function bindRow(row) {
  if (row.dataset.attributeAssistantBound === '1') return false;
  row.dataset.attributeAssistantBound = '1';
  const { label, value } = rowInputs(row);
  const update = () => analyzeRow(row);
  label?.addEventListener('input', update);
  label?.addEventListener('change', update);
  value?.addEventListener('input', update);
  value?.addEventListener('change', update);
  analyzeRow(row);
  return true;
}

function scanRows({ reanalyze = false } = {}) {
  document.querySelectorAll('#rarities .attr-row').forEach(row => {
    const newlyBound = bindRow(row);
    if (reanalyze && !newlyBound) analyzeRow(row);
  });
  refreshSummary();
}

function rowsInside(node) {
  if (node?.nodeType !== Node.ELEMENT_NODE) return [];
  if (node.matches('.attr-row')) return [node];
  return [...node.querySelectorAll('.attr-row')];
}

function handleRarityMutations(records) {
  let summaryChanged = false;

  for (const record of records) {
    for (const node of record.addedNodes) {
      for (const row of rowsInside(node)) {
        summaryChanged = bindRow(row) || summaryChanged;
      }
    }

    for (const node of record.removedNodes) {
      if (rowsInside(node).length) summaryChanged = true;
    }
  }

  if (summaryChanged) refreshSummary();
}

function focusProblem(row) {
  if (!row) return;
  document.querySelector('[data-tab="rarities"]')?.click();
  window.setTimeout(() => {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.querySelector('input')?.focus({ preventScroll: true });
  }, 80);
}

async function guardSubmit(event) {
  if (allowNextSubmit) {
    allowNextSubmit = false;
    return;
  }

  scanRows({ reanalyze: true });

  const invalidRows = [...document.querySelectorAll('#rarities .attr-row[data-attribute-state="invalid"]')]
    .filter(row => String(row.querySelector('input')?.value || '').trim());
  const unknownRows = [...document.querySelectorAll('#rarities .attr-row[data-attribute-state="unknown"]')]
    .filter(row => String(row.querySelector('input')?.value || '').trim());

  if (!invalidRows.length && !unknownRows.length) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const parts = [];
  if (unknownRows.length) parts.push(`${unknownRows.length} atributo(s) sem classificação segura`);
  if (invalidRows.length) parts.push(`${invalidRows.length} atributo(s) com valor inválido`);

  const confirmed = await showAdminDecisionModal({
    kicker: 'PENDÊNCIAS ENCONTRADAS',
    title: 'Salvar e enviar para a Auditoria?',
    message: `${parts.join(' e ')}. O equipamento pode ser cadastrado mesmo assim.`,
    detail: 'Somente pendências que exigem decisão da equipe entram nesta contagem. “Aguardando dado oficial” e “Efeito informativo” não são erros do cadastro.',
    confirmLabel: 'Salvar e registrar pendências',
    cancelLabel: 'Voltar e corrigir agora'
  });

  if (!confirmed) {
    focusProblem(invalidRows[0] || unknownRows[0]);
    return;
  }

  allowNextSubmit = true;
  form?.requestSubmit();
}

function showAuditAfterSave(detail = {}) {
  document.getElementById('attribute-audit-after-save')?.remove();
  const issues = Array.isArray(detail.issues) ? detail.issues : [];
  if (detail.installed && !issues.length) return;

  const corrections = issues.filter(issue => issue.issue_type !== 'external_data_required');
  const external = issues.filter(issue => issue.issue_type === 'external_data_required');
  const node = document.createElement('div');
  node.id = 'attribute-audit-after-save';
  node.className = `attribute-audit-after-save${detail.installed ? (corrections.length ? '' : ' external') : ' setup'}`;

  if (!detail.installed) {
    node.innerHTML = '<strong>Equipamento salvo, mas a fila persistente da Auditoria ainda não está ativa no banco.</strong><span>A auditoria dinâmica continua disponível, porém o destaque entre sessões depende da tabela <code>equipment_audit_queue</code>.</span>';
  } else if (corrections.length) {
    node.innerHTML = `<strong>Equipamento salvo com ${corrections.length} correção(ões) necessária(s).</strong><span>O cadastro foi preservado e estas pendências já foram registradas na Auditoria.${external.length ? ` Há também ${external.length} efeito(s) aguardando dados oficiais, separados dos erros.` : ''}</span><a class="admin-button" href="./equipment-audit.html">Abrir Auditoria agora</a>`;
  } else {
    node.innerHTML = `<strong>Equipamento salvo sem erro de cadastro.</strong><span>${external.length} efeito(s) foi(ram) registrado(s) como “Aguardando dados oficiais”. Eles permanecem visíveis, mas não entram no cálculo enquanto o jogo não fornecer uma base pública confiável.</span><a class="admin-button" href="./equipment-audit.html">Ver na Auditoria</a>`;
  }

  form?.prepend(node);
  node.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

ensureStyles();
ensureGuide();
scanRows();

if (rarityHost) {
  // Observa somente a entrada/saída de linhas. A análise escreve o conteúdo do
  // assistente dentro da própria raridade; reanalisar qualquer mutação daqui
  // criaria um ciclo infinito e bloquearia o submit e a thread principal.
  new MutationObserver(handleRarityMutations).observe(rarityHost, {
    childList: true,
    subtree: true
  });
}

form?.addEventListener('submit', guardSubmit, true);
window.addEventListener('equipment:audit-sync', event => showAuditAfterSave(event.detail));
