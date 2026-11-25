import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/Api';

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

  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (!token) return;

    api.get('/api/v1/users/me')
      .then((res) => {
        if (res.data) {
          localStorage.setItem('sc_user', JSON.stringify(res.data));
          setUser(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem('sc_token');
          localStorage.removeItem('sc_user');
          setUser(null);
        }
      });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData) => {
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
    updateUser,
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
