import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

const EmailForm = ({ onSubmit, results }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Inserisci la tua email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Inserisci un\'email valida');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Simula un breve caricamento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full mb-6 animate-bounce">
            <Sparkles size={64} className="text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            🎉 Complimenti!
          </h1>
          <p className="text-2xl text-primary-100 mb-4">
            Hai completato il CheckUp Marketing
          </p>
          <div className="inline-block px-8 py-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <p className="text-4xl font-bold text-white">
              Il tuo punteggio: {results.overallScore}/100
            </p>
            <p className="text-xl text-primary-100 mt-2">
              {results.level.emoji} {results.level.label}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Ricevi il Report Completo
            </h2>
            <p className="text-gray-600">
              Inserisci la tua email per visualizzare l'analisi dettagliata con raccomandazioni personalizzate
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`input-field pl-11 text-lg ${error ? 'border-red-500' : ''}`}
                  placeholder="tua.email@esempio.it"
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Caricamento...
                </>
              ) : (
                <>
                  Visualizza Report Completo
                  <ArrowRight size={24} />
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                <strong>📊 Nel tuo report troverai:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-3 space-y-2">
                <li>✅ Analisi dettagliata per ogni area del marketing</li>
                <li>✅ Confronto con le best practices del settore</li>
                <li>✅ Raccomandazioni prioritizzate e actionable</li>
                <li>✅ Piano d'azione personalizzato</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 I tuoi dati sono protetti e non verranno condivisi con terze parti
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
