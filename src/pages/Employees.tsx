import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLocaleStore } from '../store/useLocaleStore';
import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useDepartments } from '../hooks/useDepartments';
import {
  Users,
  Search,
  Plus,
  Mail,
  ChevronRight,
  ShieldCheck,
  Download,
  Loader2,
  Trash2,
  Building2,
  CheckCircle2,
  X,
  Edit2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/config';
import { useAuthStore } from '../store/useAuthStore';

const Employees: React.FC = () => {
  const { t } = useLocaleStore();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const { data: employees = [], isLoading } = useUsers();
  const { data: departments = [] } = useDepartments();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');

  const isAdmin = currentUser?.role === 'ADMIN';

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este colaborador?')) {
      await deleteUserMutation.mutateAsync(id);
    }
  };

  const handleQuickEdit = async (userId: string) => {
    if (!selectedDeptId) return;
    try {
      // Create a temporary mutation with the correct ID
      await updateUserMutation.mutateAsync({
        id: userId,
        departmentId: selectedDeptId,
      });
      setEditingUserId(null);
      setSelectedDeptId('');
    } catch {
      alert('Erro ao atualizar departamento.');
    }
  };

  if (isLoading) {
    return (
      <Layout title={t('employees.title') || 'Colaboradores'}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-bold">Carregando quadro de colaboradores...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t('employees.title') || 'Colaboradores'}>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-sm">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-blue-900 tracking-tight leading-tight">
                {t('employees.management') || 'Gestão de Talentos'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Sincronizado com o ecossistema PulsoRH Authority.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-outline-variant/30 text-slate-600 font-bold hover:bg-slate-50 transition-all">
              <Download className="w-5 h-5" />
              <span>Relatórios</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate(ROUTES.EMPLOYEES_NEW)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-primary text-on-primary font-black shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>{t('employees.add_new') || 'Admitir Talento'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center mx-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="text"
              placeholder={
                t('employees.search_placeholder') || 'Buscar colaborador por nome ou e-mail...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-blue-900"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              {filteredEmployees.length} Registros
            </p>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-primary/10 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div
                className="absolute top-0 left-0 w-full h-1.5 opacity-50"
                style={{ backgroundColor: emp.department?.color || '#cbd5e1' }}
              ></div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    emp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}
                  ></div>
                  {emp.status}
                </span>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <img
                    src={
                      emp.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`
                    }
                    alt={emp.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-1 overflow-hidden">
                  <h3 className="font-black text-xl text-blue-900 leading-tight group-hover:text-primary transition-colors truncate">
                    {emp.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: emp.department?.color || '#cbd5e1' }}
                    ></div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 truncate">
                      {emp.department?.name || 'Sem Setor'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Mail className="w-5 h-5 text-slate-300" />
                  <span className="text-sm font-bold truncate text-blue-900">{emp.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-slate-300" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-900">
                      {emp.role}
                    </span>
                    {emp.role === 'ADMIN' && (
                      <span className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-tighter rounded-md border border-primary/10">
                        Master
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Edit (HR/Admin Only) */}
              {editingUserId === emp.id ? (
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Alterar Setor
                    </span>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="text-slate-400 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full bg-white border-none rounded-xl px-3 py-2 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Selecione...</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleQuickEdit(emp.id)}
                      className="w-full bg-primary text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Salvar Alteração
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUserId(emp.id);
                        setSelectedDeptId(emp.departmentId || '');
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-primary/5 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Ajustar Setor
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 text-slate-300 hover:text-error hover:bg-error/5 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 text-primary hover:translate-x-1 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Detalhes
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center">
                <Users className="w-12 h-12 text-slate-200" />
              </div>
              <div className="max-w-xs">
                <h4 className="font-black text-xl text-blue-900">Nenhum talento encontrado</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Os filtros ou termos de busca não retornaram resultados na base de dados.
                </p>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Employees;
