 import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authApi } from '../services/adminApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth trebuie folosit în interiorul AuthProvider'
    );
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearStoredAuth = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const saveAuthentication = (response) => {
    if (
      !response?.access_token ||
      !response?.refresh_token ||
      !response?.user
    ) {
      throw new Error(
        'Răspunsul de autentificare este incomplet.'
      );
    }

    localStorage.setItem(
      'adminToken',
      response.access_token
    );

    localStorage.setItem(
      'refreshToken',
      response.refresh_token
    );

    localStorage.setItem(
      'adminUser',
      JSON.stringify(response.user)
    );

    setUser(response.user);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        clearStoredAuth();
      }
    } else {
      clearStoredAuth();
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);

    try {
      const response = await authApi.login(
        email.trim().toLowerCase(),
        password
      );

      if (!response.otp_required) {
        saveAuthentication(response);
      }

      return response;
    } catch (err) {
      const message =
        err?.message || 'Eroare la autentificare';

      setError(message);
      throw new Error(message);
    }
  };

  const verifyOtp = async (email, code) => {
    setError(null);

    try {
      const response = await authApi.verifyOtp(
        email.trim().toLowerCase(),
        code.trim()
      );

      saveAuthentication(response);

      return response;
    } catch (err) {
      const message =
        err?.message || 'Codul OTP nu a putut fi verificat';

      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (token) {
        await authApi.logout();
      }
    } catch (err) {
      // Deconectarea locală continuă chiar dacă serverul nu răspunde.
    } finally {
      clearStoredAuth();
      setError(null);
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken =
      localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      clearStoredAuth();
      return null;
    }

    try {
      const response = await authApi.refresh(
        storedRefreshToken
      );

      saveAuthentication(response);

      return response;
    } catch (err) {
      clearStoredAuth();
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    verifyOtp,
    logout,
    refreshToken: refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;