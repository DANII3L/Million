import React, { useState, useEffect } from 'react';

import HeaderSection from './components/HeaderSection';
import HeroSection from './components/HeroSection';
import LoginModal from '../auth/components/LoginModal';
import { useAuth } from '../auth/AuthContext';
import ObjetosList from '../propiedades/components/ObjetosList';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authKey, setAuthKey] = useState(0); // Para forzar re-render
  const { isAuthenticated, user } = useAuth();

  // Efecto para estar pendiente de los cambios en isAuthenticated
  useEffect(() => {
    
    // Forzar re-render cuando cambie la autenticación
    setAuthKey(prev => prev + 1);
    
    // Si el usuario se desautentica, limpiar estados
    if (!isAuthenticated) {
      setIsMenuOpen(false);
      setIsLoginModalOpen(false);
    }
  }, [isAuthenticated, user]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1a2e29] to-[#2d4f4a]">
      {/* Header */}
      <HeaderSection
        scrollToSection={scrollToSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenLoginModal={handleOpenLoginModal}
      />

      {/* Contenido Principal - Ocupa todo el espacio disponible */}
      {isAuthenticated ? (
        <main key={`authenticated-${authKey}`} className="flex-1 relative flex items-center justify-center">
          <ObjetosList />
        </main>
      ) : (
        <main key={`unauthenticated-${authKey}`} className="flex-1 relative">
          <HeroSection />
        </main>
      )}

      {/* Footer - Altura fija */}
      <footer className="bg-black/70 border-t border-black/10 py-4 flex-shrink-0">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Proyecto Admisión Million. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modales de Autenticación */}
      {!isAuthenticated && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLoginModal}
        />
      )}
    </div>
  );
};

export default LandingPage;