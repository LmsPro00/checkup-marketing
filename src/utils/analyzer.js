// Utility per analizzare il sito web e calcolare score
export const analyzeSitePerformance = async (url) => {
  try {
    // Simulazione analisi (in produzione si userebbe PageSpeed Insights API)
    const startTime = performance.now();
    
    // Tenta di caricare il sito per misurare il tempo
    const response = await fetch(url, { mode: 'no-cors' });
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Score basato sul tempo di caricamento
    let speedScore = 100;
    if (loadTime > 3000) speedScore = 40;
    else if (loadTime > 2000) speedScore = 60;
    else if (loadTime > 1000) speedScore = 80;
    
    return {
      loadTime: Math.round(loadTime),
      speedScore,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    // Se non riesce a caricare, restituisce valori di default
    return {
      loadTime: null,
      speedScore: 50,
      error: 'Impossibile analizzare il sito',
      timestamp: new Date().toISOString()
    };
  }
};

export const calculateScore = (answers) => {
  let totalScore = 0;
  let totalWeight = 0;
  const categoryScores = {};
  
  answers.forEach(answer => {
    const question = answer.question;
    let score = 0;
    
    if (question.type === 'select') {
      const selectedOption = question.options.find(opt => opt.value === answer.value);
      score = selectedOption ? selectedOption.score : 0;
    } else if (question.type === 'multiselect') {
      const selectedValues = answer.value || [];
      selectedValues.forEach(val => {
        const option = question.options.find(opt => opt.value === val);
        if (option) score += option.score;
      });
      // Normalizza a 100
      const maxScore = question.options.reduce((sum, opt) => sum + opt.score, 0);
      score = (score / maxScore) * 100;
    } else if (question.type === 'url' || question.type === 'text') {
      score = answer.value ? 100 : 0;
    }
    
    const weightedScore = score * question.weight;
    totalScore += weightedScore;
    totalWeight += question.weight * 100;
    
    // Aggrega per categoria
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { score: 0, weight: 0 };
    }
    categoryScores[question.category].score += weightedScore;
    categoryScores[question.category].weight += question.weight * 100;
  });
  
  const overallScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  
  // Calcola score per categoria
  const categoryResults = {};
  Object.keys(categoryScores).forEach(cat => {
    const catData = categoryScores[cat];
    categoryResults[cat] = catData.weight > 0 
      ? Math.round((catData.score / catData.weight) * 100) 
      : 0;
  });
  
  return {
    overallScore,
    categoryScores: categoryResults,
    level: getScoreLevel(overallScore)
  };
};

export const getScoreLevel = (score) => {
  if (score >= 80) return { label: 'Eccellente', color: 'green', emoji: '🚀' };
  if (score >= 60) return { label: 'Buono', color: 'blue', emoji: '👍' };
  if (score >= 40) return { label: 'Sufficiente', color: 'yellow', emoji: '⚠️' };
  return { label: 'Da Migliorare', color: 'red', emoji: '🔧' };
};

