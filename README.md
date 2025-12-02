# 🎯 CheckUp Marketing - Il tuo consulente personale

Strumento professionale per analizzare il marketing della tua attività attraverso domande strategiche mirate.

## 🚀 Funzionalità

- ✅ **Questionario Interattivo**: Domande mirate e condizionali per valutare lo stato del marketing
- 🔄 **Logica Condizionale**: Le domande si adattano in base alle tue risposte (es. se non hai un sito web, salta le domande relative)
- 🌐 **Analisi Sito Web**: Valutazione automatica di performance, SEO e UX
- ⚡ **Test Velocità**: Misurazione tempo di caricamento e ottimizzazioni
- 🎯 **Analisi Competitiva**: Confronto con i competitor del settore
- 📊 **Report Dettagliato**: Dashboard con visualizzazioni e metriche chiave
- 📄 **Export PDF**: Scarica il report completo in formato PDF

## 🛠️ Tecnologie

- React 18
- Vite
- TailwindCSS
- Recharts (grafici)
- Lucide React (icone)
- jsPDF (export PDF)

## 📦 Installazione

```bash
npm install
```

## 🏃 Avvio

```bash
npm run dev
```

Il tool sarà disponibile su `http://localhost:3000`

## 📝 Come Funziona

1. **Landing Page Esterna**: L'utente compila il form HubSpot (acquisizione lead)
2. **Questionario Interattivo**: Risponde alle domande sul proprio business
3. **Email Capture**: Inserisce l'email per collegare i dati al contatto HubSpot
4. **Analisi Automatica**: Il sistema analizza il sito web e calcola gli score
5. **Report Dettagliato**: Visualizza punteggi, grafici e raccomandazioni
6. **Integrazione HubSpot**: Tutti i dati vengono inviati automaticamente a HubSpot
7. **Export PDF**: Possibilità di scaricare il report completo

## 🔗 Integrazione HubSpot

Il tool si integra perfettamente con HubSpot per:
- ✅ Aggiornare i contatti esistenti con i dati del checkup
- ✅ Creare deal automatici per tracciare le opportunità
- ✅ Salvare note dettagliate con tutte le raccomandazioni
- ✅ Tracciare score per 9 categorie di marketing

📖 **Guida completa**: Vedi [HUBSPOT_SETUP.md](./HUBSPOT_SETUP.md)

## 🎨 Struttura

- `/src/App.jsx` - Componente principale
- `/src/components/` - Componenti riutilizzabili
- `/src/data/questions.js` - Database delle 13 domande
- `/src/utils/` - Utility per analisi e scoring
