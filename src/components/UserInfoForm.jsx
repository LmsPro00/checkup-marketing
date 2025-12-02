import React, { useState } from 'react';
import { User, Mail, Building2, Phone, ArrowRight } from 'lucide-react';

const UserInfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    website: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Il nome è obbligatorio';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Il cognome è obbligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Il nome dell\'azienda è obbligatorio';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Iniziamo! 🚀
          </h1>
          <p className="text-xl text-primary-100">
            Per ricevere il tuo report personalizzato, inserisci i tuoi dati
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field pl-11 ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Mario"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cognome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field pl-11 ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Rossi"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Aziendale *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-11 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="mario.rossi@azienda.it"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Azienda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Azienda *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`input-field pl-11 ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="La Mia Azienda S.r.l."
                />
              </div>
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="+39 123 456 7890"
                />
              </div>
            </div>

            {/* Sito Web */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sito Web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="input-field"
                placeholder="https://www.azienda.it"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
            >
              Inizia il CheckUp
              <ArrowRight size={24} />
            </button>
            <p className="text-sm text-gray-500 text-center mt-4">
              I tuoi dati sono al sicuro e verranno utilizzati solo per inviarti il report
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoForm;
