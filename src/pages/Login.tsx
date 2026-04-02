import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { Lock, Mail, Shield, User as UserIcon, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useLocaleStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login logic
    setTimeout(() => {
      login({
        id: Math.random().toString(36).substr(2, 9),
        name: role === 'ADMIN' ? 'Admin Master' : 'Colaborador Pulso',
        email: email || (role === 'ADMIN' ? 'admin@pulsorh.com' : 'user@pulsorh.com'),
        role: role,
        avatar:
          role === 'ADMIN'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop',
      });
      setIsLoading(false);
      navigate(role === 'ADMIN' ? '/dashboard' : '/dashboard'); // Redirect to a safe start
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10 border border-white">
        {/* Left Side: Branding / Marketing */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-signature-gradient relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 border-8 border-white rounded-full"></div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="material-symbols-outlined text-primary text-3xl font-black">
                pulse_alert
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Pulso<span className="text-white/80">RH</span>
            </h1>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight">
              Transforme o clima da sua{' '}
              <span className="underline decoration-white/30 decoration-8 underline-offset-8">
                empresa
              </span>
              .
            </h2>
            <p className="text-white/80 text-lg font-medium max-w-md">
              Acompanhe em tempo real o engajamento e a satisfação do seu time com nossa plataforma
              de Gestão de RH.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 pt-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                </div>
              ))}
            </div>
            <p className="text-white text-sm font-bold">+2.500 colaboradores impactados</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-on-surface mb-2 font-headline">
              {t('auth.title')}
            </h3>
            <p className="text-slate-500 font-medium">{t('auth.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t('auth.email_label')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all outline-none text-on-surface font-medium"
                  placeholder={t('auth.email_placeholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t('auth.password_label')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 transition-all outline-none text-on-surface font-medium"
                  placeholder={t('auth.password_placeholder')}
                />
              </div>
            </div>

            {/* Role Switcher (Mock for Demo/Test) */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {t('auth.select_role')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    role === 'ADMIN'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${role === 'ADMIN' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-1">Administrador</p>
                    <p className="text-[10px] opacity-70 font-medium">{t('auth.admin_role')}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    role === 'USER'
                      ? 'border-secondary bg-secondary/5 text-secondary'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${role === 'USER' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-1">Colaborador</p>
                    <p className="text-[10px] opacity-70 font-medium">{t('auth.user_role')}</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70"
            >
              <span className="relative z-10">
                {isLoading ? t('common.loading') : t('auth.login_button')}
              </span>
              {!isLoading && (
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform relative z-10" />
              )}
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out"></div>
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 font-medium">
            PulsoRH &copy; 2024. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
