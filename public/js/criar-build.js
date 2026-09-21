import { supabase } from './supabase.js?v=20260823-security-supabase-pin-1&pgv=82901afbc8df';
import { resolveMediaUrl } from './media-storage.js?v=20260823-security-supabase-pin-1&pgv=82901afbc8df';
import { syncPublicNavigation } from './public-navigation.js?v=20260822-drawer-unified-1&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df';
import {
  RARIDADES, esc, cssSafe, numSafe, srcSafe, isVid,
  mStyle, mInner, normalizar, rc, rn,
  nivelAtual, nomeDoNivel, corDoItem, pintar
} from './ui-core.js?pgv=82901afbc8df';
import {
  carregarDadosAnalise,
  prepararAnalisePublicaV4,
  analisarBuildComAutoridadeV4,
  renderAnalise
} from './build-analise.js?v=16&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df';

syncPublicNavigation('builds');

/* ============================================================
   CRIAR BUILD — lógica da página
   Mídia aceita .png .jpg .gif (transparente) .mp4 .webm
   media: { src, fit, pos, scale, x, y }
   ============================================================ */

const MEDIA_BUCKET = 'game-media';

/* Slots de reserva — só aparecem se equipment_slots vier vazio.
   Segue a ordem oficial do anel: ímpares à esquerda, pares à direita. */
const SLOTS_PADRAO = [
  { key: 'cabeca',    label: 'Cabeça' },
  { key: 'peito',     label: 'Peito' },
  { key: 'mao',       label: 'Mão' },
  { key: 'pe',        label: 'Pé' },
  { key: 'acessorio', label: 'Acessório' },
  { key: 'gadget',    label: 'Gadget' }
];

let CONFIG = {
  usuario: { nome: 'SlayerX', nivel: 42, media: { src: '', fit: 'cover' } },
  heroi:   { id: '', nome: '—', classe: '', tableMedia: { src: '', fit: 'contain' }, buildCardMedia: { src: '', fit: 'cover' } },
  slots:   SLOTS_PADRAO.map((s, i, a) => ({ ...s, ...posicaoAnel(i, a.length) })),
  equipados: {},
  analise: null,
  herois: [],
  catalogo: [],
  tiers: new Map(),
  tags: new Set(['Longo alcance', 'Controle']),

  /* Fonte única dos números: build-analise.js calcula a partir de
     hero_base_stats + stats do nível de cada equipamento. */
  dados: { baseHerois: new Map(), textos: new Map(), statsBonus: new Map() },
  macros: [],
  bonus: [],
  resumo: { tagA: '—', tagB: '—', texto: 'Escolha um herói e monte o loadout para ver o resumo.' }
};

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);

/* Posição do slot no anel: duas colunas espelhadas, barriga pra fora no meio.
   Funciona com qualquer quantidade de slots vinda do banco. */
function posicaoAnel(indice, total) {
  const esquerda = Math.ceil(total / 2);
  const naEsquerda = indice % 2 === 0;
  const ordemNaColuna = Math.floor(indice / 2);
  const qtdColuna = naEsquerda ? esquerda : total - esquerda;
  const t = qtdColuna <= 1 ? 0.5 : ordemNaColuna / (qtdColuna - 1);
  const curva = Math.sin(t * Math.PI);
  return {
    y: 12 + t * 72,
    x: naEsquerda ? 22 - 12 * curva : 78 + 12 * curva
  };
}

function getMediaUrl(path, legacyUrl = '') {
  return resolveMediaUrl(path || legacyUrl);
}

/* A Mesa de Builds possui mídias próprias no Editor de Herói.
   Nunca recua para a imagem principal ou para o card geral: isso evita
   que uma alteração editorial da página inicial contamine o criador. */
function mediaExclusivaDaBuild(hero) {
  const destaque = hero?.buildDestaque?.src
    ? { ...hero.buildDestaque }
    : hero?.buildMedia?.src
      ? { ...hero.buildMedia, fit: 'contain' }
      : hero?.destaque?.src
        ? { ...hero.destaque, fit: 'contain' }
        : hero?.media?.src
          ? { ...hero.media, fit: 'contain' }
          : { src: '', fit: 'contain', pos: '50% 50%', scale: 1, x: 0, y: 0 };

  const card = hero?.buildMedia?.src
    ? { ...hero.buildMedia }
    : destaque.src
      ? { ...destaque, fit: 'contain' }
      : { src: '', fit: 'cover', pos: '50% 50%', scale: 1, x: 0, y: 0 };

  return { destaque, card };
}

function configurarHeroiDaBuild(hero) {
  const midia = mediaExclusivaDaBuild(hero);
  return {
    id: hero.id,
    databaseId: hero.databaseId,
    classId: hero.classId || null,
    nome: String(hero.nome).toUpperCase(),
    classe: hero.classe,
    /* Contrato explícito: cada superfície consome somente a sua mídia.
       Isso impede que a imagem da mesa seja reutilizada no card superior. */
    tableMedia: midia.destaque,
    buildCardMedia: midia.card
  };
}

/* O editor administrativo atual salva os atributos como uma lista
   [{ label, value }]. Versões antigas salvavam um objeto JSON.
   A página aceita os dois formatos sem perder o texto exibido. */
function normalizeVariantStats(attributes) {
  if (Array.isArray(attributes)) {
    return Object.fromEntries(
      attributes
        .filter(attribute => String(attribute?.label || '').trim())
        .map(attribute => [
          String(attribute.label).trim(),
          attribute.value ?? ''
        ])
    );
  }

  return attributes && typeof attributes === 'object' ? attributes : {};
}

/* ============================================================
   SUPABASE — conteúdo administrável
   ============================================================ */
