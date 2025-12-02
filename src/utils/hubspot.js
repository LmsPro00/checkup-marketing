// Utility per integrare con HubSpot
// Flusso: L'utente è già un contatto in HubSpot (acquisito dalla landing page)
// Usiamo l'email per trovare e aggiornare il contatto con i dati del checkup

const HUBSPOT_API_KEY = import.meta.env.VITE_HUBSPOT_API_KEY;
const HUBSPOT_API_URL = 'https://api.hubapi.com';

/**
 * Aggiorna un contatto esistente in HubSpot con i dati del checkup
 * Cerca il contatto tramite email e aggiorna le proprietà
 */
export const updateContactWithCheckup = async (email, answers, results) => {
  try {
    const properties = {
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
    const response = await fetch(
      `${HUBSPOT_API_URL}/crm/v3/objects/contacts/${email}?idProperty=email`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`
        },
        body: JSON.stringify({ properties })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return { success: true, contactId: data.id };
  } catch (error) {
    console.error('Error updating contact:', error);
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
    const contactResult = await updateContactWithCheckup(email, answers, results);
    
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
