import React, { useState, useRef, useEffect } from 'react';
import FormSection from './components/FormSection.jsx';
import CVPreview from './components/CVPreview.jsx';
import GoogleLogin from './components/GoogleLogin.jsx';
import LinkedInLogin from './components/LinkedInLogin.jsx';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { Download, Plus, FolderOpen, LogOut } from 'lucide-react';
import './App.css';

const initialCVData = {
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '' },
  profile: '',
  education: [],
  experience: [],
  skills: [],
  languages: [],
};

// COMPOSANT LOGINPAGE INTÉGRÉ DIRECTEMENT DANS APP.JSX
const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    try {
      const userData = {
        id: 'user_' + Date.now(),
        name: response.credentials?.name || 'Utilisateur Google',
        email: response.credentials?.email || 'user@gmail.com',
        provider: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
    } catch (error) {
      console.error('Erreur connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSuccess = async (response) => {
    setIsLoading(true);
    try {
      const userData = {
        id: 'user_' + Date.now(),
        name: 'Utilisateur LinkedIn',
        email: 'user@linkedin.com',
        provider: 'linkedin'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
    } catch (error) {
      console.error('Erreur connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">Login</h1>
          <p className="text-gray-400 text-lg">Créez un CV professionnel</p>
        </div>

        <div className="space-y-4">
          <GoogleLogin onSuccess={handleGoogleSuccess} />
          <LinkedInLogin onSuccess={handleLinkedInSuccess} />
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-3">Connexion en cours...</p>
          </div>
        )}

        
      </div>
    </div>
  );
};

function App() {
  const [cvData, setCvData] = useState(initialCVData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvTitle, setCvTitle] = useState('Mon CV');
  const [user, setUser] = useState(null);
  const [savedCVs, setSavedCVs] = useState([]);
  const [currentCVId, setCurrentCVId] = useState(null);
  const [showCVList, setShowCVList] = useState(false);
  const cvRef = useRef(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const updateData = (section, newData) => {
    const updatedData = { ...cvData, [section]: newData };
    setCvData(updatedData);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCvData(initialCVData);
    localStorage.removeItem('user');
  };

  const createNewCV = () => {
    const newCV = {
      ...initialCVData,
      title: `Mon CV ${savedCVs.length + 1}`
    };
    setCvData(newCV);
    setCvTitle(newCV.title);
  };

  const handleDownloadCV = async () => {
    setIsGenerating(true);
    try {
      if (!cvRef.current) throw new Error('Aperçu non trouvé');

      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${cvTitle}.pdf`);

    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('Erreur génération PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Page de login
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Page principale
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white">CV Builder Pro</h1>
            <button
              onClick={() => setShowCVList(!showCVList)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Mes CVs</span>
            </button>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <input
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              className="w-full bg-transparent border-none text-2xl font-bold text-white text-center focus:outline-none"
              placeholder="Titre de votre CV"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={createNewCV}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau CV</span>
            </button>
            
            <button
              onClick={handleDownloadCV}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Génération...' : 'Télécharger PDF'}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm">{user.name || 'Utilisateur'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bannière de statut */}
      <div className="bg-green-600 text-white p-2 text-center text-sm font-medium">
        ✅ Connecté en tant que <strong>{user.name}</strong>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="w-1/2 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <FormSection data={cvData} updateData={updateData} />
        </div>
        <div className="w-1/2 bg-gray-800 overflow-y-auto">
          <CVPreview ref={cvRef} data={cvData} />
        </div>
      </div>
    </div>
  );
}

export default App;