async function carregarConteudoSupabase() {
  const [
    heroesResult, classesResult, equipmentsResult, slotsResult,
    rarityLevelsResult, equipmentVariantsResult, equipmentRaritiesResult,
    equipmentSetsResult, setBonusesResult, tiersResult
  ] = await Promise.all([
    supabase.from('heroes').select(`
        id, name, slug, class_id, enabled, display_order,
        image_path, card_image_path, gif_path,
        image_url, card_image_url, gif_url,
        image_fit, image_position, image_scale, image_offset_x, image_offset_y,
        card_image_scale, card_image_offset_x, card_image_offset_y,
        build_image_path, build_image_scale, build_image_offset_x, build_image_offset_y,
        build_card_image_path, build_card_image_scale, build_card_image_offset_x, build_card_image_offset_y
      `)
      .eq('enabled', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true }),

    supabase.from('hero_classes').select('id,name,slug,color,icon')
      .order('name', { ascending: true }),

    supabase.from('equipments').select(`
        id, name, description, image_path, image_url, rarity,
        slot_id, set_id, hero_id, class_id, recommendation_text, enabled, display_order
      `)
      .eq('enabled', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true }),

    supabase.from('equipment_slots').select('id,name,slug,display_order')
      .order('display_order', { ascending: true }),

    supabase.from('equipment_rarity_levels')
      .select('equipment_id,rarity_slug,rarity_name,rarity_order,rarity_color,stats')
      .order('rarity_order', { ascending: true }),

    /* Estrutura atual usada pelo editor administrativo. A leitura de
       equipment_rarity_levels acima fica apenas como compatibilidade com
       dados antigos; equipment_variants é a fonte prioritária. */
    supabase.from('equipment_variants')
      .select('equipment_id,rarity_id,attributes'),

    supabase.from('equipment_rarities')
      .select('id,slug,name,color,rank')
      .order('rank', { ascending: true }),

    supabase.from('equipment_sets').select('id,name,slug,description,image_path'),

    supabase.from('equipment_set_bonuses')
      .select('id,set_id,required_pieces,title,description,display_order')
      .order('required_pieces', { ascending: true })
      .order('display_order', { ascending: true }),

    supabase.from('equipment_tiers').select('id,slug,name,color')
      .order('display_order', { ascending: true })
  ]);

  const falhas = [
    ['heróis', heroesResult], ['classes', classesResult], ['equipamentos', equipmentsResult],
    ['slots', slotsResult], ['níveis', rarityLevelsResult],
    ['variantes', equipmentVariantsResult], ['raridades', equipmentRaritiesResult],
    ['conjuntos', equipmentSetsResult], ['bônus de conjunto', setBonusesResult],
    ['tiers', tiersResult]
  ].filter(([, r]) => r.error);

  falhas.forEach(([nome, r]) => console.error(`Erro ao carregar ${nome}:`, r.error));

  const classes = new Map((classesResult.data || []).map(i => [i.id, i]));
  const sets = new Map((equipmentSetsResult.data || []).map(i => [i.id, i]));
  const slotsPorId = new Map((slotsResult.data || []).map(i => [i.id, i]));

  const rarityLevelsBySlug = new Map();
  const addRarityLevel = level => {
    if (!level?.equipment_id || !level?.rarity_slug) return;
    if (!rarityLevelsBySlug.has(level.equipment_id)) {
      rarityLevelsBySlug.set(level.equipment_id, new Map());
    }
    rarityLevelsBySlug.get(level.equipment_id).set(level.rarity_slug, level);
  };

  /* Primeiro entram os registros legados. */
  for (const level of (rarityLevelsResult.data || [])) {
    addRarityLevel(level);
  }

  /* Depois as variantes atuais sobrescrevem os níveis equivalentes. */
  const raritiesById = new Map(
    (equipmentRaritiesResult.data || []).map(rarity => [rarity.id, rarity])
  );
  for (const variant of (equipmentVariantsResult.data || [])) {
    const rarity = raritiesById.get(variant.rarity_id);
    if (!rarity) continue;
    addRarityLevel({
      equipment_id: variant.equipment_id,
      rarity_slug: rarity.slug,
      rarity_name: rarity.name,
      rarity_order: rarity.rank,
      rarity_color: rarity.color,
      stats: normalizeVariantStats(variant.attributes)
    });
  }

  const rarityLevels = new Map(
    [...rarityLevelsBySlug].map(([equipmentId, levels]) => [
      equipmentId,
      [...levels.values()].sort((a, b) =>
        numSafe(a.rarity_order, 999) - numSafe(b.rarity_order, 999)
      )
    ])
  );

  const setBonuses = new Map();
  for (const bonus of (setBonusesResult.data || [])) {
    if (!setBonuses.has(bonus.set_id)) setBonuses.set(bonus.set_id, []);
    setBonuses.get(bonus.set_id).push(bonus);
  }

  CONFIG.tiers = new Map((tiersResult.data || []).map(tier => [tier.slug, tier]));

  /* --- slots do anel vêm do banco (sem apelidos, sem colisão) --- */
  const slotsDb = (slotsResult.data || []).filter(s => s.slug);
  if (slotsDb.length) {
    CONFIG.slots = slotsDb.map((s, i) => ({
      key: s.slug,
      label: s.name || s.slug,
      slotId: s.id,
      ...posicaoAnel(i, slotsDb.length)
    }));
  }

  /* --- heróis --- */
  const heroes = (heroesResult.data || []).map(hero => {
    const heroClass = classes.get(hero.class_id);
    const offsetX = `${numSafe(hero.image_offset_x, 0)}%`;
    const offsetY = `${numSafe(hero.image_offset_y, 0)}%`;
    const cardX = `${numSafe(hero.card_image_offset_x, 0)}%`;
    const cardY = `${numSafe(hero.card_image_offset_y, 0)}%`;

    /* Imagens do frontend geral (spotlight, listas, carrossel). */
    const mainSource = getMediaUrl(
      hero.image_path || hero.card_image_path || hero.gif_path,
      hero.image_url || hero.card_image_url || hero.gif_url
    );
    const cardSource = getMediaUrl(
      hero.card_image_path || hero.image_path || hero.gif_path,
      hero.card_image_url || hero.image_url || hero.gif_url
    );

    /* Imagens exclusivas da Mesa de Sinergias — cadastradas à parte no
       admin (aba Mídia, campos "mesa de builds" e "card da build").
       Não compartilham fallback com a página principal. */
    const buildOffsetX = `${numSafe(hero.build_image_offset_x, 0)}%`;
    const buildOffsetY = `${numSafe(hero.build_image_offset_y, 0)}%`;
    const buildCardX = `${numSafe(hero.build_card_image_offset_x, 0)}%`;
    const buildCardY = `${numSafe(hero.build_card_image_offset_y, 0)}%`;

    const temImagemDeBuild = Boolean(hero.build_image_path);
    const temCardDeBuild = Boolean(hero.build_card_image_path);

    const buildMainSource = temImagemDeBuild ? getMediaUrl(hero.build_image_path) : '';
    const buildCardSource = temCardDeBuild ? getMediaUrl(hero.build_card_image_path) : '';

    return {
      id: hero.slug || hero.id,
      databaseId: hero.id,
      classId: hero.class_id || null,
      nome: hero.name,
      classe: heroClass?.name || 'Sem classe',
      cor: heroClass?.color || '#A855F7',

      /* Usadas no frontend geral: carrossel de heróis, listas. */
      media: {
        src: cardSource, fit: 'cover', pos: '50% 50%',
        scale: numSafe(hero.card_image_scale, 1), x: cardX, y: cardY
      },
      destaque: {
        src: mainSource, fit: hero.image_fit || 'contain', pos: hero.image_position || '50% 50%',
        scale: numSafe(hero.image_scale, 1), x: offsetX, y: offsetY
      },

      /* Usadas só na Mesa de Sinergias (criar-build). */
      buildMedia: {
        src: buildCardSource, fit: 'cover', pos: '50% 50%',
        scale: numSafe(hero.build_card_image_scale, 1),
        x: buildCardX,
        y: buildCardY
      },
      buildDestaque: {
        src: buildMainSource, fit: 'contain', pos: '50% 50%',
        scale: numSafe(hero.build_image_scale, 1),
        x: buildOffsetX,
        y: buildOffsetY
      }
    };
  });

  /* --- equipamentos --- */
  const equipments = (equipmentsResult.data || []).map(item => {
    const slot = slotsPorId.get(item.slot_id);
    const levels = rarityLevels.get(item.id) || [];
    const initialLevel = levels[0];
    const equipmentSet = sets.get(item.set_id) || null;

    return {
      databaseId: item.id,
      heroId: item.hero_id || null,
      classId: item.class_id || null,
      nome: item.name,
      slot: slot?.slug || null,
      slotLabel: slot?.name || '',
      raridade: initialLevel?.rarity_slug || String(item.rarity || 'comum').toLowerCase(),
      descricao: item.description || '',
      recommendation: item.recommendation_text || '',
      setId: item.set_id || null,
      set: equipmentSet ? {
        id: equipmentSet.id,
        nome: equipmentSet.name,
        slug: equipmentSet.slug,
        descricao: equipmentSet.description || '',
        bonus: setBonuses.get(equipmentSet.id) || []
      } : null,
      levels: levels.map(level => ({
        slug: level.rarity_slug,
        nome: level.rarity_name,
        ordem: level.rarity_order,
        cor: level.rarity_color || rc(level.rarity_slug),
        stats: level.stats || {}
      })),
      media: {
        src: getMediaUrl(item.image_path, item.image_url),
        fit: 'contain', pos: '50% 50%', scale: 1, x: 0, y: 0
      }
    };
  });

  if (heroes.length) {
    CONFIG.herois = heroes;
    CONFIG.heroi = configurarHeroiDaBuild(heroes[0]);
  }

  CONFIG.catalogo = equipments;
  CONFIG.equipados = {};
}

/* ---------- estado ---------- */
let heroiAtual = '';
let slotAtivo = null;
let etapa = 1;
let equipamentoSelecionado = null;
let buscaPop = '';

/* ---------- topo ---------- */
pintar($('user-av'), CONFIG.usuario.media);
$('user-nm').innerHTML = esc(CONFIG.usuario.nome) +
  `<small>Nível ${esc(CONFIG.usuario.nivel)}</small>`;

/* ---------- herói + slots ---------- */
function renderHeroi() {
  $('hero-name').textContent = CONFIG.heroi.nome;
  $('hero-role').textContent = CONFIG.heroi.classe;
  pintar($('hero-art'), CONFIG.heroi.tableMedia);
  pintar($('hero-card-art'), CONFIG.heroi.buildCardMedia);
  renderSlots();
  renderHeroBaseStats();
}

function renderHeroBaseStats() {
  const resultado = CONFIG.analise;
  const linhas = resultado?.linhas || [];
  const alvo = $('hero-base-stats');
  if (!alvo || !linhas.length) return;

  const mapa = [
    { keys: ['damage_per_shot'], icon: '⌖', label: 'DANO POR TIRO' },
    { keys: ['health', 'armor'], icon: '♢', label: 'VIDA BASE' },
    { keys: ['max_movement_speed'], icon: '♞', label: 'VELOCIDADE BASE' }
  ];

  alvo.innerHTML = mapa.map(item => {
    const linha = linhas.find(l => item.keys.includes(l.key));
    const pct = Math.max(4, Math.round(linha?.pctBase || 0));
    const valor = linha ? Math.round(linha.base).toLocaleString('pt-BR') : '—';
    return `<div><span>${item.icon} <b>${item.label}</b></span><i><u style="width:${pct}%"></u></i><em>${valor}</em></div>`;
  }).join('');
}

