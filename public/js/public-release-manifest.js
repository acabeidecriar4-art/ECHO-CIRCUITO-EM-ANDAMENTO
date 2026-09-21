export const PUBLIC_RELEASE_MANIFEST = [
  {
    version: '0.6.0-beta', kind: 'feature', published: true,
    title: 'Echo Circuit abre sua fundação competitiva',
    summary: 'O Echo Arena ganha uma entrada dedicada a torneios e ligas, com portal próprio, cinco categorias planejadas e reconhecimento da mesma sessão do Echo ID.',
    description: 'A primeira fundação do Echo Circuit apresenta a experiência competitiva sem inventar eventos, placares, inscrições ou recompensas. A estrutura informa com clareza o que está planejado e o que ainda aguarda dados reais.',
    highlights: ['Novo acesso Competir na Home e na navegação pública', 'Portal responsivo com versões próprias para desktop e mobile', 'Echo ID reconhecido sem criar um segundo login', 'Estados vazios honestos enquanto não há torneios publicados'],
    released_at: '2026-08-30T00:00:00Z'
  },
  {
    version: '0.4.3-beta', kind: 'fix', published: true,
    title: 'Texto do código livre da caixa de presente',
    summary: 'O texto do código promocional ganha o espaço necessário abaixo do presente aberto, sem sobreposição.',
    description: 'O presente aberto reserva sua altura antes do texto e do código, inclusive em telas baixas. O desenho, a abertura, os efeitos e a cópia continuam iguais.',
    highlights: ['Texto separado da caixa após a abertura', 'Animações e funcionamento do presente preservados'],
    released_at: '2026-08-28T00:18:06Z'
  },
  {
    version: '0.4.2-beta', kind: 'fix', published: true,
    title: 'Abertura do presente promocional corrigida',
    summary: 'Corrigida a falha que impedia abrir presentes de campanhas publicadas após curtir. A animação e a revelação do código seguem a confirmação da curtida, sem duplicar a participação.',
    description: 'A abertura de campanhas publicadas volta a confirmar a curtida e revelar o código. Repetir uma tentativa não cria outra curtida; o presente central, os efeitos e os ajustes para cada tamanho de tela permanecem iguais.',
    highlights: ['Abertura corrigida nas campanhas publicadas', 'Nova tentativa sem duplicar a curtida', 'Presente central, brilho e confetes preservados'],
    released_at: '2026-08-27T23:28:21Z'
  },
  {
    version: '0.4.1-beta', kind: 'improvement', published: true,
    title: 'O presente cabe em toda a arena',
    summary: 'O presente promocional se adapta melhor a PC, celulares e iPad: respeita recortes e barras do sistema, mantém os controles acessíveis em telas baixas e protege a abertura ao girar ou redimensionar a tela.',
    description: 'A caixa continua grande e central, mas agora reserva o espaço dos recortes da tela, adapta a altura ao navegador e mantém minimizar e pausar ao alcance em paisagem. Uma mudança de orientação encerra apenas os efeitos em andamento e preserva o resultado já confirmado.',
    highlights: ['Mais espaço seguro ao redor do presente em celulares e iPad', 'Controles acessíveis em telas baixas e orientação paisagem', 'Rotação e modo dividido preservam um código já confirmado', 'Cópia manual disponível quando o navegador não oferece cópia automática'],
    released_at: '2026-08-27T22:43:00Z'
  },
  {
    version: '0.4.0-beta', kind: 'improvement', published: true,
    title: 'Um presente especial no centro da arena',
    summary: 'O promocode ganha um presente central com mais movimento, brilho e confetes. A abertura acontece após confirmar a curtida, e o código fica em destaque para copiar. Você pode minimizar, reabrir e pausar os efeitos.',
    description: 'As promoções disponíveis ganham uma caixa maior no centro da tela, com um breve suspense antes de abrir. A celebração dá lugar ao código para facilitar a cópia. A disponibilidade e a validade continuam vinculadas a cada campanha.',
    highlights: ['Presente central com brilho, movimento e três ondas de confetes', 'Abertura após a confirmação da curtida, com o código em destaque ao final', 'Minimizar e reabrir sem perder a promoção', 'Controle para pausar efeitos e respeito à preferência por movimento reduzido'],
    released_at: '2026-08-27T22:23:00Z'
  },
  {
    version: '0.3.7-beta', kind: 'fix', published: true,
    title: 'Diversão ganha estabilidade e laboratório de eventos',
    summary: 'A experiência Diversão fica mais resistente no mobile sem perder animações, com VS centralizado, capitães mais claros e eventos reproduzíveis pelo Admin.',
    description: 'O runtime deixa de alterar protótipos globais do Web Audio, ganha proteção contra overlay preso e reduz o custo de composição do Caos Perfeito preservando sua animação. O Laboratório Diversão permite disparar eventos determinísticos para QA sem gravar dados de teste.',
    highlights: ['Todas as animações da Diversão foram preservadas', 'VS ancorado ao centro real no mobile', 'Capitães recebem hierarquia visual mais forte', 'Eventos podem ser disparados pelo Admin sem depender da sorte', 'Overlay preso ganha recuperação automática sem exigir fechar o navegador'],
    released_at: '2026-08-27T01:05:00-03:00'
  },
  {
    version: '0.3.6-beta', kind: 'fix', published: true,
    title: 'Composições voltam a concluir a análise',
    summary: 'Montar trio volta a receber uma resposta conclusiva do Echo Brain, com estados claros e sem confundir evidência corroborada com verificação oficial.',
    description: 'O Semantic V4 usa evidência corroborada com confiança reduzida na leitura determinística, encerra corretamente estados de erro e mantém o aprendizado fora da nota enquanto a influência estiver em 0%.',
    highlights: ['Análise de trio volta a concluir no servidor', 'Evidência corroborada aparece com confiança reduzida', 'Erros deixam de ficar presos em “Validando no servidor”', 'Aprendizado continua fora da nota quando a influência está em 0%'],
    released_at: '2026-08-27T00:30:00-03:00'
  },
  {
    version: '0.3.5-beta', kind: 'improvement', published: true,
    title: 'Tier List, Classes e autoria ficam mais claras',
    summary: 'As áreas públicas passam a explicar para que servem, e o criador de cada build deixa de parecer um detalhe apagado.',
    description: 'Tier List agora explica como interpretar uma classificação publicada, Classes deixa claro que representa função e não força, e as superfícies de builds reforçam a autoria como parte central do conteúdo.',
    highlights: ['Tier List explica propósito e limites', 'Classes diferencia função de ranking', 'Criador da build ganha destaque visual nas superfícies públicas'],
    released_at: '2026-08-26T22:48:00-03:00'
  },
  {
    version: '0.3.4-beta', kind: 'fix', published: true,
    title: 'Comparador de builds restaurado',
    summary: 'O comparador voltou a montar a experiência completa com cards, ranking e atributos reais sem ser interrompido pelo cabeçalho global.',
    description: 'A comparação volta a funcionar de forma resiliente mesmo quando o cabeçalho global reorganiza controles da página.',
    highlights: ['Comparação completa restaurada', 'Cards e ranking reais preservados', 'Falha periférica do cabeçalho não interrompe mais o comparador'],
    released_at: '2026-08-26T18:56:00-03:00'
  },
  {
    version: '0.3.3-beta', kind: 'improvement', published: true,
    title: 'Perfil, Diversão e conta seguem um padrão global',
    summary: 'Perfil e Diversão permanecem acessíveis de forma consistente em todo o site.',
    description: 'A navegação de conta foi unificada entre as páginas públicas sem comprimir a experiência desktop.',
    highlights: ['Perfil visível no mobile', 'Conta e identidade persistentes no menu', 'Cabeçalho desktop preserva espaço da navegação'],
    released_at: '2026-08-26T11:45:00-03:00'
  },
  {
    version: '0.3.2-beta', kind: 'fix', published: true,
    title: 'Apelido acessível junto da prévia no mobile',
    summary: 'No celular, apelido e nome aparecem antes da prévia viva do card.',
    description: 'O formulário mobile foi reorganizado para manter a identidade editável sempre acessível.',
    highlights: ['Campo de @ não fica mais escondido', 'Prévia viva acompanha a edição', 'Desktop preservado'],
    released_at: '2026-08-26T11:28:00-03:00'
  },
  {
    version: '0.3.1-beta', kind: 'fix', published: true,
    title: 'Meu Perfil institucional e acesso à conta corrigidos',
    summary: 'Founder e Admin voltam a carregar o perfil de forma estável e o mobile recupera acesso claro à conta.',
    description: 'A identidade institucional deixa de cair em estado indisponível durante atualizações da página.',
    highlights: ['Refresh do perfil institucional estabilizado', 'Entrar e criar conta acessíveis no mobile', 'Meu Perfil e Sair persistentes no menu'],
    released_at: '2026-08-26T10:50:00-03:00'
  },
  {
    version: '0.3.0-beta', kind: 'feature', published: true,
    title: 'Echo Trust System',
    summary: 'Identidade, autoridade, reputação e validação passam a seguir sinais separados e consistentes.',
    description: 'O sistema de confiança diferencia claramente quem a pessoa é, o que pode fazer e como um conteúdo foi validado.',
    highlights: ['Autoria institucional consistente', 'Verificação com proveniência', 'Reputação separada de autoridade'],
    released_at: '2026-08-26T10:20:00-03:00'
  },
  {
    version: '0.2.8-beta', kind: 'fix', published: true,
    title: 'Prévia do card acompanha a edição no mobile',
    summary: 'Nome, apelido, bio, cor e identidade institucional são refletidos junto do formulário.',
    description: 'A edição da identidade ganhou feedback visual imediato no celular e tablet.',
    highlights: ['Prévia sincronizada no mobile', 'Sem duplicar estado', 'Desktop mantém card lateral'],
    released_at: '2026-08-26T09:50:00-03:00'
  },
  {
    version: '0.2.7-beta', kind: 'improvement', published: true,
    title: 'Perfis institucionais deixam a progressão comunitária',
    summary: 'Founder fica fora da progressão Echo Scouts e Admin recebe identidade funcional ligada ao painel.',
    description: 'Perfis institucionais passam a representar função e responsabilidade, não participação comunitária.',
    highlights: ['Founder fora de pontos e ranks', 'Admin com insígnia funcional', 'Autoridade separada de reputação'],
    released_at: '2026-08-26T09:30:00-03:00'
  },
  {
    version: '0.2.6-beta', kind: 'improvement', published: true,
    title: 'Founder e Admin ganham identidades visuais próprias',
    summary: 'Cards institucionais deixam de parecer uma variação de membro comum.',
    description: 'A identidade visual passa a comunicar autoridade sem acumular badges decorativos.',
    highlights: ['Founder com linguagem visual Origin', 'Admin com linguagem Control', 'Hierarquia institucional mais clara'],
    released_at: '2026-08-26T09:10:00-03:00'
  },
  {
    version: '0.2.5-beta', kind: 'fix', published: true,
    title: 'Card da Echo Identity acompanha as insígnias no mobile',
    summary: 'No celular e tablet, a prévia do card fica próxima da coleção Echo Scouts.',
    description: 'A leitura da identidade e das insígnias ficou mais direta em telas menores.',
    highlights: ['Card reposicionado no mobile', 'Relação entre identidade e progressão mais clara', 'Desktop preservado'],
    released_at: '2026-08-26T08:50:00-03:00'
  },
  {
    version: '0.2.4-beta', kind: 'fix', published: true,
    title: 'Founder sincronizado no Meu Perfil',
    summary: 'Perfis institucionais exibem Founder/Admin corretamente sem misturar cargo com nível comunitário.',
    description: 'A identidade institucional passa a refletir corretamente o papel real da conta.',
    highlights: ['Founder reconhecido no próprio perfil', 'Autoridade não inferida no cliente', 'Conta existente preservada'],
    released_at: '2026-08-26T08:30:00-03:00'
  },
  {
    version: '0.2.3-beta', kind: 'improvement', published: true,
    title: 'Echo Identity melhora leitura no mobile e especialidades',
    summary: 'Card, insígnias e especialidades ficam mais claros no celular.',
    description: 'A experiência de progressão fica mais legível sem alterar pontos, thresholds ou autoridade do servidor.',
    highlights: ['Card mobile mais compacto', 'Coleção de insígnias mais densa', 'Especialidades explicadas visualmente'],
    released_at: '2026-08-26T08:10:00-03:00'
  }
];
