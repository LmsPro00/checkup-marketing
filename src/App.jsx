import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import ReportDashboard from './components/ReportDashboard';
import EmailForm from './components/EmailForm';
import { questions } from './data/questions';
import { 
  analyzeSitePerformance, 
  calculateScore, 
  generateRecommendations,
  analyzeCompetitors 
} from './utils/analyzer';
import { sendToHubSpot } from './utils/hubspot';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, questionnaire, emailCapture, analyzing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [results, setResults] = useState(null);
  const [siteAnalysis, setSiteAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [hubspotSent, setHubspotSent] = useState(false);

  // Filtra domande in base alle condizioni
  const getFilteredQuestions = () => {
    return questions.filter(q => {
      if (!q.conditionalOn) return true;
      const dependentAnswer = answers[q.conditionalOn.questionId];
      return dependentAnswer && dependentAnswer.value === q.conditionalOn.value;
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const handleAnswer = (questionId, value) => {
    const question = questions.find(q => q.id === questionId);
    setAnswers(prev => ({
      ...prev,
      [questionId]: { question, value }
    }));
  };

  const canProceed = () => {
    if (!currentAnswer) return false;
    if (currentQuestion.type === 'multiselect') {
      return currentAnswer.value && currentAnswer.value.length > 0;
    }
    return currentAnswer.value !== undefined && currentAnswer.value !== '';
  };

  const handleNext = async () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Tutte le domande completate, calcola risultati preliminari
      const scoreResults = calculateScore(Object.values(answers));
      setResults(scoreResults);
      // Mostra form email
      setCurrentStep('emailCapture');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const analyzeData = async () => {
    setCurrentStep('analyzing');

    // Simula un processo di analisi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analizza il sito web se fornito
    const websiteAnswer = Object.values(answers).find(a => a.question.type === 'url');
    let siteData = null;
    if (websiteAnswer && websiteAnswer.value) {
      siteData = await analyzeSitePerformance(websiteAnswer.value);
      setSiteAnalysis(siteData);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calcola lo score
    const scoreResults = calculateScore(Object.values(answers));
    setResults(scoreResults);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analizza competitor se forniti
    const competitorAnswer = Object.values(answers).find(a => a.question.category === 'competitors');
    if (competitorAnswer && competitorAnswer.value) {
      const urls = competitorAnswer.value.split(',').map(url => url.trim()).filter(url => url);
      const compAnalysis = analyzeCompetitors(urls);
      setCompetitorAnalysis(compAnalysis);
    }

    // Genera raccomandazioni
    const recs = generateRecommendations(
      Object.values(answers),
      scoreResults.categoryScores,
      siteData
    );
    setRecommendations(recs);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Invia dati a HubSpot
    console.log('🔍 DEBUG: Inizio invio HubSpot');
    console.log('🔍 DEBUG: userEmail =', userEmail);
    console.log('🔍 DEBUG: hubspotSent =', hubspotSent);
    console.log('🔍 DEBUG: API Key presente?', import.meta.env.VITE_HUBSPOT_API_KEY ? 'SÌ' : 'NO');
    
    if (userEmail && !hubspotSent) {
      console.log('✅ Condizioni OK, invio a HubSpot...');
      try {
        const hubspotResult = await sendToHubSpot(
          userEmail,
          Object.values(answers),
          scoreResults,
          recs
        );
        
        console.log('📦 Risultato HubSpot:', hubspotResult);
        
        if (hubspotResult.success) {
          console.log('✅ Dati inviati a HubSpot con successo!');
          console.log('📊 Contact ID:', hubspotResult.contactId);
          setHubspotSent(true);
        } else {
          console.error('❌ Errore invio HubSpot:', hubspotResult.error);
        }
      } catch (error) {
        console.error('❌ Errore catch invio HubSpot:', error);
        console.error('❌ Stack trace:', error.stack);
      }
    } else {
      console.warn('⚠️ Invio HubSpot saltato. Motivo:');
      if (!userEmail) console.warn('  - Email mancante');
      if (hubspotSent) console.warn('  - Già inviato in precedenza');
    }

    setCurrentStep('results');
  };

  const handleEmailSubmit = (email) => {
    setUserEmail(email);
    setCurrentStep('analyzing');
    // Riavvia l'analisi con l'email
    analyzeData();
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Titolo
    pdf.setFontSize(24);
    pdf.setTextColor(2, 132, 199);
    pdf.text('Marketing Checkup Report', pageWidth / 2, 20, { align: 'center' });
    
    // Data
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(new Date().toLocaleDateString('it-IT'), pageWidth / 2, 28, { align: 'center' });
    
    // Score principale
    pdf.setFontSize(16);
    pdf.setTextColor(0);
    pdf.text('Punteggio Complessivo', 20, 45);
    pdf.setFontSize(48);
    pdf.setTextColor(2, 132, 199);
    pdf.text(`${results.overallScore}/100`, 20, 65);
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text(results.level.label, 20, 75);
    
    // Punteggi per categoria
    let yPos = 95;
    pdf.setFontSize(16);
    pdf.text('Punteggi per Categoria', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    Object.keys(results.categoryScores).forEach(cat => {
      const score = results.categoryScores[cat];
      pdf.text(`${cat}: ${score}/100`, 25, yPos);
      yPos += 7;
      
      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Raccomandazioni
    if (recommendations.length > 0) {
      pdf.addPage();
      yPos = 20;
      pdf.setFontSize(16);
      pdf.text('Raccomandazioni Principali', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      recommendations.slice(0, 5).forEach((rec, index) => {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setTextColor(2, 132, 199);
        pdf.text(`${index + 1}. ${rec.title}`, 20, yPos);
        yPos += 7;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        const descLines = pdf.splitTextToSize(rec.description, pageWidth - 40);
        pdf.text(descLines, 25, yPos);
        yPos += descLines.length * 5 + 5;
      });
    }
    
    pdf.save('marketing-checkup-report.pdf');
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setSiteAnalysis(null);
    setRecommendations([]);
    setCompetitorAnalysis(null);
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white rounded-full mb-6">
              <Sparkles size={64} className="text-primary-600" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              CheckUp Marketing
            </h1>
            <p className="text-3xl text-primary-100 font-semibold mb-8">
              Il tuo consulente personale
            </p>
            <p className="text-xl text-primary-100">
              Scopri lo stato del tuo marketing digitale in pochi minuti
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Cosa otterrai:
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Analisi Completa</h3>
                  <p className="text-gray-600">Valutazione dettagliata di tutte le aree del marketing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Test Performance</h3>
                  <p className="text-gray-600">Analisi velocità e ottimizzazione del sito</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Raccomandazioni</h3>
                  <p className="text-gray-600">Consigli personalizzati per migliorare</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Report PDF</h3>
                  <p className="text-gray-600">Scarica il report completo in PDF</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep('questionnaire')}
              className="btn-primary text-xl px-12 py-4"
            >
              Inizia il Checkup
            </button>
            <p className="text-primary-100 mt-4">
              ⏱️ Tempo stimato: 5-7 minuti
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              CheckUp Marketing
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Il tuo consulente personale
            </p>
            <p className="text-gray-500 mt-2">
              Rispondi alle domande per ricevere la tua analisi personalizzata
            </p>
          </div>

          <QuestionCard
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={filteredQuestions.length}
          />

          <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
              Indietro
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2"
            >
              {currentQuestionIndex === filteredQuestions.length - 1 ? 'Completa' : 'Avanti'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'emailCapture') {
    return (
      <EmailForm 
        onSubmit={handleEmailSubmit}
        results={results || { overallScore: 0, level: { emoji: '⏳', label: 'Calcolando...' } }}
      />
    );
  }

  if (currentStep === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={64} className="text-white animate-spin mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Analisi in corso...
          </h2>
          <div className="space-y-3 text-primary-100 text-lg">
            <p>✓ Analisi delle tue risposte</p>
            <p>✓ Valutazione performance sito web</p>
            <p>✓ Confronto con best practices</p>
            <p>✓ Generazione raccomandazioni</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <ReportDashboard
        results={results}
        siteAnalysis={siteAnalysis}
        recommendations={recommendations}
        competitorAnalysis={competitorAnalysis}
        onExportPDF={handleExportPDF}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

export default App;