function renderSlots() {
  const ring = $('ring');
  ring.querySelectorAll('.slot').forEach(s => s.remove());

  const mob = $('slots-mobile');
  mob.innerHTML = '';

  const mobile = window.matchMedia('(max-width:560px)').matches;
  const mobileOrbitPositions = [
    { x: 14, y: 28 }, { x: 12, y: 50 }, { x: 15, y: 72 },
    { x: 86, y: 28 }, { x: 88, y: 50 }, { x: 85, y: 72 }
  ];

  CONFIG.slots.forEach((s, index) => {
    const it = CONFIG.equipados[s.key];
    const el = document.createElement('div');
    el.className = 'slot' + (it ? '' : ' empty') + (slotAtivo === s.key ? ' active' : '');
    el.dataset.slot = s.key;
    el.style.setProperty('--rc', corDoItem(it));

    el.innerHTML =
      `<div class="lb" title="${esc(s.label)}">${index + 1}</div>` +
      (it ? '<button class="rm" type="button" aria-label="Remover">✕</button>' : '') +
      '<div class="hex">' + (it
        ? `<div class="media ${it.media && it.media.src ? '' : 'ph'}" style="${mStyle(it.media)}">${mInner(it.media)}</div>`
        : '<span class="plus">+</span>') + '</div>' +
      (it
        ? `<div class="in"><b>${esc(it.nome)}</b><i>${esc(nomeDoNivel(it))}</i></div>`
        : '<div class="in"><b>Vazio</b></div>');

    el.onclick = e => {
      if (e.target.closest('.rm')) { limparSlot(s.key); return; }
      abrirPop(s.key);
    };

    const pos = mobile ? mobileOrbitPositions[index] : { x: s.x, y: s.y };
    el.style.position = 'absolute';
    el.style.left = pos.x + '%';
    el.style.top = pos.y + '%';
    el.style.transform = 'translate(-50%,-50%)';
    ring.appendChild(el);
  });

  atualizarContagem();
}

function atualizarContagem() {
  const n = CONFIG.slots.filter(s => CONFIG.equipados[s.key]).length;
  $('eq-count').textContent = n + '/' + CONFIG.slots.length;
}

function limparSlot(key) {
  delete CONFIG.equipados[key];
  if (equipamentoSelecionado && slotAtivo === key) equipamentoSelecionado = null;
  renderSlots();
  renderSinergia();
  renderDetalheEquipamento(CONFIG.equipados[slotAtivo] || null);
  renderBonus();
  atualizarAnalise();
  if (!$('pop').hidden) { $('pop-foot').hidden = true; renderCatalogo(); }
}

/* ---------- box flutuante de equipamentos ---------- */
function slotAtual() {
  return CONFIG.slots.find(s => s.key === slotAtivo) || null;
}

function equipamentoCompativelComHeroi(item, hero = CONFIG.heroi) {
  if (!item || !hero?.databaseId) return false;
  const pessoal = Boolean(item.heroId) && item.heroId === hero.databaseId;
  const daClasse = Boolean(item.classId) && Boolean(hero.classId) && item.classId === hero.classId;
  const generico = !item.heroId && !item.classId;
  return pessoal || daClasse || generico;
}

function removerEquipamentosIncompativeis() {
  let removidos = 0;
  for (const [slot, item] of Object.entries(CONFIG.equipados)) {
    if (equipamentoCompativelComHeroi(item)) continue;
    delete CONFIG.equipados[slot];
    removidos += 1;
  }
  return removidos;
}

function abrirPop(key) {
  slotAtivo = key;
  buscaPop = '';
  $('pop-search').value = '';

  $('pop-foot').hidden = !CONFIG.equipados[key];

  $('pop').hidden = false;
  $('pop-back').hidden = false;

  renderSlots();
  renderCatalogo();
  renderDetalheEquipamento(CONFIG.equipados[key] || null);
  posicionarPop();
  progresso(2);
}

function fecharPop() {
  $('pop').hidden = true;
  $('pop-back').hidden = true;
  renderSlots();
}

function posicionarPop() {
  const pop = $('pop');
  if (!pop || pop.hidden) return;

  if (window.matchMedia('(max-width: 700px)').matches) {
    pop.style.left = '50%';
    pop.style.top = '50%';
    pop.style.right = 'auto';
    pop.style.bottom = 'auto';
    pop.style.transform = 'translate(-50%, -50%)';
    return;
  }

  const slot = document.querySelector(`.slot[data-key="${slotAtivo}"]`);
  if (!slot) return;

  const r = slot.getBoundingClientRect();
  const gap = 14;
  const pw = Math.min(620, window.innerWidth - 28);
  let left = r.right + gap;
  if (left + pw > window.innerWidth - 14) left = Math.max(14, r.left - pw - gap);

  const top = Math.max(14, Math.min(r.top - 40, window.innerHeight - Math.min(720, window.innerHeight - 28)));
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
  pop.style.right = 'auto';
  pop.style.bottom = 'auto';
  pop.style.transform = 'none';
}

function itensDoSlot() {
  const termo = normalizar(buscaPop).trim();
  return CONFIG.catalogo.filter(i => {
    const doSlot = !slotAtivo || i.slot === slotAtivo;
    const compativel = equipamentoCompativelComHeroi(i);
    const bate = !termo ||
      normalizar(i.nome).includes(termo) ||
      normalizar(i.set?.nome).includes(termo);
    return doSlot && compativel && bate;
  });
}

function renderCatalogo() {
  const base = CONFIG.catalogo.filter(i =>
    (!slotAtivo || i.slot === slotAtivo) && equipamentoCompativelComHeroi(i)
  );
  $('pop-search-wrap').hidden = base.length <= 8;
  $('pop-strip-head-count').textContent =
    'Seus equipamentos para ' + (slotAtual()?.label || 'equipamento') + ' (' + base.length + ')';

  const lista = itensDoSlot();
  const alvo = $('ilist');
  const equipado = slotAtivo ? CONFIG.equipados[slotAtivo] : null;

  if (!lista.length) {
    alvo.innerHTML = `<div class="message">${base.length
      ? 'Nenhum equipamento com esse nome.'
      : 'Nenhum equipamento cadastrado para este slot.'}</div>`;
    return;
  }

  alvo.innerHTML = lista.map((i, idx) => {
    const sel = equipado && equipado.databaseId === i.databaseId;
    return `
      <button class="pick-tile ${sel ? 'sel' : ''}" type="button" data-i="${idx}" style="--rc:${esc(corDoItem(i))}" title="${esc(i.nome)}">
        <span class="pick-tile-icon media ${i.media && i.media.src ? '' : 'ph'}" style="${mStyle(i.media)}">${mInner(i.media)}${sel ? '<span class="ok">\u2713</span>' : ''}</span>
        <b>${esc(i.nome)}</b>
      </button>`;
  }).join('');

  alvo.onclick = e => {
    const el = e.target.closest('.pick-tile');
    if (!el) return;
    equipar(lista[+el.dataset.i]);
  };
}

function equipar(item) {
  if (!item) return;
  const destino = slotAtivo || item.slot || CONFIG.slots[0]?.key;
  if (!destino) return;

  CONFIG.equipados[destino] = {
    databaseId: item.databaseId,
    nome: item.nome,
    raridade: item.raridade,
    media: item.media,
    setId: item.setId,
    set: item.set,
    levels: item.levels,
    descricao: item.descricao,
    recommendation: item.recommendation,
    slot: item.slot,
    slotLabel: item.slotLabel
  };

  slotAtivo = destino;
  $('pop-foot').hidden = false;
  renderSlots();
  renderCatalogo();
  renderDetalheEquipamento(CONFIG.equipados[destino]);
  renderSinergia();
  renderBonus();
  atualizarAnalise();
  progresso(2);
}

/* ---------- detalhe do equipamento ----------
   As chaves de `stats` no banco são frases livres em português,
   digitadas sem acento (ex.: "alcance de visao do heroi").
   O texto do card sai em duas etapas:
     formatStatDesc  -> frase completa, acentuada  (descrição)
     formatStatLabel -> frase sem os complementos  (rótulo)
   `ATRIBUTOS_MANUAIS` tem prioridade: para fixar um texto,
   acrescente a chave normalizada (minúscula, sem acento,
   espaços no lugar de underscores). */
const ATRIBUTOS_MANUAIS = {
  'alcance de visao do heroi': {
    rotulo: 'Alcance de visão',
    desc: 'Alcance de visão do herói'
  },
  'dano da arma a armadura do inimigo percentual': {
    rotulo: 'Dano contra armadura',
    desc: 'Dano da arma à armadura do inimigo percentual'
  },
  'dano da arma a vida do inimigo percentual': {
    rotulo: 'Dano contra vida',
    desc: 'Dano da arma à vida do inimigo percentual'
  }
};

/* palavras que perdem o acento no cadastro */
const ACENTOS = {
  visao: 'visão', heroi: 'herói', municao: 'munição', municoes: 'munições',
  precisao: 'precisão', critico: 'crítico', criticos: 'críticos',
  area: 'área', explosao: 'explosão', reducao: 'redução', duracao: 'duração',
  protecao: 'proteção', resistencia: 'resistência', distancia: 'distância',
  regeneracao: 'regeneração', penetracao: 'penetração', cadencia: 'cadência',
  aceleracao: 'aceleração', recuperacao: 'recuperação',
  magica: 'mágica', fisica: 'física', maxima: 'máxima', minima: 'mínima',
  nivel: 'nível', bonus: 'bônus', primaria: 'primária', secundaria: 'secundária'
};

