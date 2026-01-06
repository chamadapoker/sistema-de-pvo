import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function StudentResultsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Resultados dos Alunos
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Acompanhe o desempenho de todos os alunos
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Total de Alunos</p>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Testes Realizados</p>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Média Geral</p>
                        <p className="text-3xl font-bold text-green-600">0%</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Taxa de Aprovação</p>
                        <p className="text-3xl font-bold text-purple-600">0%</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Buscar Aluno
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Nome ou email..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teste
                            </label>
                            <select className="input">
                                <option value="">Todos os testes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Período
                            </label>
                            <select className="input">
                                <option value="">Todos os períodos</option>
                                <option value="today">Hoje</option>
                                <option value="week">Última semana</option>
                                <option value="month">Último mês</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aluno
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teste
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tempo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-6xl mb-4">📊</div>
                                        <p className="text-gray-600">
                                            Nenhum resultado disponível
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
