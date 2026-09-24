import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(resolve('public/esports/portal-store.js'), 'utf8');
const storageKey = 'echo-circuit-access-v1';
const events = [
  { id: 'open', name: 'Echo Open', category: 'Amador', status: 'Inscrições abertas' },
  { id: 'syndicate', name: 'Copa dos Sindicatos', category: 'Sindicatos', status: 'Inscrições abertas' },
  { id: 'soon', name: 'Liga futura', category: 'Amador', status: 'Em breve' },
];

function makeHarness({ store = new Map(), storageBlocked = false } = {}) {
  const listeners = new Map();
  const dispatched = [];
  const localStorage = {
    getItem(key) {
      if (storageBlocked) throw new Error('storage denied');
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error('storage denied');
      store.set(key, String(value));
    },
    removeItem(key) {
      if (storageBlocked) throw new Error('storage denied');
      store.delete(key);
    },
  };
  const window = {
    EchoCircuitEvents: events,
    addEventListener(type, handler) {
      const handlers = listeners.get(type) || [];
      handlers.push(handler);
      listeners.set(type, handlers);
    },
    dispatchEvent(event) { dispatched.push(event); },
  };
  class CustomEvent {
    constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
  }
  const context = vm.createContext({
    window,
    localStorage,
    crypto: { randomUUID },
    CustomEvent,
    Date,
    JSON,
    Math,
  });
  vm.runInContext(source, context, { filename: 'portal-store.js' });
  return {
    repo: window.EchoCircuitRepository,
    store,
    dispatched,
    emit(type, event) { for (const handler of listeners.get(type) || []) handler(event); },
  };
}

const plain = value => JSON.parse(JSON.stringify(value));

function createReadyTeam(repo, { syndicate = '' } = {}) {
  repo.saveTeam({ name: 'Equipe Echo', tag: 'EC', syndicate, crest: 'nova' });
  repo.addMember({ nick: 'Jogadora Dois', role: 'titular' });
  repo.addMember({ nick: 'Jogador Três', role: 'titular' });
  for (const member of repo.read().team.members.filter(member => member.status === 'pendente')) {
    repo.acceptMember(member.id);
  }
  return repo.read().team;
}

test('a inscrição exige três titulares confirmados e resposta para reserva opcional', () => {
  const { repo } = makeHarness();
  repo.saveTeam({ name: 'Equipe Echo', tag: 'EC', crest: 'nova' });
  repo.addMember({ nick: 'Jogadora Dois', role: 'titular' });
  repo.addMember({ nick: 'Jogador Três', role: 'titular' });

  assert.equal(repo.readiness('open').ready, false);
  assert.equal(repo.readiness('open').confirmed, 1);
  for (const member of repo.read().team.members.filter(member => member.status === 'pendente')) {
    repo.acceptMember(member.id);
  }
  assert.equal(repo.readiness('open').ready, true);

  repo.addMember({ nick: 'Reserva Echo', role: 'reserva' });
  assert.equal(repo.readiness('open').ready, false);
  const reserve = repo.read().team.members.find(member => member.role === 'reserva');
  repo.acceptMember(reserve.id);
  assert.equal(repo.readiness('open').ready, true);
  assert.equal(repo.readiness('open').confirmed, 3);
});

test('regras de elenco e nomes duplicados são validadas sem diferenciar acentos', () => {
  const { repo } = makeHarness();
  repo.saveTeam({ name: 'Equipe Echo', tag: 'EC', crest: 'nova' });
  repo.addMember({ nick: 'Álvaro' });
  assert.throws(() => repo.addMember({ nick: 'alvaro' }), /já está no elenco/);
  repo.addMember({ nick: 'Jogador Dois' });
  assert.throws(() => repo.addMember({ nick: 'Jogador Três' }), /3 vagas de titulares/);
  assert.throws(() => repo.saveTeam({ name: 'Equipe Echo', tag: 'E' }), /2 a 5/);
});