function chaveNormalizada(key) {
  return String(key || '')
    .replaceAll('_', ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/* frase completa, acentuada e com inicial maiúscula */
function formatStatDesc(key) {
  const base = chaveNormalizada(key);
  const manual = ATRIBUTOS_MANUAIS[base];
  if (manual) return manual.desc;
  if (!base) return '';

  const texto = base
    .split(' ')
    .map(palavra => ACENTOS[palavra] || palavra)
    .join(' ')
    .replace(/\barma a armadura\b/, 'arma à armadura')
    .replace(/\barma a vida\b/, 'arma à vida');

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* mesma frase sem os complementos — é o rótulo curto do card */
function formatStatLabel(key) {
  const base = chaveNormalizada(key);
  const manual = ATRIBUTOS_MANUAIS[base];
  if (manual) return manual.rotulo;

  let texto = formatStatDesc(key)
    .replace(/\s+percentual$/i, '')
    .replace(/\s+do (herói|inimigo)$/i, '')
    .replace(/\s+do (herói|inimigo)$/i, '')
    .replace(/\s+com mira$/i, '')
    .replace(/^dano da arma à\s+/i, 'Dano contra ');

  texto = texto.trim();
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : formatStatDesc(key);
}


function formatStatValue(key, value) {
  const sinal = Number(value) >= 0 ? '+' : '';
  return key.endsWith('_pct') ? `${sinal}${value}%` : `${sinal}${value}`;
}

function quantidadeDoConjunto(setId) {
  if (!setId) return 0;
  return Object.values(CONFIG.equipados).filter(item => item?.setId === setId).length;
}

/* Ícone do atributo: escudo para defesa/dano, alvo para o resto. */
function iconeDoAtributo(label) {
  const t = normalizar(label || '');
  return /armadura|dano|defesa|resist/.test(t) ? '\u25C8' : '\u25CE';
}

function renderDetalheEquipamento(item = equipamentoSelecionado) {
  const detail = $('equipment-detail');
  const floating = $('equipment-float');

  if (!item) {
    equipamentoSelecionado = null;
    detail.className = 'detail pop-detail empty';
    detail.innerHTML = `
      <div class="d-top">
        <div class="d-slot"><span class="slot-check">✓</span><span>${esc((slotAtual()?.label || '').toUpperCase())}</span></div>
      </div>
      <p class="empty-message">Toque num item acima para conferir níveis, atributos e bônus do conjunto.</p>`;
    if (floating) floating.innerHTML = '<span class="equipment-float-icon">◇</span><div><strong>SELECIONE UM EQUIPAMENTO</strong><small>Os bônus aparecem aqui</small></div>';
    return;
  }

  equipamentoSelecionado = item;

  const level = nivelAtual(item);
  const stats = level?.stats || {};
  const pieces = quantidadeDoConjunto(item.setId);
  const bonuses = item.set?.bonus || [];
  const maxPieces = Math.max(CONFIG.slots.length, ...bonuses.map(b => b.required_pieces || 0)) || 1;
  const cor = corDoItem(item);
  const slotDoItem = CONFIG.slots.find(s => CONFIG.equipados[s.key]?.databaseId === item.databaseId);
  const indiceSlot = CONFIG.slots.findIndex(s => s.key === slotAtivo);
  /* o marco de 1 peça só diz "Equipada" — não é bônus, não vira card.
     Some apenas quando não traz efeito nenhum; se um dia existir bônus
     real de 1 peça (com valor), ele continua aparecendo. */
  const temEfeito = b => /[+-]\s?\d/.test(String(b.description || ''));
  const marcos = bonuses.filter(b => Number(b.required_pieces) > 1 || temEfeito(b));

  /* --------- marcos do conjunto: cada card mostra só o que é NOVO ---------
     As descrições no banco são cumulativas: o marco de 6 repete tudo o que
     já estava em 2 e em 4. Aqui o card mostra a corrente das faixas herdadas
     e, abaixo, apenas as frases inéditas daquela faixa. O valor de cada
     efeito sai em verde; o texto fica normal.
     Cor e peso vão inline de propósito — esta mudança não toca no CSS. */
  const VERDE = '#35d07f';   /* valores dos efeitos    */
  const AMBAR = '#f0b64a';   /* corrente de bônus herdados */

  const emFrases = texto => (String(texto || '').match(/[^.]+\.?/g) || [])
    .map(t => t.trim())
    .filter(Boolean);

  /* "-15% ao tempo de abrir caixa." -> (-15%) verde + resto normal */
  const pintaValor = frase => {
    const m = frase.match(/^([+-]\s?\d+(?:[.,]\d+)?%?)(\s+[\s\S]*)$/);
    if (!m) return `<span style="font-size:1.06em">${esc(frase)}</span>`;
    return `<span style="color:${VERDE};font-weight:800;font-size:1.12em">${esc(m[1])}</span>`
         + `<span style="font-size:1.06em">${esc(m[2])}</span>`;
  };

  const rotuloPecas = n => `${n} ${Number(n) === 1 ? 'pe\u00e7a' : 'pe\u00e7as'}`;

  /* frases de cada marco, na ordem, para saber de quem veio o que foi herdado */
  const frasesPorMarco = marcos.map(b => emFrases(b.description).map(normalizar));
  const jaMostradas = new Set();

  const textoDoMarco = (b, indice) => {
    const frases = emFrases(b.description);
    const ineditas = frases.filter(f => !jaMostradas.has(normalizar(f)));
    const herdadas = frases.filter(f => jaMostradas.has(normalizar(f))).map(normalizar);
    frases.forEach(f => jaMostradas.add(normalizar(f)));

    /* corrente: só as faixas anteriores que realmente contribuíram */
    const corrente = marcos
      .slice(0, indice)
      .filter((x, i) => frasesPorMarco[i].some(f => herdadas.includes(f)))
      .map(x => `+ b\u00f4nus de ${rotuloPecas(x.required_pieces)}`)
      .join('<br>');

    const linhas = (ineditas.length ? ineditas : frases)
      .map(f => `<div>${pintaValor(f)}</div>`)
      .join('');

    const cabeca = corrente
      ? `<div style="color:${AMBAR};font-weight:700;margin-bottom:.4em">${corrente}</div>`
      : '';

    return cabeca + linhas;
  };


  if (floating) {
    const deltas = Object.entries(stats).slice(0, 3).map(([key, value]) => {
      const n = Number(value) || 0;
      const classe = n >= 0 ? 'up' : 'down';
      return `<span class="${classe}">${n >= 0 ? '↑ +' : '↓ '}${esc(String(value))}${key.endsWith('_pct') ? '%' : ''} <i>${esc(formatStatLabel(key))}</i></span>`;
    }).join('');
    floating.innerHTML = `<span class="equipment-float-icon">◇</span><div><strong>${esc(item.nome)}</strong><small>${esc(slotDoItem?.label || item.slotLabel || 'Equipamento')}</small><div class="delta-list">${deltas || '<span class="up">✓ Equipado na mesa</span>'}</div></div>`;
  }

  detail.className = 'detail pop-detail has-item';
  detail.innerHTML = `
    <div class="d-top">
      <div class="d-slot">
        <span class="slot-check">✓</span>
        <span>${esc((slotAtual()?.label || item.slotLabel || '').toUpperCase())} · ${indiceSlot > -1 ? indiceSlot + 1 : 1}/${CONFIG.slots.length}</span>
      </div>
    </div>

    <div class="d-hero">
      <div class="hex-wrap" style="--rarity-color:${esc(cor)}">
        <span class="hex hex-out"></span>
        <span class="hex hex-in"></span>
        <span class="hex-ico media ${item.media?.src ? '' : 'ph'}" style="${mStyle(item.media)}">${mInner(item.media)}</span>
        ${slotDoItem ? '<span class="hex-badge">✓</span>' : ''}
      </div>
      <div class="d-info">
        <h2 class="d-name">${esc(item.nome)}</h2>
        <p class="d-set">${esc(item.set?.nome || 'Equipamento individual')}</p>
        <div class="d-status">
          <span class="d-rar" style="--rc:${esc(cor)}"><span class="dot"></span>${esc(nomeDoNivel(item))}</span>
          ${slotDoItem ? '<span class="d-eq"><span class="eq-check">✓</span>Equipado</span>' : ''}
        </div>
      </div>
    </div>

    <hr class="d-line">

    <div class="sec-head">
      <h3 class="sec-title">Classificação</h3>
      <span class="i-btn">i</span>
    </div>
    <div class="rar-row rarity-picker-v2" role="tablist" aria-label="Classificação">
      ${(item.levels || []).map(l => `<button class="rar-pill rarity-pill ${l.slug === item.raridade ? 'is-on on' : ''}" type="button" data-rarity="${esc(l.slug)}" style="--rc:${esc(l.cor)};color:${esc(l.cor)}"><span>${esc(l.nome)}</span></button>`).join('')}
    </div>

    <hr class="d-line">

    <div class="sec-head">
      <h3 class="sec-title">Atributos <span class="sep">·</span> <span class="sub">${esc(level?.nome || '')}</span></h3>
    </div>
    <div class="stats">
      ${Object.entries(stats).map(([key, value]) => `
        <div class="stat">
          <div class="stat-top">
            <span class="stat-ico">${iconeDoAtributo(formatStatDesc(key))}</span>
            <span class="stat-label">${esc(formatStatLabel(key))}</span>
            <span class="i-btn">i</span>
          </div>
          <div class="stat-val" style="color:#35d07f;display:flex;align-items:center;gap:.2em"><span style="width:.6em;height:.6em;flex:0 0 auto;display:inline-block"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6"/><path d="M5.5 12.5L12 6l6.5 6.5"/></svg></span>${esc(formatStatValue(key, value))}</div>
          <div class="stat-desc">${esc(formatStatDesc(key))}</div>
        </div>`).join('') || '<div class="message">Sem atributos cadastrados.</div>'}
    </div>

    ${item.set ? `
      <hr class="d-line">
      <div class="set-head">
        <h3 class="sec-title">${esc(item.set.nome)}</h3>
        <span class="set-count">${pieces}/${maxPieces} peças</span>
      </div>
      <div class="bar"><span class="bar-fill" style="width:${Math.min(100, (pieces / maxPieces) * 100)}%"></span></div>
      <div class="miles">
        ${marcos.map((b, indiceMarco) => {
          const liberado = pieces >= b.required_pieces;
          return `<div class="mile ${liberado ? 'unlocked' : 'locked'}">
            <div class="mile-ico ${liberado ? 'ok' : 'lock'}">${liberado ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.3 10.5V8a3.7 3.7 0 0 1 7.4 0v2.5"/></svg>'}</div>
            <div class="mile-qtd">${esc(b.required_pieces)} ${b.required_pieces === 1 ? 'peça' : 'peças'}</div>
            <div class="mile-desc">${textoDoMarco(b, indiceMarco)}</div>
          </div>`;
        }).join('')}
      </div>` : ''}

    ${item.recommendation ? `<div class="recommendation mock-recommendation"><b>Indicação</b>${esc(item.recommendation)}</div>` : ''}
  `;

  detail.querySelectorAll('[data-rarity]').forEach(button => {
    button.onclick = () => {
      item.raridade = button.dataset.rarity;

      const equipado = Object.values(CONFIG.equipados).find(eq => eq?.databaseId === item.databaseId);
      if (equipado) equipado.raridade = item.raridade;

      const noCatalogo = CONFIG.catalogo.find(c => c.databaseId === item.databaseId);
      if (noCatalogo) noCatalogo.raridade = item.raridade;

      renderDetalheEquipamento(item);
      renderSlots();
      renderSinergia();
      renderBonus();
      atualizarAnalise();
      if (!$('pop').hidden) renderCatalogo();
    };
  });
}

/* ---------- carrossel de heróis ---------- */
function renderHerois() {
  const tk = $('track');

  tk.innerHTML = CONFIG.herois.map(h => {
    const pickerMedia = mediaExclusivaDaBuild(h).card;
    return `
    <div class="hcard ${h.id === heroiAtual ? 'on' : ''}" data-id="${esc(h.id)}">
      <div class="im">
        <div class="media ${pickerMedia?.src ? '' : 'ph'}" style="${mStyle(pickerMedia)}">${mInner(pickerMedia)}</div>
        <div class="fd"></div>
      </div>
      <div class="cp"><b>${esc(h.nome)}</b><i style="color:${esc(h.cor)}">${esc(h.classe)}</i></div>
    </div>`;
  }).join('');

  tk.onclick = e => {
    const c = e.target.closest('.hcard');
    if (!c) return;

    heroiAtual = c.dataset.id;
    const h = CONFIG.herois.find(x => x.id === heroiAtual);

    if (h) {
      CONFIG.heroi = configurarHeroiDaBuild(h);
      const removidos = removerEquipamentosIncompativeis();

      renderHeroi();
      CONFIG.resumo.tagA = h.classe;
      renderBonus();
      atualizarAnalise();
      if (!$('b-name').value.trim()) $('b-name').value = `${h.nome} — Build tática`;
      $('c-name').textContent = $('b-name').value.length;
      fecharSeletorHeroi();
      toast(
        removidos
          ? `${h.nome} selecionado. ${removidos} equipamento(s) incompatível(is) foram removidos.`
          : `${h.nome} selecionado.`,
        'success'
      );
    }

    tk.querySelectorAll('.hcard').forEach(x => x.classList.toggle('on', x === c));
    progresso(2);
  };

  const n = Math.max(1, Math.ceil(CONFIG.herois.length / 5));
  $('dots').innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
}

/* ---------- stats / sinergia / bônus ---------- */
function renderStats() {
  const alvo = $('stats');
  if (!alvo) return;

  alvo.innerHTML = CONFIG.macros.map(s => `
    <div class="stat">
      <div class="h">
        <span class="ic">${esc(s.icone)}</span>
        <span class="nm">${esc(s.nome)}</span>
        <span class="v">${s.valor.toLocaleString('pt-BR')}</span>
        <span class="d">${s.delta >= 0 ? '+' : ''}${s.delta}%</span>
      </div>
      <div class="tr"><i style="width:${s.pct.toFixed(1)}%;background:${esc(s.cor)};box-shadow:0 0 8px ${esc(s.cor)}66"></i></div>
    </div>`).join('');
}

const IMPACT_ICON_PATHS = {
  dano: '<circle cx="12" cy="12" r="2.4"/><path d="M12 3.4v3.3M12 17.3V20.6M3.4 12h3.3M17.3 12h3.3M6.2 6.2l2.3 2.3M15.5 15.5l2.3 2.3M17.8 6.2l-2.3 2.3M8.5 15.5l-2.3 2.3"/>',
  vida: '<path d="M12 20.3S3.8 15.4 3.8 9.6A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 8.2 2.1c0 5.8-8.2 10.7-8.2 10.7z"/>',
  armadura: '<path d="M12 2.9l7.2 2.6v5.7c0 4.4-3 7.8-7.2 9.6-4.2-1.8-7.2-5.2-7.2-9.6V5.5z"/><path d="M12 7.6v8.6"/>',
  velocidade: '<path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor" stroke="none"/>',
  visao: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  penetracao: '<path d="M3.5 12h10.5M10.5 7.5 15 12l-4.5 4.5"/><rect x="17" y="6" width="3.4" height="12" rx=".6"/>',
  resistencia: '<path d="M12 3.2 19.3 12 12 20.8 4.7 12z"/>',
  recarga: '<path d="M5 12a7 7 0 1 1 2.2 5.1"/><path d="M5 17.4V12h5.4" fill="none"/>',
  municao: '<rect x="5.5" y="4" width="4" height="16" rx="1.2"/><rect x="12" y="4" width="4" height="16" rx="1.2"/><rect x="18.4" y="8.5" width="3" height="11.5" rx="1.2"/>'
};

const IMPACT_ICON_BY_KEY = {
  damage_per_shot: 'dano', firepower_summary: 'dano',
  health: 'vida', health_damage_multiplier: 'vida',
  armor: 'armadura', armor_drone_multiplier: 'armadura',
  max_movement_speed: 'velocidade', aimed_movement_speed: 'velocidade', fire_rate_summary: 'velocidade',
  vision_range: 'visao', aimed_range: 'visao', hip_fire_range: 'visao', effective_range_summary: 'visao',
  armor_penetration: 'penetracao', penetration_power: 'penetracao', armor_break_summary: 'penetracao', aiming_stability_summary: 'penetracao',
  armor_resistance: 'resistencia',
  reload_time: 'recarga',
  magazine_size: 'municao', ammo_capacity_summary: 'municao'
};

function impactIconSvg(key) {
  const nome = IMPACT_ICON_BY_KEY[key] || 'visao';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IMPACT_ICON_PATHS[nome] || IMPACT_ICON_PATHS.visao}</svg>`;
}

/* Itens podem ter bônus escritos numa frase que este site ainda
   não sabe encaixar em nenhum atributo oficial — sem isso, o
   efeito simplesmente não aparece em lugar nenhum, como se não
   existisse. Em vez de sumir calado, aparece aqui, com o texto
   cru, pra dar pra saber que existe e ajustar o mapeamento. */
function montarAvisoNaoMapeados(resultado){
  const chaves = [...new Set(resultado?.estatisticasDesconhecidas || [])];
  if (!chaves.length) return '';
  const lista = chaves.map(k => esc(formatStatDesc(k))).join(', ');
  return `<div class="impact-unknown">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 9v4M12 16.5h.01"/><path d="M10.3 3.9 2.7 17.5c-.6 1 .1 2.3 1.3 2.3h16c1.2 0 1.9-1.3 1.3-2.3L13.7 3.9c-.6-1-2-1-2.6 0z"/></svg>
    <div><b>Efeitos ainda sem atributo oficial</b><span>${lista}</span></div>
  </div>`;
}

function renderImpacto(resultado) {
  const grid = $('impact-grid');
  if (!grid) return;

  /* Antes: sempre os 5 "prioritários" fixos, então equipar algo que só
     muda a 6ª posição da lista não aparecia — sobrava tela pra atributo
     que não mudou nada. Agora: mostra TODOS os que mudaram de verdade
     (buildRealStatLines já entrega changed-first), só completando com
     não-alterados até um mínimo de 3, pra tela nunca ficar vazia. */
  const estatisticas = resultado?.estatisticas || [];
  if (!estatisticas.length) return;
  const mudaramTotal = estatisticas.filter(l => Math.abs(Number(l.difference || 0)) > 1e-9).length;
  const quantidade = Math.max(3, Math.min(8, mudaramTotal || 3));
  const linhas = estatisticas.slice(0, quantidade);

  /* Barra de duas cores: o comprimento de cada trecho é a
     proporção real base/adicionado (pctBase e pct já vêm
     prontos de buildRealStatLines, na mesma escala). O selo do
     delta pousa exatamente na costura entre os dois trechos.
     Três estados: cresceu (barra cresce), sem alteração (tom
     único) e diminuiu de propósito — ex. tempo de recarga, onde
     menor é melhor: a barra encolhe pela direita mas continua
     verde, porque a direção do desenho não pode mentir sobre o
     que aconteceu. */
  grid.innerHTML = linhas.map(linha => {
    const beneficial = Number(linha.beneficialDelta ?? linha.delta ?? 0);
    const mudou = Math.abs(Number(linha.difference || 0)) > 1e-9;
    const baseTxt = formatImpactValue(linha, linha.base);
    const valorTxt = formatImpactValue(linha, linha.valor);
    const diffTxt = formatImpactDelta(linha, Math.abs(Number(linha.difference || 0)));
    const pctBase = Number(linha.pctBase || 0);
    const pct = Number(linha.pct || 0);

    let estado = 'is-flat';
    let barra = `<span class="impact-bar-base" style="width:${pctBase.toFixed(2)}%"></span>`;
    let selo = '';
    let flatTag = '';

    if (mudou) {
      estado = beneficial >= 0 ? 'is-up' : 'is-down';
      if (Number(linha.difference) > 0) {
        const addW = Math.max(0, pct - pctBase);
        barra = `<span class="impact-bar-base" style="width:${pctBase.toFixed(2)}%"></span>`
              + `<span class="impact-bar-add" style="left:${pctBase.toFixed(2)}%;width:${addW.toFixed(2)}%"></span>`;
        selo = `<span class="impact-seam" style="left:${pct.toFixed(2)}%">`
             + `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6"/><path d="M5.5 12.5L12 6l6.5 6.5"/></svg>`
             + `+${diffTxt}</span>`;
      } else {
        const ghostW = Math.max(0, pctBase - pct);
        barra = `<span class="impact-bar-add" style="left:0%;width:${pct.toFixed(2)}%"></span>`
              + `<span class="impact-bar-ghost" style="left:${pct.toFixed(2)}%;width:${ghostW.toFixed(2)}%"></span>`;
        selo = `<span class="impact-seam" style="left:${pctBase.toFixed(2)}%">`
             + `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v13"/><path d="M5.5 11.5L12 18l6.5-6.5"/></svg>`
             + `-${diffTxt}</span>`;
      }
    } else {
      flatTag = '<span class="impact-flat-tag">Sem alteração</span>';
    }

    return `<article class="impact-card ${estado}" style="--stat-color:${esc(linha.cor)}">
      <div class="impact-head">
        <span class="impact-ico">${impactIconSvg(linha.key)}</span>
        <h3>${esc(linha.nome)}</h3>
        <i class="impact-badge">OFICIAL</i>
      </div>
      <div class="impact-bar">${barra}${selo}</div>
      <div class="impact-equation">
        <div class="impact-from"><small>Base</small><b>${baseTxt}</b></div>
        ${flatTag}
        <div class="impact-to"><small>Atual</small><b>${valorTxt}</b></div>
      </div>
    </article>`;
  }).join('') + montarAvisoNaoMapeados(resultado);

  const alteradas = resultado?.estatisticas?.filter(l => Math.abs(Number(l.difference)) > 1e-9) || [];
  const dica = alteradas.length
    ? `${alteradas.length} atributo(s) oficial(is) alterado(s). Abra “Detalhes” para auditar todos os valores.`
    : 'Nenhum atributo oficial foi alterado pelos equipamentos selecionados.';
  if ($('tactical-tip')) $('tactical-tip').textContent = dica;
  if ($('recommendation-copy')) $('recommendation-copy').textContent = dica;
  renderHeroBaseStats();
}

