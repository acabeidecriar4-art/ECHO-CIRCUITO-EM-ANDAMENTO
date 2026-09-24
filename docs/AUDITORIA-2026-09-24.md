# Auditoria estática — Echo Circuit

**Data:** 24/09/2026

**Revisão:** `ff8d4fa` (`arena/01a0d439-echo-circuito-em-andamento`)

**Escopo:** repositório de aplicação estática, incluindo a prévia E-Sports, a cópia histórica em `public/`, scripts de build/servidor, documentação e metadados Git.

## Resumo executivo

O protótipo E-Sports está bem delimitado em `public/esports/`, não depende de backend para a demonstração local e agora conta com um build isolado, testes e smoke tests de publicação. A cópia preservada da plataforma Echo Arena continua muito maior e contém páginas administrativas e integração com um projeto Supabase; o build completo ainda a inclui intencionalmente. A publicação isolada está definida, mas a autorização no Supabase e as licenças dos componentes continuam pendentes de verificação externa.

**Parecer:** adequado para continuar desenvolvimento e demonstração local; requer decisões de entrada, escopo de publicação, autorização no backend e automação de testes antes de ser tratado como uma publicação de produção. Não foi confirmado um exploit neste trabalho, mas a segurança do Supabase não pode ser atestada a partir deste repositório.

## Implementações desta rodada

Os achados abaixo descrevem o estado visto na auditoria inicial; esta seção registra o que foi corrigido agora.

- A página raiz foi substituída por uma entrada autocontida, sem endpoint de inscrição fictício, recursos quebrados ou promessas de torneios/prêmios reais.
- Foram adicionados `npm run build:esports` e `npm run preview:esports`. O build isolado contém somente os 22 arquivos de `public/esports/`; o build histórico completo continua disponível, mas não é mais a opção recomendada para publicar somente o circuito.
- `scripts/check.mjs` agora examina todas as referências locais do site e a entrada raiz, verifica sintaxe dos 225 JS/MJS, os JSONs, a lista de arquivos e as hashes de origem/patch.
- Foram adicionados dez testes nativos do Node cobrindo regras do repositório demonstrativo e smoke tests do servidor, além de CI em GitHub Actions.
- Playwright e axe-core foram fixados como dependências de desenvolvimento; `npm run test:browser` executa as jornadas de regressão e cria relatório WCAG para o circuito, central e diálogo de identidade. O CI instala Chromium e carrega os relatórios como artefato. A auditoria axe é informativa até revisar o baseline; o modo estrito é opt-in.
- A validação de rascunhos agora rejeita datas impossíveis (por exemplo, 30 de fevereiro) e normaliza datas inválidas preexistentes. O ajuste de `portal-store.js` está registrado em `docs/source-v7-local-changes.json`, sem reescrever a hash original.
- `dist/` e `dist-esports/` foram adicionados ao `.gitignore`; os quatro arquivos de um byte sem uso foram removidos.
- README, migração e histórico E-Sports foram alinhados ao estado real. O inventário de terceiros foi criado, mas as licenças ainda precisam ser confirmadas.

### P1 — Definir o que será publicado e qual será a página inicial (build isolado implementado)

- `build.mjs` copia **toda** a pasta `public/` para `dist/`. Na auditoria inicial eram 410 arquivos; após remover os quatro marcadores sem uso, são 407 (cerca de 21 MB). O build completo continua incluindo a cópia histórica do Echo Arena, páginas em `public/admin/` e recursos de OCR; o circuito ocupa cerca de 1,2 MB.
- O servidor local serve `public/`, logo `/` abre `public/index.html` — não o `index.html` da raiz do Git. O build completo também usa `public/index.html` como `dist/index.html`; o protótipo E-Sports fica em `/esports/`.
- Antes desta implementação, o `index.html` da raiz anunciava torneios, prêmios em dinheiro e jogos que não correspondiam ao protótipo, referenciava `style.css` e `assets/favicon.png` inexistentes e apontava para o endpoint de exemplo `SEU_ENDPOINT_AQUI`. A entrada raiz foi substituída por uma página autocontida com aviso de demonstração e link relativo para o circuito.
- Uma cópia estática não protege rotas administrativas. O README alerta corretamente que hospedagem pública não fica privada por o repositório ser privado; ainda assim, a publicação precisa ser configurada conscientemente.

