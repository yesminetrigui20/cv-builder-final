import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ArrowLeft, Settings, Download } from 'lucide-react';

const Header = ({ user, onLogout, onShowLogin }) => {
  const [cvTitle, setCvTitle] = useState('Mon CV');

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
       
        {/* Partie gauche */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        
        {/* Partie centrale - Titre du CV */}
        <div className="flex items-center space-x-4">
          <Input
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            placeholder="Mon CV"
            className="bg-transparent border-none text-lg font-semibold text-white text-center focus:ring-0 focus:border-none w-64"
          />
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Partie droite - Actions utilisateur */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                onClick={onLogout}
                variant="outline" 
                size="sm" 
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                Déconnexion
              </Button>
              <div className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm">{user.name || 'Utilisateur'}</span>
              </div>
            </>
          ) : (
            <Button 
              onClick={onShowLogin}
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

// ✅ EXPORT DEFAULT CORRECT
export default Header;