function formatPercent(value) {
  const rounded = Math.round(Number(value || 0) * 10) / 10;
  return rounded.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function formatImpactValue(linha, value) {
  const decimals = Number(linha.decimals || 0);
  const formatted = Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return `${esc(linha.prefix || '')}${formatted}${esc(linha.unit || '')}`;
}

function formatImpactDelta(linha, value) {
  const decimals = Number(linha.decimals || 0);
  const formatted = Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return `${formatted}${esc(linha.unit || '')}`;
}

/* Recalcula tudo que depende do loadout. Ponto único de atualização. */
let analysisRequestToken = 0;

async function atualizarAnalise() {
  const requestToken = ++analysisRequestToken;
  const contexto = {
    heroi: CONFIG.heroi,
    slots: CONFIG.slots,
    equipados: CONFIG.equipados,
    dados: CONFIG.dados
  };
  try {
    const pendente = prepararAnalisePublicaV4(contexto);
    CONFIG.analise = pendente;
    CONFIG.macros = pendente.linhas || [];
    renderAnalise(pendente);
    renderImpacto(pendente);
    renderStats();

    const resultado = await analisarBuildComAutoridadeV4(contexto, 'build_lab');
    if (requestToken !== analysisRequestToken) return;

    CONFIG.analise = resultado;
    CONFIG.macros = resultado.linhas || [];

    renderAnalise(resultado);
    renderImpacto(resultado);
  } catch (error) {
    if (requestToken !== analysisRequestToken) return;
    console.error('[criar-build] Erro ao atualizar análise:', error);

    CONFIG.analise = {
      status: 'error',
      mensagem: 'Não foi possível calcular a análise.',
      linhas: [],
      bonusAtivos: [],
      estatisticasDesconhecidas: []
    };

    CONFIG.macros = [];
    renderAnalise(CONFIG.analise);
    renderImpacto(CONFIG.analise);
  }

  renderStats();
}

function renderSinergia() {
  if (!$('syn')) return;
  $('syn').innerHTML = CONFIG.slots.map(s => {
    const it = CONFIG.equipados[s.key];
    return `<div class="s media ${it && it.media && it.media.src ? '' : 'ph'}"
      style="--rc:${esc(corDoItem(it))};${mStyle(it && it.media)}" title="${esc(s.label)}">${mInner(it && it.media)}</div>`;
  }).join('');
}

/* Bônus ativos = bônus de conjunto realmente atingidos pelo loadout. */
function bonusAtivos() {
  const contagem = new Map();
  Object.values(CONFIG.equipados).forEach(it => {
    if (!it?.setId) return;
    contagem.set(it.setId, (contagem.get(it.setId) || 0) + 1);
  });

  const ativos = [];
  const vistos = new Set();

  Object.values(CONFIG.equipados).forEach(it => {
    if (!it?.set || vistos.has(it.setId)) return;
    vistos.add(it.setId);
    const pecas = contagem.get(it.setId) || 0;
    (it.set.bonus || [])
      .filter(b => pecas >= (b.required_pieces || 0))
      .forEach(b => ativos.push({ nome: b.title, desc: b.description, icone: '◈' }));
  });

  return ativos;
}

function renderBonus() {
  CONFIG.bonus = bonusAtivos();
  if (!$('bonus')) return;
  if ($('bn-count')) $('bn-count').textContent = CONFIG.bonus.length;

  $('bonus').innerHTML = CONFIG.bonus.length
    ? CONFIG.bonus.map(b => `
      <div class="b"><span class="ic">${esc(b.icone)}</span>
        <div><b>${esc(b.nome)}</b><small>${esc(b.desc)}</small></div></div>`).join('')
    : '<div style="font-size:11.5px;color:var(--faint)">Complete peças de um mesmo conjunto para ativar bônus.</div>';

  if ($('sum-a')) $('sum-a').textContent = CONFIG.resumo.tagA;
  if ($('sum-b')) $('sum-b').textContent = CONFIG.resumo.tagB;
  if ($('sum-txt')) $('sum-txt').textContent = CONFIG.resumo.texto;
}

/* ---------- etapas / progresso ---------- */
function destacarEtapa(n) {
  const atual = Math.max(1, Math.min(4, Number(n) || 1));
  document.querySelectorAll('.step').forEach(s => {
    const i = +s.dataset.s;
    s.classList.toggle('on', i === atual);
    s.setAttribute('aria-current', i === atual ? 'step' : 'false');
  });
}

function progresso(n) {
  if (n > etapa) etapa = n;
  const pct = Math.min(100, etapa * 25);
  $('prog-pct').textContent = pct + '%';
  $('prog-bar').style.width = pct + '%';
  document.querySelectorAll('.step').forEach(s => {
    const i = +s.dataset.s;
    s.classList.toggle('done', i < etapa);
  });
  destacarEtapa(Math.min(n, 4));
}

function toast(mensagem, tipo = '') {
  const stack = $('toast-stack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast ${tipo}`.trim();
  el.textContent = mensagem;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

let buildIdAtual = null;

/* Carrega uma build salva (própria ou de outro jogador) pro
   wizard, no MESMO formato que equipar()/CONFIG.heroi já usam.
   tier_id de build_items aponta pra equipment_tiers.id — o
   mesmo mapa que dadosDaBuild() usa pra SALVAR, aqui invertido
   (id -> slug) pra reconstruir a raridade equipada. */
async function carregarBuildExistente(buildId) {
  const [{ data: build, error: erroBuild }, { data: itens, error: erroItens }] = await Promise.all([
    supabase.from('builds').select('id,title,description,visibility,hero_id,user_id').eq('id', buildId).maybeSingle(),
    supabase.from('build_items').select('equipment_id,tier_id,slot').eq('build_id', buildId)
  ]);
  if (erroBuild || !build) { console.error('[criar-build] build não encontrada:', erroBuild); return false; }
  if (erroItens) console.error('[criar-build] itens da build:', erroItens);

  const tierSlugPorId = new Map([...CONFIG.tiers.values()].map(t => [t.id, t.slug]));

  const hero = CONFIG.herois.find(h => h.databaseId === build.hero_id);
  if (hero) {
    CONFIG.heroi = configurarHeroiDaBuild(hero);
  }

  CONFIG.equipados = {};
  for (const row of (itens || [])) {
    const item = CONFIG.catalogo.find(i => i.databaseId === row.equipment_id);
    if (!item) { console.warn('[criar-build] equipamento não encontrado no catálogo:', row.equipment_id); continue; }
    if (!equipamentoCompativelComHeroi(item, CONFIG.heroi)) {
      console.warn('[criar-build] equipamento incompatível ignorado:', row.equipment_id);
      continue;
    }
    const slotObj = CONFIG.slots[Number(row.slot) - 1] || CONFIG.slots.find(s => s.key === item.slot);
    if (!slotObj) continue;
    const raridadeSlug = tierSlugPorId.get(row.tier_id) || item.raridade;
    CONFIG.equipados[slotObj.key] = { ...item, raridade: raridadeSlug };
  }

  $('b-name').value = build.title || '';
  $('b-desc').value = build.description || '';
  if (build.visibility) $('b-vis').value = build.visibility;

  buildIdAtual = build.id;

  const { data: { session: sessaoAtual } } = await supabase.auth.getSession();
  const souDono = sessaoAtual?.user?.id && build.user_id === sessaoAtual.user.id;
  if (!souDono) toast('Você está vendo a build de outro jogador. Salvar cria uma cópia sua.', 'success');

  return true;
}

function dadosDaBuild(status = 'published') {
  return {
    heroId: CONFIG.heroi.databaseId,
    title: $('b-name').value.trim(),
    description: $('b-desc').value.trim(),
    visibility: $('b-vis').value,
    status,
    tags: [...CONFIG.tags],
    items: CONFIG.slots.map((slot, index) => {
      const item = CONFIG.equipados[slot.key];
      if (!item) return null;
      return {
        equipment_id: item.databaseId,
        tier_id: CONFIG.tiers.get(item.raridade)?.id || null,
        slot: index + 1
      };
    }).filter(Boolean)
  };
}

function salvarLocal(status = 'draft') {
  const draft = { ...dadosDaBuild(status), savedAt: new Date().toISOString() };
  localStorage.setItem('echo-arena-build-draft', JSON.stringify(draft));
  return draft;
}

async function salvarBuild(status = 'published') {
  const payload = dadosDaBuild(status);
  if (!payload.title) {
    $('b-name').focus();
    toast('Digite um nome para a build.', 'error');
    return;
  }
  if (!payload.heroId) {
    toast('Selecione um herói antes de salvar.', 'error');
    return;
  }

  const button = status === 'draft' ? $('save-draft') : $('save-build');
  if (button) button.disabled = true;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      salvarLocal(status);
      toast('Rascunho salvo neste dispositivo. Entre na conta para publicar.', 'success');
      return;
    }

    const { data: result, error } = await supabase.rpc('save_user_build', {
      p_build_id: buildIdAtual || null,
      p_hero_id: payload.heroId,
      p_title: payload.title,
      p_description: payload.description || null,
      p_visibility: payload.visibility,
      p_status: status,
      p_items: payload.items,
      p_tags: payload.tags
    });
    if (error) throw error;

    buildIdAtual = result?.id || buildIdAtual;
    localStorage.removeItem('echo-arena-build-draft');

    const mensagem = result?.forked
      ? 'Cópia criada no seu perfil com sucesso.'
      : result?.updated
        ? (status === 'draft' ? 'Rascunho atualizado.' : 'Build atualizada com sucesso.')
        : (status === 'draft' ? 'Rascunho salvo no seu perfil.' : 'Build publicada com sucesso.');
    toast(mensagem, 'success');
  } catch (error) {
    console.error('[criar-build] Falha ao salvar:', error);
    salvarLocal('draft');
    const mensagens = {
      build_equipment_incompatible: 'Há um equipamento incompatível com o herói selecionado.',
      build_source_not_accessible: 'A build de origem não está disponível para cópia.',
      build_tier_unavailable: 'Um dos níveis de equipamento não está disponível.',
      duplicate_build_slot: 'Há mais de um equipamento ocupando a mesma posição.',
      build_hero_unavailable: 'O herói selecionado não está disponível.'
    };
    const codigo = Object.keys(mensagens).find(chave => String(error?.message || '').includes(chave));
    const detalhe = codigo ? mensagens[codigo] : (error?.message || 'Erro inesperado ao salvar.');
    toast(`Não foi possível salvar: ${detalhe} Um rascunho local foi preservado.`, 'error');
  } finally {
    if (button) button.disabled = false;
  }
}

function abrirSeletorHeroi() {
  $('hero-picker').hidden = false;
  $('hero-picker-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}

function fecharSeletorHeroi() {
  $('hero-picker').hidden = true;
  $('hero-picker-backdrop').hidden = true;
  document.body.style.overflow = '';
}

/* ---------- eventos ---------- */
function adicionarEvento(id, evento, callback) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    console.warn(`[criar-build] Elemento #${id} não encontrado.`);
    return;
  }

  elemento.addEventListener(evento, callback);
}

adicionarEvento('steps', 'click', e => {
  const s = e.target.closest('.step');
  if (s) destacarEtapa(+s.dataset.s);
});

adicionarEvento('next-equip', 'click', () => {
  progresso(4);
  document.querySelector('.col4')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

adicionarEvento('clear-all', 'click', () => {
  CONFIG.equipados = {};
  equipamentoSelecionado = null;
  renderSlots();
  renderSinergia();
  renderBonus();
  renderDetalheEquipamento(null);
  atualizarAnalise();
  if (!$('pop').hidden) { $('pop-foot').hidden = true; renderCatalogo(); }
  toast('Todos os equipamentos foram removidos.');
});

adicionarEvento('tk-l', 'click', () => $('track')?.scrollBy({ left: -300, behavior: 'smooth' }));
adicionarEvento('tk-r', 'click', () => $('track')?.scrollBy({ left: 300, behavior: 'smooth' }));

adicionarEvento('pop-close', 'click', fecharPop);

/* O X agora é renderizado dentro do card de detalhe, que é recriado a
   cada render — por isso o listener fica no contêiner, não no botão. */
$('pop')?.addEventListener('click', e => {
  if (e.target.closest('[data-close-pop]')) fecharPop();
});
$('pop-back').onclick = fecharPop;

$('pop-search').oninput = e => { buscaPop = e.target.value; renderCatalogo(); };

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('pop').hidden) fecharPop();
  if (e.key === 'Escape' && !$('hero-picker').hidden) fecharSeletorHeroi();
});

