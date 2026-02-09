import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Eroare la autentificare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-[#D4A847] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM6 13V20H18V13C18 10.79 16.21 9 14 9H10C7.79 9 6 10.79 6 13Z"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                Panaghia
              </span>
              <span className="text-xs text-gray-400">Panou Administrare</span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Autentificare Admin
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3" data-testid="login-error">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                  placeholder="admin@example.com"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Parolă
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20 transition-all"
                  placeholder="••••••••"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#D4A847] focus:ring-[#D4A847]"
                />
                <span className="text-sm text-gray-400">Ține-mă minte</span>
              </label>
              <Link to="/admin/reset-password" className="text-sm text-[#D4A847] hover:underline">
                Am uitat parola
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A847] text-white py-3 rounded-xl hover:bg-[#c49a3d] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-button"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Se autentifică...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Autentificare</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              <Link to="/" className="text-[#D4A847] hover:underline">
                ← Înapoi la site
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Lock className="w-4 h-4" />
            <span>Conexiune securizată SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
