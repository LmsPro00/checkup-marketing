# 🔧 Configurazione HubSpot

Guida completa per integrare il CheckUp Marketing con HubSpot.

## 📋 Prerequisiti

- Account HubSpot (anche gratuito)
- Accesso alle impostazioni di HubSpot
- Permessi per creare proprietà personalizzate

## 🔑 Step 1: Ottenere l'API Key

1. Vai su [HubSpot Settings](https://app.hubspot.com/settings/)
2. Nel menu laterale, vai su **Integrations** → **API Key**
3. Clicca su **Create key** o **Show key** se esiste già
4. Copia la chiave API

## 🏗️ Step 2: Creare le Proprietà Personalizzate

Devi creare queste proprietà personalizzate per i **Contatti** in HubSpot:

### Proprietà del Checkup

| Nome Interno | Etichetta | Tipo | Descrizione |
|--------------|-----------|------|-------------|
| `checkup_score` | Checkup Score | Number | Punteggio complessivo 0-100 |
| `checkup_level` | Checkup Level | Single-line text | Livello: Eccellente/Buono/Sufficiente/Da Migliorare |
| `checkup_date` | Checkup Date | Date picker | Data completamento checkup |

### Punteggi per Categoria

| Nome Interno | Etichetta | Tipo |
|--------------|-----------|------|
| `score_digital_presence` | Score: Presenza Digitale | Number |
| `score_seo` | Score: SEO | Number |
| `score_content` | Score: Content Marketing | Number |
| `score_social_media` | Score: Social Media | Number |
| `score_advertising` | Score: Advertising | Number |
| `score_analytics` | Score: Analytics | Number |
| `score_email_marketing` | Score: Email Marketing | Number |
| `score_conversion` | Score: Conversioni | Number |
| `score_customer_engagement` | Score: Customer Engagement | Number |

### Informazioni dalle Risposte

| Nome Interno | Etichetta | Tipo |
|--------------|-----------|------|
| `has_website` | Ha un Sito Web | Single checkbox |
| `website_url` | URL Sito Web | Single-line text |
| `social_media_platforms` | Piattaforme Social | Multiple checkboxes |
| `monthly_marketing_budget` | Budget Marketing Mensile | Dropdown |
| `uses_analytics` | Usa Analytics | Dropdown |
| `has_email_marketing` | Ha Email Marketing | Dropdown |
| `competitors` | Competitor | Multi-line text |

### Come Creare le Proprietà

1. Vai su **Settings** → **Properties**
2. Seleziona **Contact properties**
3. Clicca su **Create property**
4. Compila i campi:
   - **Object type**: Contact
   - **Group**: Crea un nuovo gruppo "Marketing Checkup"
   - **Label**: Nome visualizzato
   - **Internal name**: Nome interno dalla tabella
   - **Field type**: Tipo dalla tabella
5. Clicca su **Create**

## ⚙️ Step 3: Configurare il Progetto

1. Crea un file `.env` nella root del progetto:
   ```bash
   cp .env.example .env
   ```

2. Apri `.env` e inserisci la tua API key:
   ```
   VITE_HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **IMPORTANTE**: Non committare mai il file `.env` su Git!

## 🚀 Step 4: Configurare Vercel (Produzione)

1. Vai sul dashboard Vercel del tuo progetto
2. Vai su **Settings** → **Environment Variables**
3. Aggiungi la variabile:
   - **Name**: `VITE_HUBSPOT_API_KEY`
   - **Value**: La tua API key
   - **Environment**: Production (e opzionalmente Preview/Development)
4. Clicca su **Save**
5. Rideploya il progetto

## 🔄 Flusso di Integrazione

1. **Landing Page** → L'utente compila il form HubSpot (acquisizione lead)
2. **Tool Checkup** → L'utente risponde alle domande
3. **Email Capture** → Richiesta email per collegare i dati
4. **Invio a HubSpot** → Il sistema:
   - Cerca il contatto tramite email
   - Aggiorna tutte le proprietà del contatto con i dati del checkup (score, risposte, categorie)

## 🧪 Test dell'Integrazione

1. Crea un contatto di test in HubSpot con la tua email
2. Completa il checkup usando quella email
3. Verifica in HubSpot che le proprietà del contatto siano state aggiornate con:
   - Punteggio complessivo (checkup_score)
   - Livello (checkup_level)
   - Data checkup (checkup_date)
   - Punteggi per ogni categoria
   - Informazioni dalle risposte (sito web, social media, budget, etc.)

## ⚠️ Troubleshooting

### Errore 401 - Unauthorized
- Verifica che l'API key sia corretta
- Controlla che la variabile ambiente sia configurata correttamente

### Errore 404 - Contact not found
- Il contatto con quella email non esiste in HubSpot
- Assicurati che l'utente sia stato acquisito dalla landing page prima

### Proprietà non aggiornate
- Verifica che tutte le proprietà personalizzate siano state create
- Controlla che i nomi interni corrispondano esattamente

## 📚 Risorse

- [HubSpot API Documentation](https://developers.hubspot.com/docs/api/overview)
- [HubSpot Properties API](https://developers.hubspot.com/docs/api/crm/properties)
- [HubSpot Contacts API](https://developers.hubspot.com/docs/api/crm/contacts)