window.addEventListener('scroll', posicionarPop, { passive: true });

$('b-name').oninput = e => {
  $('c-name').textContent = e.target.value.length;
  if (e.target.value) progresso(1);
  salvarLocal('draft');
};

$('b-desc').oninput = e => { $('c-desc').textContent = e.target.value.length; salvarLocal('draft'); };

$('b-vis').onchange = e => {
  const mensagens = {
    public: 'Sua build poderá ser vista por todos.',
    unlisted: 'Somente pessoas com o link poderão acessar.',
    private: 'Somente você poderá ver esta build.'
  };
  $('vis-hint').textContent = mensagens[e.target.value] || mensagens.private;
  const radio = document.querySelector(`.vis-radio[value="${CSS.escape(e.target.value)}"]`);
  if (radio) radio.checked = true;
};

let navigationToastTimer = 0;

function setSidebarOpen(open) {
  const sidebar = $('site-sidebar');
  const trigger = $('sidebar-open');
  if (!sidebar || !trigger) return;

  document.body.classList.toggle('sidebar-open', open);
  sidebar.setAttribute('aria-hidden', String(!open));
  trigger.setAttribute('aria-expanded', String(open));
  $('sidebar-backdrop')?.setAttribute('aria-hidden', String(!open));
}

function showNavigationToast(mensagem) {
  const toast = $('nav-toast');
  if (!toast) return;
  window.clearTimeout(navigationToastTimer);
  toast.textContent = mensagem;
  toast.classList.add('show');
  navigationToastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

$('sidebar-open')?.addEventListener('click', () => setSidebarOpen(true));
$('sidebar-close')?.addEventListener('click', () => setSidebarOpen(false));
$('sidebar-backdrop')?.addEventListener('click', () => setSidebarOpen(false));

document.querySelectorAll('#site-sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    const emBreve = link.dataset.comingSoon;
    if (emBreve) {
      e.preventDefault();
      showNavigationToast(`${emBreve}: esta área será disponibilizada em breve.`);
      return;
    }
    setSidebarOpen(false);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
    setSidebarOpen(false);
  }
});

