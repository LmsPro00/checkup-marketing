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

1. L'utente risponde a 13 domande sul proprio business
2. Il sistema analizza automaticamente il sito web fornito
3. Viene generato un punteggio complessivo e per categoria
4. Il report include raccomandazioni personalizzate
5. Possibilità di scaricare il report in PDF

## 🎨 Struttura

- `/src/App.jsx` - Componente principale
- `/src/components/` - Componenti riutilizzabili
- `/src/data/questions.js` - Database delle 13 domande
- `/src/utils/` - Utility per analisi e scoring
