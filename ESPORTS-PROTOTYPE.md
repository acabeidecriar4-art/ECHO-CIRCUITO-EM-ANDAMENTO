# Echo Circuit — protótipo interativo privado

## Restauração do visual aprovado — 14/09/2026

A alteração anterior foi rejeitada por ampliar elementos globais e deslocar o elenco. `portal.css` foi restaurado exatamente a partir de `62e206e`. As melhorias dos convites passaram para `portal-invitations.css`, sem seletores que alterem a central, a sidebar, o cabeçalho ou o banner da equipe.

Na equipe, os quatro cartões voltaram a aparecer imediatamente depois do título, com as dimensões, fontes e fundos aprovados no desktop. “Ver aceite” abre o horário e a opção de simular uma recusa. As orientações ficam em uma seção expansível após o elenco. A inscrição continua mostrando respostas, horários, contador e ações diretamente, com controles de pelo menos 44px e textos maiores restritos ao fluxo.

Comparação local da versão aprovada e da corrigida, com os mesmos dados: nenhuma diferença nas medidas/estilos dos principais componentes da central em 1536px, 820px, 390px e 320px. Na equipe desktop, menu, banner, início do elenco e geometria dos quatro cartões coincidem; apenas o conteúdo após os cartões acrescenta altura à página. Aceite, recusa, novo aceite e persistência após recarregar foram conferidos novamente. Nenhuma rolagem horizontal na inscrição nos tamanhos menores verificados. O repositório de dados não mudou nesta restauração.

## Convites — revisão de 14/09/2026

Equipe e primeira etapa da inscrição compartilham cartões de jogadores com posição, resposta e data/hora do aceite simulado. A reserva não conta entre os três titulares; quando convidada, precisa confirmar ou ser removida para liberar o avanço. Aceite e recusa podem ser simulados nas duas áreas. As respostas antigas são preservadas, sem inventar horários que não foram registrados.

As alterações são sincronizadas entre abas e permanecem após recarregar. O elenco enviado preserva uma cópia dos aceites daquele momento. No sistema real, cada convidado deverá responder com seu próprio Echo iD.

Esta revisão foi verificada no navegador em desktop (1440×1000), tablet (820×1180), celular (390×844) e celular estreito (320×740): convites, recusa, novo aceite, reserva opcional, recarregamento, sincronização nas duas direções, envio, análise e check-in. Não houve rolagem horizontal nas telas verificadas. Os nomes dos jogadores usam 24px e os controles dos convites têm altura mínima de 48px. Também passaram 18 verificações isoladas do repositório de dados; o relatório histórico `portal-validation.json` não foi substituído por essa verificação.

## Edição espetáculo — V0.2

A revisão transforma a abertura em uma arena de campeonato, com arte original de troféu, iluminação cinematográfica, dourado e vermelho, partículas discretas e reflexos. A central de confrontos permite alternar Echo Masters, Open Challenge e Copa dos Sindicatos, com acesso direto à competição. Cartazes ilustrados substituem as capas tipográficas da primeira versão.

A abertura imersiva tem três cenas, reprodução e pausa, navegação manual por botões ou teclado e entrada nas competições. Não reproduz áudio, respeita redução de movimento e encerra seus temporizadores ao fechar. Efeitos decorativos podem ser pausados. Nenhuma programação, equipe, resultado ou vaga de exemplo representa um evento real.

Nova experiência em `/esports/`, independente das APIs, do login e dos scripts da plataforma principal. O protótipo não executa inscrições, envia mensagens, cria contas ou altera dados de competições reais.

## Central de acessos — V0.3

A experiência aprovada da página de evento foi preservada. O novo `/esports/acesso.html` acrescenta uma central com navegação própria, passe visual de jogador e áreas conectadas:

- **Central**: preparação da equipe, indicadores, competição em destaque e atividade recente.
- **Echo iD de demonstração**: nome, região e emblema; atualização do capitão no elenco atual.
- **Equipe**: criação e edição da identidade, sindicato, 3 titulares e 1 reserva opcional. Convites locais com aceite simulado, remoção e jogadores de exemplo. Validação de duplicidade e limites.
- **Inscrições**: equipe elegível → regulamento demonstrativo → revisão → envio local. Prevenção de duplicatas, preservação do elenco enviado, acompanhamento, cancelamento e check-in após confirmação simulada.
- **Acompanhando**: compartilha os favoritos com a página do circuito.
- **Organização demo**: análise das solicitações do mesmo navegador, aprovação/recusa com retorno para a equipe; rascunhos de competição com edição, prévia e exclusão confirmada.

