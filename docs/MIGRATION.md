# Migração do Echo Circuit para GitHub

- Origem: Echo Circuit, versão publicada 7.
- Commit original: `49b3128997c91f3fd9efdc5a71b4e2a8f9a492bc`.
- Destino: `acabeidecriar4-art/ECHO-CIRCUITO-EM-ANDAMENTO`.
- Preparação: 21/09/2026.

## Preservação

Todos os arquivos de `public/` foram mantidos byte a byte. O manifesto `source-v7-manifest.json` registra tamanho e SHA-256 de cada arquivo. A tag `sites-v7-approved` mantém os sete commits anteriores, incluindo a versão visual aprovada e os ajustes de convite.

Os arquivos gerados em `dist/` passaram a ser ignorados no desenvolvimento porque são recriados integralmente por `npm run build`. Continuam recuperáveis no histórico original. O vínculo `.openai/hosting.json` foi retirado da versão de desenvolvimento independente; também permanece no histórico. Nenhuma imagem, fonte, página ou script do site foi removido.

## Portabilidade

- Nome do pacote atualizado para `echo-circuit`.
- Comandos de execução local, verificação e prévia do build.
- Build existente preservado, com caminhos baseados em `fileURLToPath`.
- Nenhuma dependência npm, credencial ou serviço externo necessário para o E-Sports.
- Sem publicação automática, mudanças no GitLab oficial ou alterações remotas no Supabase.

## Continuidade

Desenvolver os recursos competitivos dentro de `public/esports/`. Preservar os estilos aprovados e o isolamento dos ajustes de convite em `portal-invitations.css`. O restante de `public/` é a cópia que estava na prévia, preservada a pedido do usuário, e não deve ser tratado como sincronização atual com o Echo Arena oficial.

Na integração futura, substituir o repositório local em `portal-store.js` por serviços com autenticação e autorização no servidor. Cada jogador deve responder ao próprio convite com seu Echo iD. Não usar os papéis demonstrativos como permissão real.

Os relatórios `portal-validation.json` e `esports-validation.json` são registros históricos, não resultados automaticamente reexecutados nesta migração. Os scripts de navegador antigos também foram preservados e podem exigir Playwright e ajuste do navegador executável para serem reutilizados.

A migração de código não encerra nem apaga automaticamente a prévia hospedada na origem. Sua remoção definitiva exige que o destino tenha sido conferido; a cópia original foi mantida para permitir recuperação.
