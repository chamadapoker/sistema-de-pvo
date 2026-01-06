import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function ResultsPage() {
    const mockResults = [
        {
            id: 1,
            testName: 'Teste Livre',
            date: '2026-01-05',
            score: 85,
            correctAnswers: 17,
            totalQuestions: 20,
            time: '5:30',
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meus Resultados</h1>
                    <p className="text-gray-600 mt-2">
                        Acompanhe seu histórico e desempenho
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Total de Testes</p>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Média Geral</p>
                        <p className="text-3xl font-bold text-green-600">0%</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Melhor Nota</p>
                        <p className="text-3xl font-bold text-blue-600">0%</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Tempo Médio</p>
                        <p className="text-3xl font-bold text-purple-600">0:00</p>
                    </div>
                </div>

                {/* Results Table */}
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
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
                                        Acertos
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
                                {mockResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="text-6xl mb-4">📊</div>
                                            <p className="text-gray-600">
                                                Você ainda não realizou nenhum teste
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    mockResults.map((result) => (
                                        <tr key={result.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {result.testName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(result.date).toLocaleDateString('pt-BR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${result.score >= 70
                                                            ? 'bg-green-100 text-green-800'
                                                            : result.score >= 50
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {result.score}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {result.correctAnswers}/{result.totalQuestions}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {result.time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-primary-600 hover:text-primary-900">
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
