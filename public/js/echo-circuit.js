import { supabase } from './supabase.js?v=20260823-security-supabase-pin-1&pgv=82901afbc8df';

const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const sessionChip = document.querySelector('[data-ec-session-chip]');
const sessionPanel = document.querySelector('[data-ec-session-panel]');

function closeMenu() {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
}

menuButton?.addEventListener('click', () => {
  const willOpen = !navigation?.classList.contains('is-open');
  navigation?.classList.toggle('is-open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
});

navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderSession(state) {
  const content = {
    loading: {
      chip: 'Verificando Echo ID', kicker: 'Sincronizando identidade', title: 'Verificando seu Echo ID',
      description: 'A sessão segura da Arena está sendo consultada.', action: 'Abrir Echo Arena', href: './index.html'
    },
    connected: {
      chip: 'Echo ID conectado', kicker: 'Sessão reconhecida', title: 'Seu Echo ID já está na Arena',
      description: 'A mesma identidade estará pronta para sustentar sua futura jornada competitiva.', action: 'Ver meu perfil', href: './meu-perfil.html'
    },
    disconnected: {
      chip: 'Conectar Echo ID', kicker: 'Identidade disponível', title: 'Entre pelo Echo Arena',
      description: 'O Circuit reconhece a sessão da Arena sem criar uma segunda conta.', action: 'Entrar pelo Echo Arena', href: './index.html'
    },
    error: {
      chip: 'Echo ID indisponível', kicker: 'Consulta não concluída', title: 'Não foi possível verificar seu Echo ID',
      description: 'A página continua disponível, mas a sessão não pôde ser confirmada agora.', action: 'Voltar ao Echo Arena', href: './index.html'
    }
  }[state];

  if (!content) return;
  if (sessionChip) {
    sessionChip.dataset.state = state;
    sessionChip.querySelector('span').textContent = content.chip;
  }
  if (sessionPanel) {
    sessionPanel.dataset.state = state;
    sessionPanel.setAttribute('aria-busy', String(state === 'loading'));
  }
  setText('[data-ec-id-kicker]', content.kicker);
  setText('[data-ec-id-title]', content.title);
  setText('[data-ec-id-description]', content.description);
  const action = document.querySelector('[data-ec-id-action]');
  if (action) {
    action.childNodes[0].nodeValue = `${content.action} `;
    action.href = content.href;
  }
}

async function bootSession() {
  renderSession('loading');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    renderSession(data.session ? 'connected' : 'disconnected');
  } catch (error) {
    console.warn('[Echo Circuit] sessão indisponível:', error.message);
    renderSession('error');
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    renderSession(session ? 'connected' : 'disconnected');
  });
}

bootSession();