**Status e recomendação:** a entrada raiz foi corrigida e há um build isolado para o circuito. Para uma publicação somente E-Sports, usar `npm run build:esports` e hospedar `dist-esports/`; isso evita expor a cópia histórica. `npm run build` ainda gera intencionalmente a plataforma histórica completa — use-o somente se todas as rotas incluídas foram aprovadas para publicação.

### P1 — Validar autorização e configuração de produção no Supabase

A cópia histórica contém a URL do projeto e uma chave **publishable** no cliente (em `public/js/echo-arena-runtime-config.js`, `public/js/guard.js` e `public/js/supabase.js`). Uma chave publicável é destinada ao cliente e não equivale, por si só, a uma chave administrativa. A busca heurística realizada não encontrou padrões comuns de chaves privadas/service-role; isso não substitui um scanner de segredos.

Não há neste repositório migrations SQL, políticas RLS, configuração de funções ou evidência de testes de permissões. Portanto, não foi possível verificar isolamento de dados, autorização de operações administrativas, quotas ou exposição de dados no projeto remoto. As proteções de interface e JavaScript são apenas defesa em profundidade, nunca autorização.

**Recomendação:** antes de qualquer publicação da plataforma histórica, revisar no projeto Supabase todas as políticas RLS e funções RPC com identidades anônima, usuária e administradora; provar que operações de escrita administrativa falham sem autorização no servidor. Manter a chave publicável no cliente, mas nunca incluir `service_role` ou segredo. Definir também cabeçalhos de produção (CSP, `frame-ancestors`, `Referrer-Policy` e políticas correlatas) no provedor; o servidor local só define `X-Content-Type-Options` e é documentado como ferramenta sem autenticação.

### P2 — Histórico Git original ainda não recuperado; demais divergências corrigidas

- O checkout continua shallow/grafted, o commit de origem `49b3128…` não está disponível e a consulta ao remoto configurado não encontrou `sites-v7-approved`. As afirmações anteriores foram corrigidas, mas o histórico original ainda precisa ser localizado se for necessário preservá-lo.
- `.gitignore` agora exclui ambos os builds. A documentação foi alinhada aos comandos e ao estado deste checkout.
- Os quatro arquivos de um byte sem referência foram removidos. Os 407 caminhos voltaram a coincidir com o manifesto de exportação.
- O manifesto permanece como snapshot original: 406 arquivos continuam com os hashes originais; o patch intencional em `public/esports/portal-store.js` tem sua hash atual e motivo registrados separadamente em `docs/source-v7-local-changes.json`.

**Próxima ação:** localizar a fonte histórica/tag no repositório original e importá-la apenas se o usuário quiser restaurar o histórico Git; não alterar a hash do manifesto original para mascarar mudanças locais.

### P2 — Suíte browser adicionada; execução local bloqueada pelo ambiente

Playwright e axe-core estão declarados e fixados no lockfile. `npm run test:browser` combina as jornadas existentes de circuito e central com uma auditoria axe em desktop e mobile, incluindo o diálogo de identidade. O workflow instala Chromium, executa essa suíte e guarda relatórios/capturas como artefatos. A análise axe não bloqueia a CI por violações até que seu baseline seja revisado; `A11Y_STRICT=1` permite ativar o limite para violações sérias/críticas.

Não consegui executar os navegadores neste container: o download Playwright falhou com `ECONNRESET` para `cdn.playwright.dev`; a instalação de bibliotecas do Chromium via apt também não alcançou os repositórios Debian. O binário portátil tentado exigia `libnspr4`, indisponível aqui. Portanto, a suíte e a nova auditoria estão implementadas, mas **não foram executadas nesta sessão**; os registros JSON antigos de navegador continuam sendo apenas resultados de **14/09/2026**.

**Próxima melhoria:** confirmar a primeira execução do workflow, revisar o artefato axe e corrigir achados sérios/críticos antes de ativar o modo estrito. A suíte automatizada não substitui testes em aparelhos ou Safari nativo; validação sem navegador também não cobre toda a semântica HTML/CSS.

### P2 — Licenças de terceiros ainda precisam de confirmação

