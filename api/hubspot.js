// Serverless function per comunicare con HubSpot
// Questo evita problemi CORS chiamando HubSpot dal server invece che dal browser

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_API_KEY = process.env.VITE_HUBSPOT_API_KEY;
  
  if (!HUBSPOT_API_KEY) {
    console.error('❌ API Key mancante');
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const { email, properties } = req.body;

    if (!email || !properties) {
      return res.status(400).json({ error: 'Email and properties required' });
    }

    console.log('📧 Aggiornamento contatto:', email);
    console.log('📦 Proprietà:', Object.keys(properties).length);

    // Chiamata a HubSpot
    const hubspotUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    
    const response = await fetch(hubspotUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`
      },
      body: JSON.stringify({ properties })
    });

    console.log('📡 HubSpot Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ HubSpot Error:', errorData);
      return res.status(response.status).json({ 
        error: 'HubSpot API error', 
        details: errorData 
      });
    }

    const data = await response.json();
    console.log('✅ Contatto aggiornato:', data.id);

    return res.status(200).json({ 
      success: true, 
      contactId: data.id 
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
