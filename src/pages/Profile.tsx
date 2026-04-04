import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/useAuthStore';
import { useDepartments } from '../hooks/useDepartments';
import api from '../services/api';
import {
  User as UserIcon,
  Mail,
  Lock,
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Loader2,
} from 'lucide-react';
import type { User } from '../types';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const Profile: React.FC = () => {
  const { user, login, token } = useAuthStore();
  const { data: departments = [] } = useDepartments();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [departmentId, setDepartmentId] = useState(user?.departmentId || '');
  const [profileStatus, setProfileStatus] = useState<FormStatus>('idle');
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<FormStatus>('idle');
  const [passwordError, setPasswordError] = useState('');

  // Reset local state when user changes (e.g. after update or logout/login)
  // We use the 'key' pattern on the content div below to handle this automatically.
  // This avoids the 'set-state-in-effect' warning and causes a clean reset.

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileStatus('loading');
    setProfileError('');
    try {
      const { data: updated } = await api.put<User>(`/users/${user.id}`, {
        name,
        email: user.email,
        role: user.role,
        status: user.status,
        departmentId: departmentId || undefined,
      });
      // Update auth store with new user data (keep same token)
      login(updated, token!);
      setProfileStatus('success');
      setTimeout(() => setProfileStatus('idle'), 3000);
    } catch {
      setProfileStatus('error');
      setProfileError('Não foi possível salvar as alterações. Tente novamente.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setPasswordStatus('loading');
    try {
      // Verify current password by attempting login first
      await api.post('/auth/login', { email: user.email, password: currentPassword });
      // If login succeeds, update password
      await api.put(`/users/${user.id}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: newPassword,
      });
      setPasswordStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    } catch {
      setPasswordStatus('error');
      setPasswordError('Senha atual incorreta ou erro ao atualizar. Tente novamente.');
    }
  };

  const currentDept = departments.find((d) => d.id === departmentId);

  const roleLabel: Record<string, { label: string; color: string }> = {
    ADMIN: { label: 'Administrador', color: 'bg-red-50 text-red-600 border-red-100' },
    HR: { label: 'Recursos Humanos', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    USER: { label: 'Colaborador', color: 'bg-green-50 text-green-600 border-green-100' },
  };

  const role = roleLabel[user?.role || 'USER'];

  return (
    <Layout title="Meu Perfil">
      <div key={user?.id} className="max-w-3xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-slate-200/80">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop'
                }
                className="w-full h-full object-cover"
                alt={user?.name}
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tight leading-tight">
              {user?.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${role.color}`}
              >
                {role.label}
              </span>
              <span className="text-slate-400 text-sm font-medium">{user?.email}</span>
            </div>
            {currentDept && (
              <p className="text-slate-400 text-xs mt-1 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {currentDept.name}
              </p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/80 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-black text-blue-900">Informações Pessoais</h3>
              <p className="text-xs text-slate-400 font-medium">Atualize seu nome e departamento</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="p-8 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Nome Completo
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                E-mail (não alterável)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full bg-slate-100 text-slate-400 border-none rounded-2xl pl-12 pr-4 py-4 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Departamento
              </label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-10 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900 appearance-none"
                >
                  <option value="">Sem departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Feedback */}
            {profileStatus === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{profileError}</p>
              </div>
            )}
            {profileStatus === 'success' && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">Perfil atualizado com sucesso!</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileStatus === 'loading'}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
              >
                {profileStatus === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* Password Form */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/80 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-black text-blue-900">Segurança</h3>
              <p className="text-xs text-slate-400 font-medium">Altere sua senha de acesso</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Senha Atual
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Sua senha atual"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Nova Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength indicator */}
              {newPassword && (
                <div className="flex gap-1.5 mt-2 px-1">
                  {[...Array(4)].map((_, i) => {
                    const strength = [
                      newPassword.length >= 8,
                      /[A-Z]/.test(newPassword),
                      /[0-9]/.test(newPassword),
                      /[^A-Za-z0-9]/.test(newPassword),
                    ].filter(Boolean).length;
                    return (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i < strength
                            ? strength <= 1
                              ? 'bg-red-400'
                              : strength <= 2
                                ? 'bg-orange-400'
                                : strength <= 3
                                  ? 'bg-yellow-400'
                                  : 'bg-green-500'
                            : 'bg-slate-100'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Confirmar Nova Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 py-4 focus:ring-2 transition-all font-medium ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'focus:ring-red-300 ring-2 ring-red-200'
                      : 'focus:ring-primary/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {passwordStatus === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{passwordError}</p>
              </div>
            )}
            {passwordStatus === 'success' && (
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">Senha alterada com sucesso!</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordStatus === 'loading'}
                className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-slate-800/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
              >
                {passwordStatus === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Alterar Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
