# Echo Circuit

Protótipo independente de E-Sports do Echo Arena, com uma prévia do circuito e uma central demonstrativa. O projeto não oferece torneios, inscrições ou permissões de organização reais.

## Executar localmente

Requer Node.js 20 ou superior. A aplicação, os testes nativos (`npm run verify`) e os builds não precisam de dependências npm externas. A suíte de navegador é opcional e usa Playwright e axe-core, fixados no lockfile.

```sh
npm start
```

- Circuito: <http://127.0.0.1:3030/esports/>
- Central demonstrativa: <http://127.0.0.1:3030/esports/acesso.html>

O servidor usa `public/` e escuta somente no computador local. Para testar em outro dispositivo da rede, configure `ECHO_HOST=0.0.0.0`; use `PORT` para trocar a porta. Ele é uma ferramenta de desenvolvimento, não um servidor de produção.

## Verificar, testar e gerar

```sh
npm run verify          # valida referências e sintaxe, depois executa testes Node
npm run build           # copia public/ inteira para dist/
npm run preview         # serve o build completo em /esports/
npm run build:esports   # build isolado do circuito em dist-esports/
npm run preview:esports # serve o build isolado na raiz /
npm run smoke:builds    # valida rotas dos dois builds já gerados
```

`npm run build` preserva a cópia completa da plataforma histórica Echo Arena, inclusive `/admin/` e recursos que não pertencem ao circuito. Use-o apenas se essa cópia completa for realmente desejada. Para publicar **somente** o protótipo, use `npm run build:esports`; o conteúdo de `dist-esports/` fica independente e o circuito abre em `/`.

O `index.html` da raiz do repositório é uma página de entrada para hospedagens que publiquem o repositório diretamente. A rota que ela abre é `./public/esports/`. Em contrapartida, o servidor local e o build isolado usam suas próprias raízes e não dependem dessa página.

Builds são artefatos regeneráveis e estão excluídos do Git por `.gitignore`. O build não publica automaticamente nem exige serviço do GPT Sites.

### QA em navegador (opcional)

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

Em Linux CI, instale também as bibliotecas de sistema com `npx playwright install --with-deps chromium`. A suíte executa as jornadas responsivas existentes e a auditoria axe-core no circuito, central, perfil, formulário de rascunho e diálogo de identidade. Capturas e relatórios são escritos em `/tmp`; configure `ECHO_ESPORTS_QA_OUTPUT`, `ECHO_PORTAL_QA_OUTPUT` e `ECHO_A11Y_OUTPUT` para direcioná-los. A auditoria de acessibilidade gera relatório; para fazer falhas sérias/críticas interromperem a execução, use `A11Y_STRICT=1` depois de revisar o baseline.

## Estrutura

- `public/esports/`: evento, equipes, convites e organização demonstrativa.
- `public/`: cópia histórica preservada da plataforma Echo Arena, não uma sincronização com a versão oficial atual.
- `scripts/`: servidor local e verificador estático do site.
- `test/`: testes sem dependências externas usando o test runner nativo do Node.
- `docs/AUDITORIA-2026-09-24.md`: auditoria estática e plano priorizado.
- `docs/MIGRATION.md`: estado e limitações da migração.
- `docs/source-v7-manifest.json`: tamanhos e SHA-256 da exportação histórica de 407 arquivos.
- `docs/source-v7-local-changes.json`: hashes dos ajustes locais intencionais sobre aquela exportação.
- `docs/THIRD-PARTY-NOTICES.md`: inventário de componentes externos e itens de licença ainda a confirmar.

## Estado e segurança

O protótipo E-Sports usa dados demonstrativos e armazenamento no navegador. Convites, aceites, inscrições, decisões de organização e check-in são simulações locais. Não há autenticação Echo iD real, envio de convites ou banco competitivo; o papel “Organizador demo” não é uma permissão real.

A cópia histórica em `public/` mantém suas integrações originais e contém a URL e uma chave publicável do Supabase no código cliente. Chaves publicáveis não substituem políticas de segurança: autorização, RLS e funções do backend precisam ser verificadas no ambiente Supabase antes da publicação. Não copie segredos administrativos para arquivos servidos ao navegador.

As demais páginas de `public/` são uma cópia histórica e podem depender de serviços externos. A publicação do build completo expõe essas páginas e não transforma sua interface administrativa em controle de acesso. Hospedagem pública continua pública mesmo quando o repositório GitHub é privado.

## Histórico e integridade

A migração foi recebida como um checkout Git raso. O manifesto guarda a exportação original de 407 arquivos; o verificador confere os arquivos ainda intactos e os patches locais registrados em `docs/source-v7-local-changes.json`. O único patch atual em `public/` valida datas de calendário no rascunho de evento. O histórico/tag citados nos registros anteriores não estão presentes neste checkout nem foram encontrados no remoto configurado; não se deve depender deste clone como cópia dos commits originais.
