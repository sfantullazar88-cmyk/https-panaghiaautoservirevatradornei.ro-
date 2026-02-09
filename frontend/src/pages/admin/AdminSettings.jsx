import React, { useState } from 'react';
import { Save, Lock, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/adminApi';

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Parolele nu coincid' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Parola nouă trebuie să aibă minim 8 caractere' });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Parola a fost schimbată cu succes!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6" data-testid="admin-settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Setări
        </h1>
        <p className="text-gray-600 mt-1">Gestionează contul și preferințele</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="flex border-b">
          {[
            { id: 'account', label: 'Cont', icon: User },
            { id: 'security', label: 'Securitate', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#D4A847] border-b-2 border-[#D4A847]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Informații Cont</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
              />
              <p className="text-sm text-gray-500 mt-1">Emailul nu poate fi schimbat</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip cont</label>
              <input
                type="text"
                value={user?.is_superadmin ? 'Super Administrator' : 'Administrator'}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4A847]/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#D4A847]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Schimbă Parola</h2>
                <p className="text-sm text-gray-500">Actualizează parola contului tău</p>
              </div>
            </div>

            {message.text && (
              <div className={`mb-4 px-4 py-3 rounded-xl ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parola actuală</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parola nouă</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20"
                />
                <p className="text-sm text-gray-500 mt-1">Minim 8 caractere</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmă parola nouă</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4A847] text-white py-3 rounded-xl hover:bg-[#c49a3d] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Se salvează...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Salvează Parola</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Securitate Cont</h2>
                <p className="text-sm text-gray-500">Informații despre securitatea contului</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Conexiune SSL</p>
                  <p className="text-sm text-gray-500">Datele sunt criptate</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Activ
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Protecție brute-force</p>
                  <p className="text-sm text-gray-500">Blocarea după 5 încercări eșuate</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Activ
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Token JWT</p>
                  <p className="text-sm text-gray-500">Sesiune securizată cu expirare automată</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Activ
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Criptare parole</p>
                  <p className="text-sm text-gray-500">Parolele sunt stocate cu bcrypt</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Activ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
