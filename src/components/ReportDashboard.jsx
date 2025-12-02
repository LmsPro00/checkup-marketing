import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Globe,
  Search,
  FileText,
  Share2,
  Target,
  BarChart3,
  Mail,
  Users,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { categories } from '../data/questions';

const iconMap = {
  Globe, Search, FileText, Share2, Target, BarChart3, Mail, Users, TrendingUp, MessageCircle
};

const ReportDashboard = ({ results, siteAnalysis, recommendations, onExportPDF, onRestart }) => {
  const { overallScore, categoryScores, level } = results;

  // Prepara dati per il radar chart
  const radarData = Object.keys(categoryScores).map(catKey => ({
    category: categories[catKey]?.name || catKey,
    score: categoryScores[catKey],
    fullMark: 100
  }));

  // Prepara dati per il bar chart
  const barData = Object.keys(categoryScores).map(catKey => ({
    name: categories[catKey]?.name || catKey,
    score: categoryScores[catKey],
    color: getColorForCategory(catKey)
  }));

  const priorityColors = {
    high: 'red',
    medium: 'yellow',
    low: 'blue'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Il Tuo Report di Marketing
          </h1>
          <p className="text-xl text-gray-600">
            Analisi completa della tua presenza digitale
          </p>
        </div>

        {/* Score principale */}
        <div className="card mb-8 text-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="text-6xl font-bold mb-4">
            {level.emoji}
          </div>
          <div className="text-7xl font-bold mb-4">
            {overallScore}
            <span className="text-3xl">/100</span>
          </div>
          <div className="text-3xl font-semibold mb-2">
            {level.label}
          </div>
          <p className="text-xl opacity-90">
            Il tuo punteggio complessivo di marketing digitale
          </p>
        </div>

        {/* Analisi sito web */}
        {siteAnalysis && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Clock className="text-primary-600" size={32} />
              Analisi Performance Sito Web
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {siteAnalysis.loadTime ? `${siteAnalysis.loadTime}ms` : 'N/A'}
                </div>
                <div className="text-gray-600 font-medium">Tempo di Caricamento</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {siteAnalysis.speedScore}/100
                </div>
                <div className="text-gray-600 font-medium">Performance Score</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">
                  {siteAnalysis.speedScore >= 80 ? '🚀' : siteAnalysis.speedScore >= 60 ? '👍' : '⚠️'}
                </div>
                <div className="text-gray-600 font-medium">
                  {siteAnalysis.speedScore >= 80 ? 'Ottimo' : siteAnalysis.speedScore >= 60 ? 'Buono' : 'Da Migliorare'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grafici */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Analisi per Categoria
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#0284c7"
                  fill="#0284c7"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Punteggi Dettagliati
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Raccomandazioni */}
        <div className="card mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="text-primary-600" size={36} />
            Raccomandazioni Personalizzate
          </h2>
          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const Icon = rec.priority === 'high' ? AlertCircle : CheckCircle;
              const priorityColor = rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'blue';
              
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-l-4 ${
                    rec.priority === 'high'
                      ? 'bg-red-50 border-red-500'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Icon
                      size={32}
                      className={`flex-shrink-0 ${
                        rec.priority === 'high'
                          ? 'text-red-600'
                          : rec.priority === 'medium'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {rec.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rec.priority === 'high'
                              ? 'bg-red-200 text-red-800'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          Priorità {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Bassa'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{rec.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-800">Azioni consigliate:</p>
                        <ul className="space-y-2">
                          {rec.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Azioni */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onExportPDF} className="btn-primary flex items-center justify-center gap-2">
            <Download size={20} />
            Scarica Report PDF
          </button>
          <button onClick={onRestart} className="btn-secondary">
            Rifai il Checkup
          </button>
        </div>
      </div>
    </div>
  );
};

const getColorForCategory = (category) => {
  const colors = {
    digital_presence: '#3b82f6',
    seo: '#10b981',
    content: '#8b5cf6',
    social_media: '#ec4899',
    advertising: '#f97316',
    analytics: '#6366f1',
    email_marketing: '#06b6d4',
    competitors: '#ef4444',
    conversion: '#059669',
    customer_engagement: '#7c3aed'
  };
  return colors[category] || '#6b7280';
};

export default ReportDashboard;
