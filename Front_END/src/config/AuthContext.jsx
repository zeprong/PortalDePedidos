import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// Definimos el contexto de autenticación con sus métodos
export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Al montar, cargamos el usuario desde localStorage (si existe)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('usuario');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  }, []);

  // Función para iniciar sesión: guarda en estado y en localStorage
  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem('usuario', JSON.stringify(userData));
  };

  // Función para cerrar sesión: limpia estado y localStorage
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  };

  // Memorizar el valor del contexto para evitar re-renderes innecesarios
  const value = useMemo(
    () => ({ user, setUser, signIn, signOut }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 