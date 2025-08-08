import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../../auth/AuthContext";

interface HeaderSectionProps {
  scrollToSection: (sectionId: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenLoginModal: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  scrollToSection,
  isMenuOpen,
  setIsMenuOpen,
  onOpenLoginModal,
}) => {

  const { logout, isAuthenticated, user } = useAuth();
  const [authKey, setAuthKey] = useState(0); // Para forzar re-render

  // Efecto para estar pendiente de los cambios en isAuthenticated
  useEffect(() => {
    // Forzar re-render cuando cambie la autenticación
    setAuthKey(prev => prev + 1);
    
    // Solo cerrar el menú si el usuario se desautentica Y el menú está abierto
    if (!isAuthenticated && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Menú Hamburguesa */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`text-white p-4 rounded-full transition-all duration-500 z-50 backdrop-blur-sm hover:bg-white/10 hover:scale-110 ${isMenuOpen ? 'bg-white/20' : ''}`}
          >
            <div className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-90' : ''}`}>
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </div>
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <div key={`sidebar-${authKey}`} className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/98 to-black/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h2 className="text-3xl font-bold text-white tracking-wider">CUENTA</h2>
          </div>

          {/* Navegación Principal */}
          <div className="flex-1 p-8">

            {/* Autenticación */}
            <div className="space-y-1">
              {!isAuthenticated ? (
                <button
                  onClick={() => { 
                    onOpenLoginModal(); 
                    setIsMenuOpen(false); 
                  }}
                  className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
                >
                  INICIAR SESIÓN
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="w-full text-left text-white/80 p-6 rounded-2xl text-lg font-medium">
                    Bienvenido, {user?.username || 'Usuario'}
                  </div>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
                  >
                    CERRAR SESIÓN
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer del Sidebar */}
          <div className="p-8 border-t border-white/10">
            <div className="flex items-center justify-between text-white/40 text-sm font-medium">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                <span className="tracking-wide">Proyecto de admisión</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderSection;