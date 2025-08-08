import React, { createContext, useContext, useState, useEffect } from 'react';
import * as segService from './service/segServices';

interface User {
  username: string;
  password: string;
  // Agregar propiedades adicionales si las hay en la respuesta
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authKey, setAuthKey] = useState(0); // Para forzar re-render

  // Función para verificar si el token es válido
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Aquí podrías agregar lógica adicional para verificar la validez del token
      // Por ejemplo, verificar si no ha expirado
      return true;
    } catch (error) {
      return false;
    }
  };

  // Efecto para forzar re-render cuando cambie user
  useEffect(() => {
    setAuthKey(prev => prev + 1);
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token && isTokenValid()) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        // Limpiar datos corruptos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (!isTokenValid()) {
      // Limpiar si el token no es válido
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await segService.login({ username, password });
    
    if (response.success) {
      if (response.data?.token && response.data?.user) {
        
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        return true;
      } else {
        throw new Error('Respuesta de API inválida tras un inicio de sesión exitoso.');
      }
    } else {
      throw new Error(response.message || 'Ocurrió un error desconocido.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Verificar si el usuario está autenticado basado en user y token válido
  const isAuthenticated = !!user && isTokenValid();

  return (
    <AuthContext.Provider key={authKey} value={{
      user,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};