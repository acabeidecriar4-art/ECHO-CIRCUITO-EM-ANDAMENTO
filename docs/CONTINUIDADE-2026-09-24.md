# Continuidade — 24/09/2026

**Branch:** `arena/01a0d4de-echo-circuito-em-andamento` · **base:** `d8250b8` (CI browser validation)  
**Horário:** 2026-09-24 UTC · **comando:** `de continuidade`

## O que foi feito nesta continuidade

Esta sessão dá continuidade à auditoria e ao estado estável registrado em `docs/AUDITORIA-2026-09-24.md`. Nenhuma regressão foi introduzida; todo o fluxo foi revalidado antes de evoluir.

### 1 — Revalidação completa

```
npm run verify   → 225 JS/MJS + 29 inline válidos, 6 JSONs, 741 refs, 404 + 3 patches
npm test         → 10/10 (portal-store + serve)
npm run build    → dist/ (22 MB completo preservado)
npm run build:esports → dist-esports/ (29 arquivos, ~1.5 MB, 404+3 patches + 7 woff2)
npm run smoke:builds → 3 rotas ok em cada build
```

- `public/esports/` servido em `http://0.0.0.0:3030/esports/` (live preview ativo)
- Central em `/esports/acesso.html`
- Modo isolado (`--esports-dist`) responde em `/` e `/acesso.html`, 404 em `/admin/` (comportamento esperado)

### 2 — Otimização de performance: WOFF2

**Problema apontado na auditoria (Manutenção e evolução):** fontes TTF puras (~80–87 KB cada, 7 arquivos ≈ 582 KB) sem WOFF2.

**Solução implementada:**

- Gerados 7 arquivos `*.woff2` via `ttf2woff2` (Google woff2, fallback Emscripten) a partir dos TTF exatos da exportação:
  - `barlow-400.woff2` 32 KB (era 80 KB) · `barlow-500.woff2` 32 KB · `barlow-600.woff2` 33 KB
  - `barlow-condensed-600.woff2` 32 KB · `700` 32 KB · `800` 32 KB · `900` 32 KB
  - **Redução média 60% por fonte.** Total de fontes cai de 582 KB TTF para 228 KB WOFF2 servidos.
- `public/esports/assets/fonts.css` atualizado: `src: url(...woff2) format('woff2'), url(...ttf) format('truetype')` — woff2 primeiro, TTF como fallback legado.
- `public/esports/index.html` preload trocado para `barlow-condensed-800.woff2` (`font/woff2`), 32 KB em vez de 85 KB no primeiro paint.
- `scripts/check.mjs` ampliado para permitir `*.woff2` derivados de TTF já presentes no manifesto (sem quebrar a garantia de origem).
- `docs/source-v7-local-changes.json` atualizado:
  - 3 patches (portal-store.js + fonts.css + index.html) com hashes e motivos
  - 7 `additions` documentando cada woff2 com bytes/sha256/origem
  - Verificação: `404 arquivos preservados + 3 patches conferidos + 741 refs` continua verde.

**Compatibilidade:** TTF mantidos intactos para fallback; nenhum caminho do manifesto foi reescrito, apenas complementado.

### 3 — Estado e próximos passos (inalterados da auditoria)

- **P1 publicação:** usar `dist-esports/` (agora 29 arquivos) se o objetivo é só o circuito; `dist/` continua com 407+ arquivos históricos incluindo `/admin/`.
- **P1 Supabase:** chave publicável ainda no cliente — RLS/RPC precisam ser provados no projeto remoto antes de publicar `dist/`.
- **P2 qualidade:** suíte Playwright + axe-core continua no CI; execução local de axe ainda depende de Chromium. Próximo passo sugerido: triar artefato `artifacts/accessibility` do CI e ativar `A11Y_STRICT=1`.
- **P2 proveniência:** checkout shallow permanece; `sites-v7-approved` não foi importado (intencional até solicitação).

## Como rodar

```sh
npm start                         # circuito em /esports/, central em /esports/acesso.html
PORT=3030 ECHO_HOST=0.0.0.0 npm start  # preview externo (usado nesta sessão)
npm run build:esports && npm run preview:esports  # artefato isolado em /
npm run verify && npm run smoke:builds
```

## Artefatos desta sessão

- `public/esports/assets/*.woff2` (7 novos, ignorados anteriormente, agora documentados)
- `public/esports/assets/fonts.css` → woff2+ttf
- `public/esports/index.html` → preload woff2
- `scripts/check.mjs` → whitelist woff2 derivado
- `docs/source-v7-local-changes.json` → 3 patches + 7 additions
- `dist/` e `dist-esports/` regenerados (excluídos do Git, conforme `.gitignore`)

---

*Continuidade sem regressão. Próxima evolução recomendada: triagem axe + conversão de imagens/championship-stage para AVIF/WEBP otimizado e revisão do inventário de terceiros (`THIRD-PARTY-NOTICES.md`).*
