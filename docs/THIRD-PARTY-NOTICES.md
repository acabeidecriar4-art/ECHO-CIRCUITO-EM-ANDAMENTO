# Inventário preliminar de terceiros

Este arquivo é um inventário técnico, **não uma conclusão jurídica nem uma licença concedida pelo projeto**. A licença e os avisos de redistribuição dos itens marcados como pendentes precisam ser confirmados na fonte/distribuição original antes de publicar o build completo.

| Componente/arquivo | Uso/localização | Evidência disponível | Ação de licença |
|---|---|---|---|
| Barlow / Barlow Condensed (TTF) | `public/esports/assets/` | Família declarada em `fonts.css`; origem exata do download não está registrada. | Confirmar pacote, versão e licença; incluir o aviso exigido. |
| Bundle PaddleOCR para navegador | `public/admin/js/vendor/paddleocr-browser.bundle.mjs` | Bundle vendorizado; metadados de origem/licença não foram encontrados no repositório. | Identificar versão e dependências incluídas; preservar `LICENSE`/`NOTICE` aplicáveis. |
| Modelos e dicionário OCR | `public/assets/ocr/*.onnx`, `public/assets/ocr/*.txt` | Arquivos PP-OCR v5; fonte e licença dos pesos/dados não estão documentadas localmente. | Confirmar termos de redistribuição dos modelos e do dicionário, independentemente do código PaddleOCR. |
| Supabase JS | Import `@supabase/supabase-js@2.112.2` em `public/js/supabase.js` via `esm.sh` | Versão está fixada na URL de importação; a cópia histórica carrega o módulo pela rede. | Confirmar licença da versão e avaliar vendorização/CDN conforme a política de publicação. |
| Tesseract.js | Referências a `tesseract.js@5.1.1` via jsDelivr na área Admin | Versão fixada nas URLs encontradas em HTML/JS. | Confirmar licença e dependências transitivas da distribuição. |
| ONNX Runtime Web | Referência a `onnxruntime-web@1.22.0` via jsDelivr na área Admin | Versão fixada no caminho da CDN. | Confirmar licença/avisos da versão e dependências utilizadas. |
| Playwright | `playwright@1.63.0`, dependência de desenvolvimento para regressão browser | Declarado em `package.json` e fixado em `package-lock.json`; licença Apache-2.0 conferida nos metadados do pacote. | Somente tooling de teste; manter a versão sincronizada com a instalação de Chromium do CI. |
| axe-core Playwright | `@axe-core/playwright@4.13.0`, dependência de desenvolvimento para auditoria automática | Declarado no lockfile; licença MPL-2.0 conferida nos metadados do pacote. | Somente tooling de teste; manter o aviso de licença do pacote na distribuição de desenvolvimento. |
| Google Fonts e ativos externos | Páginas históricas em `public/` | Há referências a Google Fonts e a recursos servidos por terceiros. | Registrar famílias carregadas, licenças e impacto de privacidade/rede; preferir ativos locais aprovados quando necessário. |
| Marcas, arte e conteúdo do jogo | Páginas e imagens históricas Echo Arena / Bullet Echo | A autoria ou autorização de redistribuição não é estabelecida pelo inventário de arquivos. | Confirmar direitos, atribuição e uso de marcas antes de uma publicação pública/comercial. |

## Regra de atualização

Ao adicionar, remover ou atualizar um componente, registrar nome, versão, origem, licença, avisos exigidos e quais artefatos o incluem. Não declarar uma licença como aprovada até conferir a distribuição oficial correspondente. O build isolado `dist-esports/` reduz o conjunto incluído, mas fontes e arte do próprio protótipo também devem ter origem/licença registradas.