export const generateRecommendations = (answers, categoryScores, siteAnalysis) => {
  const recommendations = [];
  
  // Verifica se l'utente ha un sito web
  const hasWebsite = answers.find(a => a.question.id === 1);
  const noWebsite = hasWebsite && hasWebsite.value === 'no';
  
  // Se non ha un sito web, aggiungi raccomandazione prioritaria
  if (noWebsite) {
    recommendations.push({
      category: 'digital_presence',
      priority: 'high',
      title: '🚨 Crea un sito web professionale',
      description: 'Un sito web è fondamentale per la tua presenza digitale. Senza un sito, perdi credibilità e opportunità di business.',
      actions: [
        'Scegli una piattaforma (WordPress, Wix, Shopify per e-commerce)',
        'Registra un dominio professionale (www.tuomarchio.it)',
        'Crea pagine essenziali: Home, Chi Siamo, Servizi/Prodotti, Contatti',
        'Assicurati che sia mobile-friendly e veloce',
        'Aggiungi moduli di contatto e call-to-action chiari',
        'Implementa Google Analytics per tracciare i visitatori'
      ]
    });
  }
  
  // Analisi per categoria
  Object.keys(categoryScores).forEach(category => {
    const score = categoryScores[category];
    
    if (category === 'digital_presence' && score < 70 && !noWebsite) {
      recommendations.push({
        category: 'digital_presence',
        priority: 'high',
        title: 'Migliora la tua presenza digitale',
        description: 'Il tuo sito web necessita di ottimizzazioni. Assicurati che sia responsive, veloce e con contenuti aggiornati.',
        actions: [
          'Ottimizza le immagini per ridurre i tempi di caricamento',
          'Implementa un design responsive per mobile',
          'Aggiungi certificato SSL (HTTPS)',
          'Migliora la navigazione e l\'esperienza utente'
        ]
      });
    }
    
    if (category === 'seo' && score < 60) {
      recommendations.push({
        category: 'seo',
        priority: 'high',
        title: 'Potenzia la tua strategia SEO',
        description: 'L\'ottimizzazione per i motori di ricerca è fondamentale per essere trovati online.',
        actions: [
          'Ricerca e implementa parole chiave rilevanti',
          'Ottimizza i meta tag (title, description)',
          'Crea contenuti di qualità regolarmente',
          'Migliora la velocità del sito',
          'Ottieni backlink di qualità'
        ]
      });
    }
    
    if (category === 'content' && score < 50) {
      recommendations.push({
        category: 'content',
        priority: 'medium',
        title: 'Sviluppa una strategia di contenuti',
        description: 'I contenuti regolari e di qualità sono essenziali per attrarre e mantenere i clienti.',
        actions: [
          'Crea un calendario editoriale',
          'Pubblica almeno 1-2 articoli/video a settimana',
          'Diversifica i formati: blog, video, infografiche',
          'Ottimizza i contenuti per SEO',
          'Condividi i contenuti sui social media'
        ]
      });
    }
    
    if (category === 'social_media' && score < 60) {
      recommendations.push({
        category: 'social_media',
        priority: 'medium',
        title: 'Potenzia la presenza sui social media',
        description: 'I social media sono cruciali per raggiungere e coinvolgere il tuo pubblico.',
        actions: [
          'Identifica i social più rilevanti per il tuo target',
          'Pubblica contenuti con regolarità (almeno 3-5 volte/settimana)',
          'Interagisci con i follower e rispondi ai commenti',
          'Usa hashtag strategici',
          'Considera campagne di influencer marketing'
        ]
      });
    }
    
    if (category === 'advertising' && score < 50) {
      recommendations.push({
        category: 'advertising',
        priority: 'medium',
        title: 'Investi in pubblicità digitale',
        description: 'Le campagne a pagamento possono accelerare significativamente la crescita.',
        actions: [
          'Inizia con un budget test (300-500€/mese)',
          'Prova Google Ads per intercettare ricerche',
          'Usa Facebook/Instagram Ads per awareness',
          'Implementa il retargeting per recuperare visitatori',
          'Monitora costantemente ROI e ottimizza'
        ]
      });
    }
    
    if (category === 'analytics' && score < 70) {
      recommendations.push({
        category: 'analytics',
        priority: 'high',
        title: 'Implementa un sistema di analytics robusto',
        description: 'Non puoi migliorare ciò che non misuri. Gli analytics sono fondamentali.',
        actions: [
          'Installa Google Analytics 4',
          'Configura obiettivi e conversioni',
          'Implementa Google Tag Manager',
          'Crea dashboard personalizzate',
          'Analizza i dati settimanalmente'
        ]
      });
    }
    
    if (category === 'email_marketing' && score < 50) {
      recommendations.push({
        category: 'email_marketing',
        priority: 'low',
        title: 'Avvia una strategia di email marketing',
        description: 'L\'email marketing ha uno dei ROI più alti nel marketing digitale.',
        actions: [
          'Scegli una piattaforma (Mailchimp, Sendinblue, etc.)',
          'Crea un lead magnet per raccogliere email',
          'Segmenta la tua lista',
          'Invia newsletter regolari con valore',
          'Implementa automazioni (welcome series, carrello abbandonato)'
        ]
      });
    }
    
    if (category === 'conversion' && score < 60) {
      recommendations.push({
        category: 'conversion',
        priority: 'high',
        title: 'Ottimizza il tracciamento delle conversioni',
        description: 'Tracciare le conversioni ti permette di capire cosa funziona e cosa no.',
        actions: [
          'Definisci chiaramente i tuoi obiettivi di conversione',
          'Implementa il tracking con Google Analytics',
          'Usa Facebook Pixel e Google Ads conversion tracking',
          'Crea funnel di conversione chiari',
          'Testa diverse CTA e landing page'
        ]
      });
    }
    
    if (category === 'customer_engagement' && score < 50) {
      recommendations.push({
        category: 'customer_engagement',
        priority: 'medium',
        title: 'Migliora l\'engagement con i clienti',
        description: 'Un buon customer engagement aumenta la fedeltà e il passaparola.',
        actions: [
          'Aggiungi una chat live sul sito',
          'Rispondi rapidamente sui social media',
          'Implementa un sistema CRM',
          'Chiedi e gestisci le recensioni',
          'Crea un programma fedeltà'
        ]
      });
    }
  });
  
  // Raccomandazioni basate sull'analisi del sito
  if (siteAnalysis && siteAnalysis.speedScore < 70) {
    recommendations.push({
      category: 'digital_presence',
      priority: 'high',
      title: 'Ottimizza la velocità del sito',
      description: `Il tuo sito impiega ${siteAnalysis.loadTime}ms a caricare. Un sito lento danneggia SEO e conversioni.`,
      actions: [
        'Comprimi e ottimizza le immagini',
        'Abilita la cache del browser',
        'Minimizza CSS e JavaScript',
        'Usa un CDN per contenuti statici',
        'Considera un hosting più performante'
      ]
    });
  }
  
  // Ordina per priorità
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return recommendations;
};

export const analyzeCompetitors = (competitorUrls) => {
  // Simulazione analisi competitor
  // In produzione si potrebbero usare API come SimilarWeb, SEMrush, etc.
  
  if (!competitorUrls || competitorUrls.length === 0) {
    return {
      analyzed: false,
      message: 'Nessun competitor specificato'
    };
  }
  
  return {
    analyzed: true,
    competitors: competitorUrls.map(url => ({
      url,
      estimatedTraffic: Math.floor(Math.random() * 100000) + 10000,
      socialPresence: Math.floor(Math.random() * 100),
      contentFrequency: ['Daily', 'Weekly', 'Monthly'][Math.floor(Math.random() * 3)],
      strengths: ['SEO forte', 'Presenza social attiva', 'Content marketing efficace'].slice(0, Math.floor(Math.random() * 3) + 1)
    })),
    insights: [
      'I tuoi competitor pubblicano contenuti con maggiore frequenza',
      'Investono significativamente in SEO e content marketing',
      'Hanno una presenza social più strutturata',
      'Considera di aumentare il budget per rimanere competitivo'
    ]
  };
};
