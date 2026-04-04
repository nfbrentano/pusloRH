import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { ROUTES } from '../routes/config';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';
import type { User } from '../types';

const API_URL = 'http://localhost:3001/api';

const Login: React.FC = () => {
  const { t } = useLocaleStore();
  const { login, isAuthenticated, checkSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated && checkSession()) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, checkSession, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post<{ token: string; user: User }>(`${API_URL}/auth/login`, {
        email,
        password,
      });
      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Não foi possível conectar ao servidor. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center p-6 bg-signature-gradient">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden border border-white/20 backdrop-blur-sm">
        <div className="p-8 md:p-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
              <span
                className="material-symbols-outlined text-white text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pulse_alert
              </span>
            </div>
            <h1 className="text-3xl font-black text-blue-900 tracking-tight">PulsoRH</h1>
            <p className="text-slate-500 font-medium text-center mt-2">{t('auth.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-error/10 text-error p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block ml-1">
                {t('auth.email_label')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  autoComplete="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 transition-all font-medium ${
                    error ? 'focus:ring-error/20' : 'focus:ring-primary/20'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block ml-1">
                {t('auth.password_label')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.password_placeholder')}
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 transition-all font-medium ${
                    error ? 'focus:ring-error/20' : 'focus:ring-primary/20'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:opacity-90 transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  {t('auth.login_button')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-white/60 text-sm font-medium">
        © 2026 PulsoRH • Gestão Inteligente de Pessoas
      </div>
    </div>
  );
};

export default Login;
