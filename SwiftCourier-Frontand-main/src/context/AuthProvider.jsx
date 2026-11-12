import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/Api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify and sync current user on load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api
        .get('/api/v1/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token invalid/expired
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password });
    const { access_token, refresh_token, user: userData } = res.data.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (payload) => {
    const res = await api.post('/api/v1/auth/register', payload);
    return res.data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/v1/auth/logout', { refresh_token: refreshToken });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const authInfo = {
    user,
    setUser,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext);