test('categoria de sindicato exige vínculo antes de liberar a inscrição', () => {
  const { repo } = makeHarness();
  createReadyTeam(repo);
  assert.equal(repo.readiness('syndicate').ready, false);
  repo.saveTeam({ name: 'Equipe Echo', tag: 'EC', syndicate: 'Sindicato Nova', crest: 'nova' });
  assert.equal(repo.readiness('syndicate').ready, true);
});

test('inscrição percorre envio, análise, check-in e cancelamento com snapshot do elenco', () => {
  const { repo } = makeHarness();
  const team = createReadyTeam(repo);
  assert.throws(() => repo.register('open', { accepted: false }), /aceite/);
  assert.throws(() => repo.register('soon', { accepted: true }), /não está aberta/);

  repo.register('open', { accepted: true, note: 'Prontos para jogar.' });
  const submitted = repo.read().registrations[0];
  assert.equal(submitted.status, 'enviada');
  assert.equal(submitted.members.length, 3);
  assert.equal(repo.activeRegistration('open').id, submitted.id);

  repo.saveTeam({ name: 'Nome Atualizado', tag: 'NEW', crest: 'vortex' });
  assert.equal(repo.read().registrations[0].teamName, team.name);
  repo.reviewRegistration(submitted.id, 'confirmada', 'Elenco demonstrativo conferido.');
  assert.equal(repo.read().registrations[0].status, 'confirmada');
  repo.checkin(submitted.id);
  assert.equal(repo.read().registrations[0].status, 'checkin');
  assert.throws(() => repo.checkin(submitted.id), /após a confirmação/);

  repo.cancelRegistration(submitted.id);
  assert.equal(repo.activeRegistration('open'), undefined);
  repo.register('open', { accepted: true });
  assert.equal(repo.read().registrations[0].status, 'enviada');
});

test('snapshots são cópias e alterações são sincronizadas entre abas', () => {
  const store = new Map();
  const first = makeHarness({ store });
  first.repo.saveTeam({ name: 'Equipe Persistida', tag: 'EP', crest: 'nova' });
  const second = makeHarness({ store });
  const snapshot = second.repo.read();
  snapshot.team.name = 'Alteração externa';
  assert.equal(second.repo.read().team.name, 'Equipe Persistida');

  first.repo.saveProfile({ nick: 'Capitã Echo', region: 'Brasil', crest: 'vortex' });
  second.emit('storage', { key: storageKey });
  assert.equal(second.repo.read().profile.nick, 'Capitã Echo');
  assert.ok(second.dispatched.some(event => event.type === 'echo:portal-change'));
});

test('modo sem localStorage mantém a demonstração disponível apenas nesta sessão', () => {
  const { repo } = makeHarness({ storageBlocked: true });
  assert.equal(repo.persistent(), false);
  repo.saveTeam({ name: 'Equipe de Sessão', tag: 'ES', crest: 'nova' });
  assert.equal(repo.read().team.name, 'Equipe de Sessão');
  assert.equal(repo.persistent(), false);
});

test('rascunhos aceitam datas de calendário válidas e normalizam datas impossíveis', () => {
  const store = new Map([[storageKey, JSON.stringify({ drafts: [
    { name: 'Rascunho antigo', date: '2026-02-30', time: '20:00' },
  ] })]]);
  const restored = makeHarness({ store });
  assert.equal(restored.repo.read().drafts[0].date, '2026-10-24');

  const { repo } = makeHarness();
  assert.throws(() => repo.saveDraft({ name: 'Rascunho', date: '2026-02-30', time: '20:00' }), /data válida/);
  assert.throws(() => repo.saveDraft({ name: 'Rascunho', date: '2026-10-30', time: '25:00' }), /horário válido/);
  const id = repo.saveDraft({ name: 'Rascunho Echo', date: '2028-02-29', time: '20:00' });
  assert.equal(repo.read().drafts[0].id, id);
  assert.equal(repo.read().drafts[0].date, '2028-02-29');
  repo.deleteDraft(id);
  assert.deepEqual(plain(repo.read().drafts), []);
});
