import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useCreateUser, type UserInput } from '../hooks/useUsers';
import { useDepartments } from '../hooks/useDepartments';
import {
  UserPlus,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Copy,
  X,
  Loader2,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../types';

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { data: departments = [] } = useDepartments();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState<UserInput>({
    name: '',
    email: '',
    role: 'USER',
    departmentId: '',
  });

  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8) + '!' + Math.floor(Math.random() * 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createUserMutation.isPending) return;

    try {
      const password = generateRandomPassword();
      await createUserMutation.mutateAsync({ ...formData, password });
      setGeneratedPassword(password);
      setSuccess(true);
    } catch {
      alert('Erro ao criar colaborador. O e-mail pode já estar em uso.');
    }
  };

  const copyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      alert('Senha copiada!');
    }
  };

  if (success) {
    return (
      <Layout title="Cadastro Concluído">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-8 shadow-xl shadow-success/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-black text-blue-900 mb-4 text-center">
            Colaborador Cadastrado!
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-md font-medium">
            O acesso de <b>{formData.name}</b> foi criado com sucesso. Como solicitado, aqui está a
            senha temporária gerada pelo sistema:
          </p>

          <div className="w-full bg-slate-900 rounded-[2rem] p-10 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Senha Temporária
              </span>
              <div className="flex items-center gap-4">
                <code className="text-4xl font-black text-white tracking-widest">
                  {generatedPassword}
                </code>
                <button
                  onClick={copyPassword}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <p className="text-white/80 text-xs font-medium">
                Lembre-se de anotar ou copiar esta senha agora. Por segurança, ela não será exibida
                novamente.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/employees')}
            className="mt-12 bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
          >
            Voltar para Lista
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Contratar Talento">
      <div className="max-w-4xl mx-auto space-y-10 py-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tight leading-none mb-2">
              Novo Colaborador
            </h2>
            <p className="text-slate-500 font-medium font-body uppercase text-[10px] tracking-widest">
              Cadastro Operacional RH Authority
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Name */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nome Completo
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="employee-name"
                      name="employee-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: João Silva"
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    E-mail Corporativo
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="employee-email"
                      name="employee-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="joao@empresa.com"
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Perfil de Acesso
                  </label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <select
                      id="employee-role"
                      name="employee-role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value as UserRole })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-10 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900 appearance-none"
                    >
                      <option value="USER">Colaborador (Responder)</option>
                      <option value="HR">RH (Gerenciar Pesquisas)</option>
                      <option value="ADMIN">Admin Master (Acesso Total)</option>
                    </select>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Departamento
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <select
                      id="employee-department"
                      name="employee-department"
                      required
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-10 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-blue-900 appearance-none"
                    >
                      <option value="">Selecione um Setor</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between gap-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate('/employees')}
                  className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors px-4 py-2"
                >
                  <X className="w-5 h-5" />
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-1 max-w-[300px] bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {createUserMutation.isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      Finalizar Contratação
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;
