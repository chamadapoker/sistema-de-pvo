import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function TestManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gerenciar Testes
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Crie e gerencie testes padrão para os alunos
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn btn-primary"
                    >
                        {showCreateForm ? 'Cancelar' : '+ Criar Teste'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Novo Teste Padrão
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Teste
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: Teste de Tanques - Nível 1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    className="input"
                                    rows={3}
                                    placeholder="Descrição do teste..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duração (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="30"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de Questões
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="20"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Equipamentos
                                </label>
                                <div className="border border-gray-300 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selecione os equipamentos que farão parte deste teste
                                    </p>
                                    <div className="text-center py-8 text-gray-500">
                                        Nenhum equipamento disponível
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button type="submit" className="btn btn-primary">
                                    Criar Teste
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tests List */}
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Questões
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duração
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Realizações
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="text-6xl mb-4">📝</div>
                                        <p className="text-gray-600">
                                            Nenhum teste criado ainda
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
