// Estrutura de dados centralizada.
// Nenhum texto, valor ou vídeo deve ficar hardcoded dentro dos componentes:
// tudo o que aparece na tela vem daqui (ou de uma cópia salva no localStorage).

export const emptyContato = {
  whatsapp: '5547999999999',
  instagram: '@storymaker.wedding',
  email: 'contato@storymaker.com.br',
};

export const defaultVideos = [
  {
    id: 'vid-1',
    titulo: 'Carolina + Lucas',
    categoria: 'Resumo da Festa',
    orientacao: 'vertical',
    capa: '',
    url: '',
    visivel: true,
  },
  {
    id: 'vid-2',
    titulo: 'Beatriz + Rafael',
    categoria: 'Making Of',
    orientacao: 'vertical',
    capa: '',
    url: '',
    visivel: true,
  },
  {
    id: 'vid-3',
    titulo: 'Marina + Thiago',
    categoria: 'Cerimônia',
    orientacao: 'horizontal',
    capa: '',
    url: '',
    visivel: true,
  },
  {
    id: 'vid-4',
    titulo: 'Aline + Pedro',
    categoria: 'Festa',
    orientacao: 'vertical',
    capa: '',
    url: '',
    visivel: true,
  },
];

export const defaultExperiencias = [
  {
    id: 'exp-essence',
    nome: 'Essence Collection',
    valor: 1800,
    resumo:
      'Uma cobertura pensada para transformar os principais momentos do casamento em conteúdo para guardar, compartilhar e reviver.',
    equipe: '1 Storymaker / Videomaker Mobile',
    entrega: 'Reels finalizados em até 10 dias úteis.',
    destaque: false,
    itens: [
      { titulo: 'Cobertura dedicada', descricao: 'Captação dos principais momentos: Making Of, cerimônia e festa.' },
      {
        titulo: '3 Reels editados',
        descricao: '1 Reels Making Of / Salão, 1 Reels Cerimônia e 1 Reels Resumo da Festa.',
      },
      {
        titulo: 'Material bruto completo',
        descricao: 'Todas as fotos e vídeos originais organizados em uma pasta exclusiva no Google Drive.',
      },
    ],
    visivel: true,
  },
  {
    id: 'exp-live',
    nome: 'Live Experience',
    valor: 2400,
    resumo:
      'Uma experiência criada para quem quer viver completamente o casamento enquanto nossa equipe cuida de registrar e compartilhar tudo o que está acontecendo.',
    equipe: '2 profissionais',
    entrega: 'Até 7 dias úteis.',
    destaque: true,
    itens: [
      {
        titulo: 'Dupla de captação',
        descricao: 'Maior variedade de ângulos, momentos, registros e bastidores.',
      },
      {
        titulo: 'Stories em tempo real',
        descricao: 'Conteúdos publicados diretamente no perfil da noiva ou enviados imediatamente em alta resolução.',
      },
      { titulo: 'Next Day Film', descricao: '1 Reels especial com o resumo do casamento entregue em até 24 horas.' },
      {
        titulo: '5 Reels editados',
        descricao:
          '1 Reels Making Of / Salão, 1 Reels Cerimônia, 1 Reels Resumo da Festa e até 2 Reels inspirados em tendências.',
      },
      {
        titulo: 'Material bruto completo',
        descricao: '100% dos arquivos captados durante o evento organizados no Google Drive.',
      },
    ],
    visivel: true,
  },
];

export const defaultDepoimentos = [
  {
    id: 'dep-1',
    noivos: 'Carolina & Lucas',
    local: 'Espaço Indaiá',
    data: '2025',
    foto: '',
    texto:
      'Revivemos nosso casamento toda semana. A equipe registrou coisas que nem tínhamos percebido no dia — foi como ganhar o dia duas vezes.',
    visivel: true,
  },
  {
    id: 'dep-2',
    noivos: 'Beatriz & Rafael',
    local: 'Vila Germânica',
    data: '2025',
    foto: '',
    texto:
      'A gente esqueceu completamente que estava sendo filmado. Isso é o mais bonito: eles registram sem interferir na festa.',
    visivel: true,
  },
];

export const defaultHowItWorks = [
  { numero: '01', titulo: 'Nós conversamos', descricao: 'Conhecemos o casal, o casamento e aquilo que é importante registrar.' },
  { numero: '02', titulo: 'Planejamos', descricao: 'Definimos referências, estilo, tendências e expectativas.' },
  { numero: '03', titulo: 'Vivemos o casamento com vocês', descricao: 'Nossa equipe acompanha os principais momentos de forma discreta e próxima.' },
  { numero: '04', titulo: 'Você recebe sua história', descricao: 'Os conteúdos são organizados, editados e entregues dentro do prazo.' },
];

export const sectionOrderDefault = [
  'hero',
  'about',
  'gallery',
  'experiences',
  'comparison',
  'realtime',
  'howItWorks',
  'testimonials',
  'contact',
];

export const defaultSectionsVisibility = {
  hero: true,
  about: true,
  gallery: true,
  experiences: true,
  comparison: true,
  realtime: true,
  howItWorks: true,
  testimonials: true,
  contact: true,
};

export function createDefaultData(overrides = {}) {
  return {
    cliente: {
      noiva: '',
      noivo: '',
      data: '',
      local: '',
      valorPersonalizado: '',
      observacoes: '',
      ativa: false, // true quando é uma proposta personalizada para um casal
    },
    configuracoes: {
      nomeMarca: 'Storymaker',
      tagline: 'Storymaker & Wedding Content Creator',
      heroTitulo: 'Seu casamento acontece uma vez.',
      heroTituloDestaque: 'Mas algumas histórias merecem ser revividas muitas vezes.',
      sobreTitulo: 'Sobre o nosso olhar',
      sobreTexto:
        'Nosso trabalho não é apenas produzir vídeos. Registramos bastidores, expectativa, encontros, detalhes, abraços, reações, cerimônia, festa e momentos espontâneos.',
      sobreDestaque: 'Enquanto você vive, nós contamos.',
      realTimeTexto:
        'Os noivos não precisam passar o casamento segurando o celular, pensando em Stories, registrando convidados ou escolhendo o que postar. Nossa equipe acompanha o casamento com um olhar especializado em conteúdo mobile e redes sociais — para que vocês só precisem estar presentes.',
      ctaFinalTitulo: 'O casamento passa rápido.',
      ctaFinalTituloDestaque: 'As imagens fazem você voltar.',
      ctaFinalTexto:
        'Se você chegou até aqui e imaginou seu casamento sendo contado dessa maneira, queremos conhecer sua história.',
      sectionsVisibility: { ...defaultSectionsVisibility },
      sectionOrder: [...sectionOrderDefault],
    },
    experiencias: defaultExperiencias.map((e) => ({ ...e, itens: e.itens.map((i) => ({ ...i })) })),
    videos: defaultVideos.map((v) => ({ ...v })),
    depoimentos: defaultDepoimentos.map((d) => ({ ...d })),
    howItWorks: defaultHowItWorks.map((h) => ({ ...h })),
    contato: { ...emptyContato },
    ...overrides,
  };
}

export const PROPOSTA_BASE_ID = 'base';
export const PROPOSTA_BASE_NOME = 'Proposta Base';
