import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const QuestionCard = ({ question, answer, onAnswer, questionNumber, totalQuestions }) => {
  const handleSelectChange = (value) => {
    onAnswer(question.id, value);
  };

  const handleMultiSelectChange = (value) => {
    const currentValues = answer?.value || [];
    let newValues;
    
    if (value === 'none') {
      newValues = ['none'];
    } else {
      newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value && v !== 'none')
        : [...currentValues.filter(v => v !== 'none'), value];
    }
    
    onAnswer(question.id, newValues);
  };

  const handleTextChange = (e) => {
    onAnswer(question.id, e.target.value);
  };

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary-600">
            Domanda {questionNumber} di {totalQuestions}
          </span>
          {answer?.value && (
            <CheckCircle2 className="text-green-500" size={24} />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {question.question}
        </h2>
        {question.required && (
          <span className="text-sm text-red-500">* Obbligatorio</span>
        )}
      </div>

      <div className="space-y-3">
        {question.type === 'select' && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answer?.value === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answer?.value === option.value}
                  onChange={() => handleSelectChange(option.value)}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multiselect' && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answer?.value?.includes(option.value)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={answer?.value?.includes(option.value) || false}
                  onChange={() => handleMultiSelectChange(option.value)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {(question.type === 'url' || question.type === 'text') && (
          <input
            type={question.type === 'url' ? 'url' : 'text'}
            value={answer?.value || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder}
            className="input-field text-lg"
            required={question.required}
          />
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Progresso: {Math.round((questionNumber / totalQuestions) * 100)}%
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
