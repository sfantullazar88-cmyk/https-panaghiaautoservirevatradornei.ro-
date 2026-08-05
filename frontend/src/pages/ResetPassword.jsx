 import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

import { authApi } from '../services/adminApi';

const ResetPassword = () => {
  const [step, setStep] = useState('request');

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const requestReset = async (event) => {
    event.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const response =
        await authApi.requestPasswordReset(
          normalizedEmail
        );

      setEmail(normalizedEmail);

      setMessage(
        response?.message ||
          'Dacă emailul există, veți primi instrucțiuni pentru resetarea parolei.'
      );

      setStep('confirm');
    } catch (err) {
      setError(
        err?.message ||
          'Emailul de resetare nu a putut fi trimis.'
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (event) => {
    event.preventDefault();

    clearMessages();

    const cleanToken = token.trim();

    if (!cleanToken) {
      setError(
        'Introduceți codul primit pe email.'
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'Parola trebuie să aibă minimum 8 caractere.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Parolele nu coincid.');
      return;
    }

    setLoading(true);

    try {
      const response =
        await authApi.confirmPasswordReset(
          cleanToken,
          newPassword
        );

      setMessage(
        response?.message ||
          'Parola a fost resetată cu succes.'
      );

      setNewPassword('');
      setConfirmPassword('');
      setToken('');
      setStep('success');
    } catch (err) {
      setError(
        err?.message ||
          'Parola nu a putut fi resetată.'
      );
    } finally {
      setLoading(false);
    }
  };

  const restartReset = () => {
    clearMessages();
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('request');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >
            <div className="w-14 h-14 bg-[#D4A847] rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-2xl font-bold text-white">
                Panaghia
              </span>

              <span className="text-xs text-gray-400">
                Recuperare parolă
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Resetarea parolei
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />

              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />

              <p className="text-green-400 text-sm">
                {message}
              </p>
            </div>
          )}

          {step === 'request' && (
            <form
              onSubmit={requestReset}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Adresa de email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    autoComplete="email"
                    placeholder="email@exemplu.ro"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#D4A847]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4A847] text-white py-3 rounded-xl hover:bg-[#c49a3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Se trimite...'
                  : 'Trimite codul de resetare'}
              </button>
            </form>
          )}

          {step === 'confirm' && (
            <form
              onSubmit={confirmReset}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Codul primit pe email
                </label>

                <input
                  type="text"
                  value={token}
                  onChange={(event) =>
                    setToken(event.target.value)
                  }
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Introduceți codul"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#D4A847]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Parola nouă
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimum 8 caractere"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#D4A847]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Confirmă parola nouă
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Repetați parola"
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#D4A847]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4A847] text-white py-3 rounded-xl hover:bg-[#c49a3d] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Se verifică...'
                  : 'Resetează parola'}
              </button>

              <button
                type="button"
                onClick={restartReset}
                disabled={loading}
                className="w-full text-sm text-gray-400 hover:text-[#D4A847] disabled:opacity-50"
              >
                Trimite codul din nou
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center">
              <p className="text-gray-300 mb-5">
                Parola nouă este activă.
              </p>

              <Link
                to="/admin/login"
                className="inline-block w-full bg-[#D4A847] text-white py-3 rounded-xl hover:bg-[#c49a3d] transition-colors font-medium"
              >
                Mergi la autentificare
              </Link>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <Link
                to="/admin/login"
                className="text-[#D4A847] hover:underline text-sm"
              >
                ← Înapoi la autentificare
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;