Foi criado `docs/THIRD-PARTY-NOTICES.md`, com inventário técnico de fontes Barlow, bundle/modelos PaddleOCR, Supabase JS, Tesseract.js, ONNX Runtime Web, Google Fonts e conteúdo/marcas. O inventário deliberadamente não presume licenças que não foram confirmadas nas distribuições originais.

**Próxima ação:** confirmar origem, versão e licença/avisos de redistribuição de cada item antes de publicar o build completo; revisar dependências externas e CSP conforme o destino de hospedagem.

## Manutenção e evolução

- **Reduzir o artefato:** o build de 21 MB inclui os modelos OCR, embora o circuito E-Sports use apenas uma fração dos arquivos. Um build selecionável/isolado reduz tempo de publicação e risco de disponibilizar rotas desnecessárias. Se a plataforma completa continuar sendo publicada, manter o build integral como opção explícita.
- **Conter a complexidade da cópia histórica:** há 225 arquivos JS/MJS (221 `.js` e 4 `.mjs`) e 107 CSS no site preservado, com diversos arquivos versionados de evolução/fix/final. Foram encontradas duas duplas de CSS idênticos entre `public/css/` e `public/admin/css/`. Consolidar somente após criar testes visuais e confirmar dependências; a preservação histórica declarada é uma restrição importante.
- **Tratar datas como dados:** `public/esports/data.js` fixa status e calendário de demonstração. Como as datas avançam, usar fixtures rotativas ou atualizar os dados de demonstração, sempre identificando resultados e datas como fictícios.
- **Performance:** converter fontes TTF para WOFF2, medir imagens e payload por rota e evitar carregar código da cópia histórica em páginas do circuito. A otimização deve vir depois da escolha do artefato de publicação.
- **Qualidade do frontend:** formatador, lint e verificações de acessibilidade ajudariam a manter arquivos extensos e alterações incrementais. Testes automatizados não substituem revisão de uso em aparelhos e Safari real.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| `npm run verify` | Passou; verificador estático e 10/10 testes Node. |
| `npm run check` | 225 scripts JS/MJS, 29 scripts inline, 6 JSONs e 734 referências locais aprovados; 406 arquivos continuam iguais ao snapshot e 1 patch local foi conferido. |
| `npm run build` | Passou; build completo com 407 arquivos em aproximadamente 21 MB. |
| `npm run build:esports` | Passou; build isolado com 22 arquivos em aproximadamente 1,3 MB, sem `/admin/`. |
| `npm run smoke:builds` | Passou; build completo respondeu em `/esports/`, na central e na rota histórica `/admin/`; build isolado respondeu em `/` e `/acesso.html` e retornou 404 em `/admin/`. |
| JavaScript inline executável em HTML | 29 blocos passaram na verificação sintática atual; import maps, JSON e scripts externos foram excluídos. |
| Manifesto de migração | 407 caminhos conferem; 406 hashes de origem intactas e 1 patch local validado por hash atual. Nenhum arquivo sem registro. |
| Playwright, regressão visual e fluxos no browser | Dependências declaradas e CI configurada; execução local não foi possível porque os downloads do browser/dependências do sistema falharam por restrições de rede. Aguardando primeiro resultado no CI. |
| axe-core, WCAG 2.1 A/AA (circuito, central e diálogo; desktop/mobile) | Script e relatório implementados, mas não executados localmente. CI guarda o baseline como artefato e não falha por violações até revisão. |
| RLS, RPCs, cabeçalhos da hospedagem e segurança do backend | Não auditáveis com os arquivos presentes; exigem acesso ao ambiente/configuração remota. |

## Próximas ações

1. **Antes de uma publicação pública:** verificar RLS/RPCs no Supabase e aprovar as licenças do inventário; hospedar `dist-esports/` se o objetivo for somente o circuito.
2. **Qualidade de experiência:** confirmar Playwright/Chromium no primeiro CI, revisar o artefato axe e triagem de achados; depois testar também em dispositivos reais e Safari.
3. **Proveniência:** localizar e importar a fonte Git histórica somente se for necessário recuperar o histórico que não veio neste checkout.

## Limitações

Esta é uma auditoria estática abrangente e testes locais dos recursos acima, não um pentest, análise dinâmica de todas as telas, avaliação jurídica ou revisão do banco remoto. A sintaxe válida e a ausência de links locais quebrados não garantem comportamento visual, regras de negócio, acessibilidade ou segurança em produção.
