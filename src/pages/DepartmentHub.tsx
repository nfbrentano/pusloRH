import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '../hooks/useDepartments';
import { Building2, Plus, Trash2, Activity, Users, Loader2, AlertCircle, Hash } from 'lucide-react';

const DepartmentHub: React.FC = () => {
  const { data: departments = [], isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('#3b82f6');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    try {
      await createMutation.mutateAsync({
        name: newDeptName.trim(),
        color: newDeptColor,
      });
      setNewDeptName('');
      setIsAdding(false);
    } catch {
      alert('Erro ao criar departamento. O nome pode já existir.');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir este departamento? Ele não pode ter colaboradores vinculados.'
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        alert('Não foi possível excluir. Verifique se existem colaboradores neste departamento.');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout title="Hub de Departamentos">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-bold">Carregando setores corporativos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Hub de Departamentos">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-blue-900 tracking-tight">
                Hub de Departamentos
              </h2>
              <p className="text-slate-500 font-medium">
                Gerencie a estrutura organizacional da sua empresa.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
              isAdding
                ? 'bg-slate-100 text-slate-600 shadow-none'
                : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/30'
            }`}
          >
            {isAdding ? (
              'Cancelar'
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Novo Setor
              </>
            )}
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-[2rem] p-8 shadow-xl border border-primary/5 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                  Nome do Departamento
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="Ex: Tecnologia, Vendas..."
                    className="w-full bg-slate-50 border-none rounded-xl pl-11 pr-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                  Cor de Identificação
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                  <input
                    type="color"
                    value={newDeptColor}
                    onChange={(e) => setNewDeptColor(e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <span className="font-mono text-sm font-bold text-slate-500 uppercase">
                    {newDeptColor}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
                Adicionar Setor
              </button>
            </div>
          </form>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: dept.color }}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 text-slate-300 hover:text-error hover:bg-error/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-blue-900 group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                    Estrutura Organizacional
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">
                      {dept._count?.users || 0} Colaboradores
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-success uppercase tracking-tighter">
                      Ativo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {departments.length === 0 && !isAdding && (
            <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-300" />
              <div className="text-center">
                <h4 className="font-bold text-slate-900">Nenhum departamento cadastrado</h4>
                <p className="text-sm text-slate-500">
                  Comece adicionando a estrutura da sua empresa.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentHub;
