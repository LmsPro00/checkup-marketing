export const questions = [
  {
    id: 1,
    category: 'digital_presence',
    question: 'Hai un sito web per la tua attività?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Sì, ho un sito web', score: 100 },
      { value: 'no', label: 'No, non ho un sito web', score: 0 }
    ],
    required: true,
    weight: 10
  },
  {
    id: 2,
    category: 'digital_presence',
    question: 'Qual è l\'URL del tuo sito web?',
    type: 'url',
    placeholder: 'https://www.tuosito.it',
    required: true,
    weight: 10,
    conditionalOn: { questionId: 1, value: 'yes' }
  },
  {
    id: 3,
    category: 'digital_presence',
    question: 'Il tuo sito è ottimizzato per dispositivi mobili?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Sì, completamente responsive', score: 100 },
      { value: 'partial', label: 'Parzialmente', score: 50 },
      { value: 'no', label: 'No', score: 0 },
      { value: 'unknown', label: 'Non lo so', score: 25 }
    ],
    weight: 8,
    conditionalOn: { questionId: 1, value: 'yes' }
  },
  {
    id: 4,
    category: 'seo',
    question: 'Hai implementato strategie SEO sul tuo sito?',
    type: 'select',
    options: [
      { value: 'advanced', label: 'Sì, con strategia avanzata', score: 100 },
      { value: 'basic', label: 'Sì, SEO di base', score: 60 },
      { value: 'no', label: 'No', score: 0 },
      { value: 'unknown', label: 'Non lo so', score: 20 }
    ],
    weight: 9,
    conditionalOn: { questionId: 1, value: 'yes' }
  },
  {
    id: 5,
    category: 'content',
    question: 'Con quale frequenza pubblichi nuovi contenuti (blog, articoli, video)?',
    type: 'select',
    options: [
      { value: 'daily', label: 'Quotidianamente', score: 100 },
      { value: 'weekly', label: 'Settimanalmente', score: 80 },
      { value: 'monthly', label: 'Mensilmente', score: 50 },
      { value: 'rarely', label: 'Raramente', score: 20 },
      { value: 'never', label: 'Mai', score: 0 }
    ],
    weight: 7
  },
  {
    id: 6,
    category: 'social_media',
    question: 'Su quali social media è presente la tua attività?',
    type: 'multiselect',
    options: [
      { value: 'facebook', label: 'Facebook', score: 15 },
      { value: 'instagram', label: 'Instagram', score: 15 },
      { value: 'linkedin', label: 'LinkedIn', score: 15 },
      { value: 'twitter', label: 'Twitter/X', score: 10 },
      { value: 'tiktok', label: 'TikTok', score: 15 },
      { value: 'youtube', label: 'YouTube', score: 15 },
      { value: 'none', label: 'Nessuno', score: 0 }
    ],
    weight: 8
  },
  {
    id: 7,
    category: 'social_media',
    question: 'Con quale frequenza pubblichi sui social media?',
    type: 'select',
    options: [
      { value: 'daily', label: 'Più volte al giorno', score: 100 },
      { value: 'few_weekly', label: '3-5 volte a settimana', score: 80 },
      { value: 'weekly', label: '1-2 volte a settimana', score: 50 },
      { value: 'rarely', label: 'Raramente', score: 20 },
      { value: 'never', label: 'Mai', score: 0 }
    ],
    weight: 6
  },
  {
    id: 8,
    category: 'advertising',
    question: 'Utilizzi campagne pubblicitarie a pagamento?',
    type: 'multiselect',
    options: [
      { value: 'google_ads', label: 'Google Ads', score: 20 },
      { value: 'facebook_ads', label: 'Facebook/Instagram Ads', score: 20 },
      { value: 'linkedin_ads', label: 'LinkedIn Ads', score: 15 },
      { value: 'tiktok_ads', label: 'TikTok Ads', score: 15 },
      { value: 'other', label: 'Altri canali', score: 10 },
      { value: 'none', label: 'Nessuna pubblicità a pagamento', score: 0 }
    ],
    weight: 8
  },
  {
    id: 9,
    category: 'advertising',
    question: 'Qual è il tuo budget mensile per il marketing digitale?',
    type: 'select',
    options: [
      { value: 'none', label: '0€', score: 0 },
      { value: 'low', label: '1€ - 500€', score: 30 },
      { value: 'medium', label: '501€ - 2.000€', score: 60 },
      { value: 'high', label: '2.001€ - 5.000€', score: 85 },
      { value: 'very_high', label: 'Oltre 5.000€', score: 100 }
    ],
    weight: 7
  },
  {
    id: 10,
    category: 'analytics',
    question: 'Monitori le performance del tuo marketing con strumenti di analytics?',
    type: 'select',
    options: [
      { value: 'advanced', label: 'Sì, con dashboard avanzate e KPI definiti', score: 100 },
      { value: 'basic', label: 'Sì, uso Google Analytics o simili', score: 70 },
      { value: 'occasional', label: 'Occasionalmente', score: 30 },
      { value: 'no', label: 'No', score: 0 }
    ],
    weight: 9
  },
  {
    id: 11,
    category: 'email_marketing',
    question: 'Hai una strategia di email marketing attiva?',
    type: 'select',
    options: [
      { value: 'advanced', label: 'Sì, con automazioni e segmentazione', score: 100 },
      { value: 'basic', label: 'Sì, invio newsletter periodiche', score: 60 },
      { value: 'occasional', label: 'Occasionalmente', score: 30 },
      { value: 'no', label: 'No', score: 0 }
    ],
    weight: 7
  },
  {
    id: 12,
    category: 'competitors',
    question: 'Conosci i tuoi principali competitor online?',
    type: 'text',
    placeholder: 'Elenca 2-3 competitor (es: competitor1.it, competitor2.it)',
    required: false,
    weight: 6
  },
  {
    id: 13,
    category: 'conversion',
    question: 'Hai implementato strumenti per tracciare le conversioni (acquisti, lead, contatti)?',
    type: 'select',
    options: [
      { value: 'advanced', label: 'Sì, tracking completo con obiettivi definiti', score: 100 },
      { value: 'basic', label: 'Sì, tracking di base', score: 60 },
      { value: 'no', label: 'No', score: 0 },
      { value: 'unknown', label: 'Non lo so', score: 20 }
    ],
    weight: 9
  },
  {
    id: 14,
    category: 'customer_engagement',
    question: 'Come gestisci il rapporto con i clienti online?',
    type: 'multiselect',
    options: [
      { value: 'chat', label: 'Chat live sul sito', score: 20 },
      { value: 'social_response', label: 'Rispondo attivamente sui social', score: 20 },
      { value: 'email_support', label: 'Supporto via email', score: 15 },
      { value: 'crm', label: 'Uso un CRM', score: 25 },
      { value: 'reviews', label: 'Gestisco recensioni online', score: 15 },
      { value: 'none', label: 'Nessuna gestione attiva', score: 0 }
    ],
    weight: 7
  }
];

