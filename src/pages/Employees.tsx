import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLocaleStore } from '../store/useLocaleStore';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Download,
} from 'lucide-react';

// Mock data for employees
const MOCK_EMPLOYEES = [
  {
    id: '1',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@pulsorh.com',
    role: 'ADMIN',
    department: 'HR',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Bruno Santos',
    email: 'bruno.santos@pulsorh.com',
    role: 'USER',
    department: 'Engineering',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1287&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Carla Lima',
    email: 'carla.lima@pulsorh.com',
    role: 'USER',
    department: 'Sales',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Diego Costa',
    email: 'diego.costa@pulsorh.com',
    role: 'USER',
    department: 'Marketing',
    status: 'Inactive',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    email: 'elena.r@pulsorh.com',
    role: 'ADMIN',
    department: 'Operations',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop',
  },
];

const Employees: React.FC = () => {
  const { t } = useLocaleStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = MOCK_EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title={t('employees.title') || 'Colaboradores'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-blue-900 leading-tight">
                {t('employees.management') || 'Gestão de Talentos'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {t('employees.subtitle', { count: MOCK_EMPLOYEES.length }) ||
                  `Acompanhe e gerencie ${MOCK_EMPLOYEES.length} colaboradores.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/30 text-slate-600 font-bold hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              <span>{t('employees.add_new') || 'Novo Colaborador'}</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('employees.search_placeholder') || 'Buscar por nome ou e-mail...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low text-slate-600 font-bold hover:bg-surface-container transition-all">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant/20 hidden md:block mx-2"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {filteredEmployees.length} resultados
            </p>
          </div>
        </div>

        {/* Employee Grid/List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    emp.status === 'Active'
                      ? 'bg-success/10 text-success'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                </div>
                <div className="pt-1">
                  <h3 className="font-black text-lg text-blue-900 leading-tight group-hover:text-primary transition-colors">
                    {emp.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      {emp.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    {emp.role}
                    {emp.role === 'ADMIN' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                <button className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-75 flex items-center gap-1">
                  Ver Perfil
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-slate-200" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Nenhum colaborador encontrado</h4>
                <p className="text-sm text-slate-500">Tente buscar por um termo diferente.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Employees;