document.querySelectorAll('.vis-radio').forEach(radio => radio.onchange = () => {
  $('b-vis').value = radio.value;
  $('b-vis').dispatchEvent(new Event('change'));
});

adicionarEvento('change-hero', 'click', abrirSeletorHeroi);
adicionarEvento('hero-picker-close', 'click', fecharSeletorHeroi);
adicionarEvento('hero-picker-backdrop', 'click', fecharSeletorHeroi);
adicionarEvento('save-build', 'click', () => salvarBuild('published'));
adicionarEvento('save-draft', 'click', () => salvarBuild('draft'));

adicionarEvento('share-build', 'click', async () => {
  const title = $('b-name').value.trim() || `Build de ${CONFIG.heroi.nome}`;
  const data = { title: `Echo Arena — ${title}`, text: 'Confira esta build do Echo Arena.', url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); toast('Link copiado.', 'success'); }
  } catch (error) {
    if (error?.name !== 'AbortError') toast('Não foi possível compartilhar agora.', 'error');
  }
});

adicionarEvento('compare-build', 'click', () => {
  /* a build que está sendo montada AGORA pode ter itens que ainda
     não foram salvos — buildIdAtual só existe depois de um "Salvar".
     Por isso o estado atual vai sempre junto, como rascunho local
     (mesmo mecanismo de salvarLocal já usado no site), e o
     comparador lê esse rascunho pra preencher o slot A na hora. */
  salvarLocal('compare');
  const params = new URLSearchParams();
  params.set('draft', '1');
  if (buildIdAtual) params.set('build', buildIdAtual);
  window.location.href = `./comparar-build.html?${params.toString()}`;
});