export const categories = {
  digital_presence: {
    name: 'Presenza Digitale',
    icon: 'Globe',
    color: 'blue',
    description: 'Valuta la qualità e l\'efficacia della tua presenza online'
  },
  seo: {
    name: 'SEO',
    icon: 'Search',
    color: 'green',
    description: 'Ottimizzazione per i motori di ricerca'
  },
  content: {
    name: 'Content Marketing',
    icon: 'FileText',
    color: 'purple',
    description: 'Strategia e frequenza di pubblicazione contenuti'
  },
  social_media: {
    name: 'Social Media',
    icon: 'Share2',
    color: 'pink',
    description: 'Presenza e attività sui social network'
  },
  advertising: {
    name: 'Advertising',
    icon: 'Target',
    color: 'orange',
    description: 'Investimenti in pubblicità digitale'
  },
  analytics: {
    name: 'Analytics',
    icon: 'BarChart3',
    color: 'indigo',
    description: 'Monitoraggio e analisi delle performance'
  },
  email_marketing: {
    name: 'Email Marketing',
    icon: 'Mail',
    color: 'cyan',
    description: 'Strategia di comunicazione via email'
  },
  competitors: {
    name: 'Analisi Competitor',
    icon: 'Users',
    color: 'red',
    description: 'Conoscenza del panorama competitivo'
  },
  conversion: {
    name: 'Conversioni',
    icon: 'TrendingUp',
    color: 'emerald',
    description: 'Tracciamento obiettivi e conversioni'
  },
  customer_engagement: {
    name: 'Customer Engagement',
    icon: 'MessageCircle',
    color: 'violet',
    description: 'Gestione del rapporto con i clienti'
  }
};
