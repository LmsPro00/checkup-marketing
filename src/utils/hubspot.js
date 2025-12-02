// Utility per integrare con HubSpot
// Flusso: L'utente è già un contatto in HubSpot (acquisito dalla landing page)
// Usiamo l'email per trovare e aggiornare il contatto con i dati del checkup

const HUBSPOT_API_KEY = import.meta.env.VITE_HUBSPOT_API_KEY;
const HUBSPOT_API_URL = 'https://api.hubapi.com';

/**
 * Genera un riassunto AI della valutazione
 */
const generateAISummary = (answers, results, recommendations) => {
  const { overallScore, level, categoryScores } = results;
  
  // Identifica punti di forza (score >= 70)
  const strengths = Object.entries(categoryScores)
    .filter(([_, score]) => score >= 70)
    .map(([cat, score]) => `${getCategoryName(cat)} (${score}/100)`);
  
  // Identifica aree critiche (score < 50)
  const criticalAreas = Object.entries(categoryScores)
    .filter(([_, score]) => score < 50)
    .map(([cat, score]) => `${getCategoryName(cat)} (${score}/100)`);
  
  // Top 3 raccomandazioni prioritarie
  const topRecommendations = recommendations
    .filter(r => r.priority === 'high')
    .slice(0, 3)
    .map(r => r.title);
  
  // Costruisci il riassunto
  let summary = `📊 VALUTAZIONE MARKETING CHECKUP\n\n`;
  summary += `Punteggio Complessivo: ${overallScore}/100 - ${level.emoji} ${level.label}\n\n`;
  
  if (strengths.length > 0) {
    summary += `✅ PUNTI DI FORZA:\n`;
    strengths.forEach(s => summary += `• ${s}\n`);
    summary += `\n`;
  }
  
  if (criticalAreas.length > 0) {
    summary += `⚠️ AREE CRITICHE DA MIGLIORARE:\n`;
    criticalAreas.forEach(a => summary += `• ${a}\n`);
    summary += `\n`;
  }
  
  if (topRecommendations.length > 0) {
    summary += `🎯 PRIORITÀ IMMEDIATE:\n`;
    topRecommendations.forEach((r, i) => summary += `${i + 1}. ${r}\n`);
    summary += `\n`;
  }
  
  // Aggiungi insights specifici basati sul punteggio
  if (overallScore >= 80) {
    summary += `💡 INSIGHT: Ottimo lavoro! Il marketing è ben strutturato. Focus su ottimizzazione e scaling.`;
  } else if (overallScore >= 60) {
    summary += `💡 INSIGHT: Buone basi, ma c'è margine di miglioramento. Concentrati sulle aree critiche evidenziate.`;
  } else if (overallScore >= 40) {
    summary += `💡 INSIGHT: Il marketing necessita di attenzione urgente. Prioritizza le raccomandazioni ad alta priorità.`;
  } else {
    summary += `💡 INSIGHT: È il momento di investire seriamente nel marketing digitale. Inizia dalle fondamenta: sito web, presenza online e analytics.`;
  }
  
  return summary;
};

/**
 * Helper per ottenere il nome leggibile della categoria
 */
const getCategoryName = (category) => {
  const names = {
    digital_presence: 'Presenza Digitale',
    seo: 'SEO',
    content: 'Content Marketing',
    social_media: 'Social Media',
    advertising: 'Advertising',
    analytics: 'Analytics',
    email_marketing: 'Email Marketing',
    conversion: 'Conversioni',
    customer_engagement: 'Customer Engagement'
  };
  return names[category] || category;
};

/**
 * Aggiorna un contatto esistente in HubSpot con i dati del checkup
 * Cerca il contatto tramite email e aggiorna le proprietà
 */
export const updateContactWithCheckup = async (email, answers, results, recommendations) => {
  console.log('🔍 HubSpot: Inizio updateContactWithCheckup');
  console.log('🔍 HubSpot: Email =', email);
  console.log('🔍 HubSpot: API Key =', HUBSPOT_API_KEY ? 'Presente' : 'MANCANTE');
  
  try {
    // Genera il riassunto AI
    console.log('📝 Generazione riassunto AI...');
    const aiSummary = generateAISummary(answers, results, recommendations);
    console.log('✅ Riassunto AI generato, lunghezza:', aiSummary.length);
    
    const properties = {
      // Riassunto AI della valutazione
      checkup_ai_summary: aiSummary,
      
      // Punteggio del checkup
      checkup_score: results.overallScore,
      checkup_level: results.level.label,
      checkup_date: new Date().toISOString(),
      
      // Punteggi per categoria
      score_digital_presence: results.categoryScores.digital_presence || 0,
      score_seo: results.categoryScores.seo || 0,
      score_content: results.categoryScores.content || 0,
      score_social_media: results.categoryScores.social_media || 0,
      score_advertising: results.categoryScores.advertising || 0,
      score_analytics: results.categoryScores.analytics || 0,
      score_email_marketing: results.categoryScores.email_marketing || 0,
      score_conversion: results.categoryScores.conversion || 0,
      score_customer_engagement: results.categoryScores.customer_engagement || 0,
      
      // Informazioni aggiuntive dalle risposte
      has_website: getAnswerValue(answers, 1) === 'yes' ? 'true' : 'false',
      website_url: getAnswerValue(answers, 2) || '',
      social_media_platforms: Array.isArray(getAnswerValue(answers, 7)) 
        ? getAnswerValue(answers, 7).join(', ') 
        : '',
      monthly_marketing_budget: getAnswerValue(answers, 9) || '',
      uses_analytics: getAnswerValue(answers, 10) || '',
      has_email_marketing: getAnswerValue(answers, 11) || '',
      competitors: getAnswerValue(answers, 12) || '',
      
      // Lifecycle stage update
      lifecyclestage: 'marketingqualifiedlead'
    };

    // Aggiorna il contatto usando l'email come identificatore
    const url = `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${email}?idProperty=email`;
    console.log('🌐 URL chiamata HubSpot:', url);
    console.log('📦 Proprietà da inviare:', Object.keys(properties).length, 'proprietà');
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({ properties })
    });

    console.log('📡 Risposta HubSpot - Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Errore API HubSpot:', errorData);
      throw new Error(`HubSpot API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('✅ Contatto aggiornato con successo! ID:', data.id);
    return { success: true, contactId: data.id };
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    console.error('❌ Error details:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Funzione principale per inviare tutti i dati a HubSpot
 * Usa solo l'email per trovare e aggiornare il contatto esistente
 */
export const sendToHubSpot = async (email, answers, results, recommendations) => {
  try {
    // Aggiorna solo il contatto esistente con tutte le proprietà
    const contactResult = await updateContactWithCheckup(email, answers, results, recommendations);
    
    if (!contactResult.success) {
      throw new Error('Failed to update contact: ' + contactResult.error);
    }

    return {
      success: true,
      contactId: contactResult.contactId
    };
  } catch (error) {
    console.error('Error sending to HubSpot:', error);
    return { success: false, error: error.message };
  }
};

// Helper function
const getAnswerValue = (answers, questionId) => {
  const answer = answers.find(a => a.question.id === questionId);
  return answer ? answer.value : null;
};
