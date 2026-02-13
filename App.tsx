
import React, { useState } from 'react';
import { Appointment, SALES_REPS } from './types';
import FormInput from './components/FormInput';
import { exportToCSV, exportToPDF } from './services/exportService';
import { generateSalesPitch } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<Appointment>({
    id: '',
    clientName: '',
    company: '',
    address: '',
    phone: '',
    email: '',
    salesRep: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    purpose: '',
    notes: '',
    createdAt: new Date().toISOString()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pitch, setPitch] = useState<string | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExportCSV = () => {
    exportToCSV(formData);
  };

  const handleExportPDF = () => {
    exportToPDF(formData);
  };

  const handleGeneratePitch = async () => {
    if (!formData.company || !formData.purpose) {
      alert("Veuillez au moins remplir l'entreprise et le motif du RDV.");
      return;
    }
    setIsGeneratingPitch(true);
    const result = await generateSalesPitch(formData);
    setPitch(result);
    setIsGeneratingPitch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a save
    setTimeout(() => {
      setSuccessMessage("Rendez-vous validé ! Vous pouvez maintenant exporter les documents.");
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FieldFlow</h1>
          <p className="mt-2 text-lg text-slate-600">Saisie de Rendez-vous Commercial Terrain</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
                  <span className="text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-semibold text-slate-800">Informations Client</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Entreprise"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Cogip Industries"
                  />
                  <FormInput
                    label="Nom du contact"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Mme. Jeanne Martin"
                  />
                  <FormInput
                    label="Adresse complète"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="N°, rue, CP, Ville"
                  />
                  <FormInput
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@entreprise.fr"
                  />
                </div>

                <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 pt-4">
                  <span className="text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-semibold text-slate-800">Détails du RDV</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Date du RDV"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Heure"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Commercial"
                    name="salesRep"
                    as="select"
                    value={formData.salesRep}
                    onChange={handleChange}
                    required
                    options={SALES_REPS.map(rep => ({ value: rep.name, label: `${rep.name} (${rep.region})` }))}
                  />
                  <FormInput
                    label="Motif du rendez-vous"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Présentation gamme 2024"
                  />
                </div>

                <FormInput
                  label="Notes additionnelles"
                  name="notes"
                  as="textarea"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Points spécifiques à aborder, historique..."
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Validation...' : 'Valider le Rendez-vous'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportations
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Générer PDF Imprimable</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Exporter CSV</span>
                </button>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                IA Sales Assistant
              </h3>
              <p className="text-sm text-indigo-700 mb-4 italic">
                Laissez l'IA préparer votre argumentaire en fonction du motif de RDV.
              </p>
              
              {!pitch ? (
                <button
                  onClick={handleGeneratePitch}
                  disabled={isGeneratingPitch}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold text-xs uppercase tracking-wider flex items-center justify-center"
                >
                  {isGeneratingPitch ? (
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : 'Générer Pitch Commercial'}
                </button>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-indigo-100 text-sm text-slate-700 whitespace-pre-wrap animate-fade-in">
                  <div className="font-bold text-indigo-600 mb-2 text-xs uppercase">Votre Argumentaire :</div>
                  {pitch}
                  <button 
                    onClick={() => setPitch(null)}
                    className="mt-3 text-xs text-indigo-400 hover:text-indigo-600 block"
                  >
                    Effacer / Recommencer
                  </button>
                </div>
              )}
            </div>

            {/* Notification */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center animate-bounce">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2024 FieldFlow Pro - Solution de mobilité commerciale</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
