# Migração do Echo Circuit para GitHub

## Origem e limites de proveniência

- Origem declarada: Echo Circuit, versão publicada 7.
- Commit de origem citado nos registros anteriores: `49b3128997c91f3fd9efdc5a71b4e2a8f9a492bc`.
- Manifesto de exportação: `docs/source-v7-manifest.json` (21/09/2026).
- Destino de desenvolvimento: `acabeidecriar4-art/ECHO-CIRCUITO-EM-ANDAMENTO`.

O checkout recebido é raso e não contém o commit acima. A tag `sites-v7-approved` também não está no checkout nem foi encontrada no remoto configurado nesta revisão. Assim, este repositório **não preserva nem garante o histórico Git original**; para recuperar esse histórico, será necessário localizar e importar a fonte correta. Não se deve repetir a afirmação de que a tag está disponível aqui.

O manifesto registra a exportação original de 407 arquivos de `public/`. Atualmente, 406 permanecem byte a byte iguais ao snapshot; `public/esports/portal-store.js` recebeu um ajuste intencional para rejeitar datas impossíveis e normalizar datas inválidas já armazenadas. O arquivo original permanece no manifesto e o hash da versão local está em `docs/source-v7-local-changes.json`, validado por `npm run check`. Os quatro arquivos de um byte chamados `s` (três em `public/` e um em `assets/`) não eram referenciados nem faziam parte do manifesto; foram removidos. A lista de caminhos de `public/` volta a coincidir com os 407 caminhos do manifesto.

## Projeto independente

- Nome do pacote: `echo-circuit`.
- Node.js 20 ou superior.
- Servidor estático local sem dependências npm obrigatórias.
- `npm run build`: cópia completa de `public/` para `dist/`, incluindo a plataforma histórica.
- `npm run build:esports`: build independente de `public/esports/` para `dist-esports/`.
- `npm run preview` e `npm run preview:esports`: prévias dos respectivos builds.
- `.gitignore` exclui os diretórios de build e resultados locais.
- `npm run verify`: verificação estática abrangente e testes Node sem dependências externas.
- `npm run smoke:builds`: smoke test de rotas dos dois builds, depois de gerar ambos.

Não há publicação automática, mudança no GitLab oficial nem alteração remota no Supabase.

## Preservação e publicação

A cópia de `public/` é uma referência histórica preservada; não é uma sincronização com a plataforma Echo Arena oficial. Não publique o build completo sem revisar as páginas administrativas, integrações e o escopo da hospedagem. Se o objetivo for hospedar apenas o circuito demonstrativo, prefira `dist-esports/`.

O protótipo E-Sports não tem autenticação, autorização ou backend competitivo. Seu repositório local no navegador é uma simulação. Na futura integração, substituir `public/esports/portal-store.js` por serviços de servidor e aplicar autorização no backend: cada jogador deve responder ao próprio convite com seu Echo iD; papéis demonstrativos não podem se tornar permissões confiáveis.

A chave publicável visível nas páginas históricas não é um segredo administrativo, mas seu uso depende de políticas RLS e funções corretamente configuradas no Supabase. Essas políticas não estão neste repositório e não foram alteradas nesta migração.

## Validação

- `npm run check`: sintaxe de scripts e referências locais em `public/` e na página de entrada.
- `npm test`: testes do repositório de demonstração e do servidor local, usando o runner nativo do Node.
- `npm run verify`: executa ambas as verificações.
- `npm run test:browser`: jornadas Playwright do circuito/central e auditoria axe-core. Playwright está declarado e fixado no lockfile; `npm ci` instala os pacotes e `npx playwright install chromium` instala o browser. Os relatórios de 14/09/2026 continuam históricos, não resultados automaticamente reexecutados.

## Deploy e dados

Este repositório não publica automaticamente nem oferece controle de acesso à hospedagem. Manter o GitHub privado não torna pública uma hospedagem privada. Os dados de teste salvos no navegador de um domínio não são migrados automaticamente para outro. A cópia original não foi modificada ou apagada na origem.