O site continua sem autenticação, permissões ou inscrições reais. O papel “Organizador demo” é uma simulação explícita. Nenhum convite é enviado a outra pessoa. Eventos criados aqui permanecem como rascunhos locais, sem aparecer no catálogo. O portal oferece um aviso de alterações em outra aba e um modo de sessão quando o navegador bloqueia o armazenamento.

### Estrutura para integração posterior com o GitLab

- `data.js`: catálogo único de competições ilustrativas, usado pela página e pelo portal.
- `portal-store.js`: repositório local isolado; concentra validações e transições de estado, sem dependência de Sites.
- `portal.js`: rotas, formulários, prévias e componentes das áreas de acesso.
- `portal.css` / `acesso.html`: apresentação responsiva, com fontes e imagens locais.

A portabilidade do front-end é direta: HTML, CSS e JavaScript, sem runtime proprietário. A integração oficial ainda requer revisar a estrutura e as regras do repositório GitLab, substituir o armazenamento local por APIs, conectar o Echo iD e aplicar autorização no servidor para funções de capitão/organizador. O protótipo não deve ser usado como controle de acesso de produção. Dados de avaliação deste navegador não são migrados automaticamente.

### Validação dos acessos

`node validate-portal.cjs` percorre as jornadas completas pelo navegador em 1440×1000, 820×1180, 1180×820, 390×844 e 320×740. Verifica validações, persistência, decisões da organização, check-in, cancelamento, preservação do elenco enviado, rascunhos e texto potencialmente malicioso tratado como texto. Também verifica modo sem armazenamento, navegação móvel e ausência de erros de JavaScript/recursos. Relatório: `portal-validation.json`. As verificações da página principal permanecem em `validate-esports.cjs` e `esports-validation.json`.

## Direção visual

Referência indicada: https://mariaciceramc11-testepaginaegames.github.io/EA/about.html

O HTML e as folhas de estilo da referência foram inspecionados: títulos de grande escala, recortes angulares, apresentação do universo competitivo e confrontos em destaque. A adaptação usa a marca geométrica e o violeta já presentes no Echo Arena, vermelho competitivo, a ilustração existente do projeto e pôsteres originais de cada competição. Logos de equipes, fotografias e marcas de terceiros do template não foram reutilizados.

Três seções: visão geral com confronto destacado; exploração de competições e agenda; circuito com formatos e jornada do jogador. Tipografia e imagem são servidas localmente. As animações são leves, podem ser pausadas e respeitam `prefers-reduced-motion`.

## Interações

- Busca sem distinção de acentos; filtros por categoria, status e eventos acompanhados.
- Agenda mensal com horários ilustrativos de Brasília.
- Detalhes de competição: visão geral, partidas e minuta de regulamento.
- Links diretos usando `?competicao=masters`, inclusive após recarregamento.
- Favoritos e identidade demonstrativa guardados apenas no navegador, com opção de apagar preferências.
- Guia interativo de mata-mata, grupos + finais e liga.
- Menu móvel, diálogos nativos, foco por teclado, Escape e navegação acessível de abas.

Todos os eventos, equipes, resultados, datas e regulamentos são exemplos fictícios claramente sinalizados. Sindicatos representam os grupos do universo de Bullet Echo. Eventos especiais ilustram espaço futuro para parceiros ou empresa do jogo, sem anunciar vínculo oficial.

## Validação e publicação

`node validate-esports.cjs` usa Playwright com um navegador Chromium instalado. Também aceita `ECHO_CHROMIUM_EXECUTABLE` para um executável local. O script inicia seu próprio servidor local e verifica desktop, tablet em retrato/paisagem e celular em duas larguras, incluindo emulação de toque. Capturas e relatório são escritos em `ECHO_QA_OUTPUT` (padrão: `/tmp/echo-circuit-qa`). A emulação não substitui validação em aparelhos físicos ou Safari nativo.

O build existente copia `public/` para `dist/`. A publicação utiliza o projeto privado já registrado em `.openai/hosting.json`; não há mudança de público nem publicação no GitLab ou no site público do Echo Arena.
