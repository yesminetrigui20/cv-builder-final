import React, { useState } from 'react';
import GoogleLogin from './GoogleLogin';
import LinkedInLogin from './LinkedInLogin';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    try {
      console.log('✅ Google response:', response);
      
      const userData = {
        id: 'user_' + Date.now(),
        name: response.credentials?.name || 'Utilisateur Google',
        email: response.credentials?.email || 'user@gmail.com',
        picture: response.credentials?.picture,
        provider: 'google'
      };
      
      // Essayer le backend
      try {
        const backendResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          userData.id = backendData.user.id || userData.id;
        }
      } catch (error) {
        console.log('Backend non disponible, mode local activé');
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
      
    } catch (error) {
      console.error('Erreur connexion Google:', error);
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
      console.error('Erreur connexion LinkedIn:', error);
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

export default LoginPage;