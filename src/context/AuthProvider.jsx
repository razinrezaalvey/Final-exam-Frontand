import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setUser(null);
  };

  const authInfo = {
    user,
    setUser,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
