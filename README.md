# Echo Circuit

Projeto independente de E-Sports do Echo Arena, preparado a partir da **versão 7 aprovada** da prévia. O visual e todos os arquivos do site foram preservados. O desenvolvimento pode continuar neste repositório sem GPT Sites.

## Executar

Instale Node.js 20 ou superior. Não há pacotes obrigatórios para executar ou gerar o site.

```sh
npm start
```

- Evento: <http://127.0.0.1:3030/esports/>
- Central de acessos: <http://127.0.0.1:3030/esports/acesso.html>
- A cópia completa da plataforma preservada também está em `public/`.

O servidor escuta apenas no computador local. Para testar em outro dispositivo da mesma rede, configure `ECHO_HOST=0.0.0.0`; use `PORT` para trocar a porta. Esse servidor é uma ferramenta de desenvolvimento, sem autenticação.

## Verificar e gerar os arquivos

```sh
npm run check
npm run build
npm run preview
```

O build copia `public/` integralmente para `dist/`, que pode ser servido por uma hospedagem estática. Imagens, fontes e scripts da área E-Sports são locais. O build não precisa de conta, chave ou serviço do GPT Sites.

## Estrutura

- `public/esports/`: evento, central, equipes, convites, inscrições e organização demonstrativa.
- `public/esports/assets/`: imagens, fontes e marca.
- `public/`: todos os demais arquivos que estavam na prévia.
- `scripts/`: servidor local e verificação de sintaxe/recursos do E-Sports.
- `ESPORTS-PROTOTYPE.md`: histórico funcional e visual da versão aprovada.
- `docs/MIGRATION.md`: origem, integridade e orientações de continuidade.
- `docs/source-v7-manifest.json`: hashes dos arquivos originais de `public/`.

## Estado atual

O E-Sports continua sendo um protótipo com dados demonstrativos e armazenamento no navegador. Convites, aceites e decisões de organização são simulações locais. Não há autenticação Echo iD real, envio de convites ou banco competitivo.

Nenhuma integração nova com Supabase foi adicionada. A futura integração deverá usar o projeto oficial do Echo Arena e sua sessão, conforme o planejamento. As outras páginas preservadas de Echo Arena são uma cópia histórica e podem conter referências às integrações originais; não são a versão oficial atual.

O GitHub armazena o código. A publicação de uma prévia externa é uma etapa separada; este repositório não publica automaticamente nem oferece controle de acesso ao site. Manter o repositório privado não torna uma hospedagem pública privada.

Os dados de teste salvos no navegador da URL anterior não acompanham a troca de domínio. Nenhum dado foi apagado na origem.

## Histórico

A tag `sites-v7-approved` identifica o código original completo no commit `49b3128997c91f3fd9efdc5a71b4e2a8f9a492bc`, preservando o histórico anterior. O commit de migração acrescenta execução independente e documentação; não altera os arquivos de `public/`.