document.querySelectorAll('[data-impact-tab]').forEach(tab => tab.onclick = () => {
  document.querySelectorAll('[data-impact-tab]').forEach(x => x.classList.toggle('on', x === tab));
  document.querySelectorAll('[data-impact-view]').forEach(view => view.classList.toggle('on', view.id === tab.dataset.impactTab));
});

document.querySelectorAll('#build-tags [data-tag]').forEach(button => {
  button.classList.add('selected');
  button.onclick = () => {
    const tag = button.dataset.tag;
    if (CONFIG.tags.has(tag)) { CONFIG.tags.delete(tag); button.classList.remove('selected'); }
    else { CONFIG.tags.add(tag); button.classList.add('selected'); }
  };
});

document.querySelector('#build-tags .add-tag')?.addEventListener('click', () => {
  const tag = prompt('Digite uma tag curta para a build:')?.trim();
  if (!tag || CONFIG.tags.has(tag)) return;
  CONFIG.tags.add(tag);
  const button = document.createElement('button');
  button.type = 'button'; button.dataset.tag = tag; button.className = 'selected'; button.textContent = tag;
  button.onclick = () => { CONFIG.tags.delete(tag); button.remove(); };
  document.querySelector('#build-tags .add-tag').before(button);
});

document.querySelectorAll('.mobile-steps .step').forEach(step => step.addEventListener('click', () => {
  const numero = Number(step.dataset.s);
  const alvo = numero === 1 ? document.querySelector('.hero-panel')
    : numero === 2 ? document.querySelector('.synergy-stage')
    : numero === 3 ? document.querySelector('.impact-panel')
    : document.querySelector('.build-plan');
  alvo?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

// Mantém o navegador de etapas sincronizado com a seção realmente visível.
// A página continua única; os números funcionam como atalhos, não como páginas separadas.
const secoesEtapas = [
  { n: 1, el: document.querySelector('.hero-panel') },
  { n: 2, el: document.querySelector('.synergy-stage') },
  { n: 3, el: document.querySelector('.impact-panel') },
  { n: 4, el: document.querySelector('.build-plan') }
].filter(item => item.el);

let scrollSpyTimer = null;
function sincronizarEtapaComScroll() {
  if (!window.matchMedia('(max-width:800px)').matches) return;
  const referencia = window.innerHeight * 0.42;
  let melhor = secoesEtapas[0];
  let distancia = Infinity;
  secoesEtapas.forEach(item => {
    const rect = item.el.getBoundingClientRect();
    const ponto = Math.max(rect.top, Math.min(referencia, rect.bottom));
    const d = Math.abs(ponto - referencia);
    if (rect.bottom > 70 && rect.top < window.innerHeight && d < distancia) {
      distancia = d;
      melhor = item;
    }
  });
  if (melhor) destacarEtapa(melhor.n);
}

window.addEventListener('scroll', () => {
  clearTimeout(scrollSpyTimer);
  scrollSpyTimer = setTimeout(sincronizarEtapaComScroll, 45);
}, { passive: true });

let resizeTimer = null;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    renderSlots();

    if (typeof posicionarPop === 'function') {
      posicionarPop();
    }
  }, 200);
});

/* ---------- init ---------- */
try {
  await carregarConteudoSupabase();
  CONFIG.dados = await carregarDadosAnalise();
} catch (err) {
  console.error('Falha ao carregar conteúdo do Supabase:', err);
}

const buildIdNaUrl = new URLSearchParams(location.search).get('build');
let buildCarregadaDaUrl = false;
if (buildIdNaUrl) {
  try {
    buildCarregadaDaUrl = await carregarBuildExistente(buildIdNaUrl);
  } catch (error) {
    console.error('[criar-build] Falha ao carregar build da URL:', error);
  }
}

try {
  const draft = buildCarregadaDaUrl ? null : JSON.parse(localStorage.getItem('echo-arena-build-draft') || 'null');
  if (draft) {
    const hero = CONFIG.herois.find(h => h.databaseId === draft.heroId);
    if (hero) {
      CONFIG.heroi = configurarHeroiDaBuild(hero);
    }
    for (const salvo of (draft.items || [])) {
      const slot = CONFIG.slots[Number(salvo.slot) - 1];
      const item = CONFIG.catalogo.find(i => i.databaseId === salvo.equipment_id);
      if (slot && item) CONFIG.equipados[slot.key] = { ...item };
    }
    $('b-name').value = draft.title || '';
    $('b-desc').value = draft.description || '';
    $('b-vis').value = draft.visibility || 'public';
  }
} catch (error) {
  console.warn('[criar-build] Rascunho local inválido:', error);
}

if (!$('b-name').value) $('b-name').value = `${CONFIG.heroi.nome || 'Herói'} — Controle de Longo Alcance`;
$('c-name').textContent = $('b-name').value.length;
$('c-desc').textContent = $('b-desc').value.length;
$('b-vis').dispatchEvent(new Event('change'));

heroiAtual = CONFIG.heroi.id;
CONFIG.resumo.tagA = CONFIG.heroi.classe || '—';

renderHeroi();
renderHerois();
renderDetalheEquipamento(null);
renderSinergia();
renderBonus();
atualizarAnalise();
progresso(1);
