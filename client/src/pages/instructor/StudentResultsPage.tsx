import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function StudentResultsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            <span className="text-red-600">Resultados</span> dos Alunos
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                            Acompanhar o desempenho e estatísticas
                        </p>
                    </div>
                    <button className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500">
                        Exportar Relatório
                    </button>
                </div>

                {/* Coming Soon Card */}
                <div className="gaming-card bg-[#0a0a0a] border-2 border-red-900/50 p-16 text-center">
                    <svg className="w-32 h-32 mx-auto mb-8 text-red-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-3xl font-black italic text-white uppercase mb-4">
                        Módulo em Desenvolvimento
                    </h2>
                    <p className="text-gray-400 font-mono max-w-2xl mx-auto">
                        O sistema de acompanhamento de resultados está sendo desenvolvido. Em breve você terá acesso a relatórios completos, gráficos de desempenho e análises detalhadas de cada aluno.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Sistema Offline</span>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Performers */}
                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <h3 className="text-lg font-black italic uppercase text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Top Performers
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-[#0a0a0a] p-3 border-l-2 border-yellow-600">
                                <p className="text-sm text-gray-400 font-mono">Ainda sem dados</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <h3 className="text-lg font-black italic uppercase text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Atividade Recente
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-[#0a0a0a] p-3 border-l-2 border-blue-600">
                                <p className="text-sm text-gray-400 font-mono">Nenhuma atividade registrada</p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <h3 className="text-lg font-black italic uppercase text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            Estatísticas Gerais
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-mono uppercase">Taxa de Aprovação</span>
                                <span className="text-xl font-black text-white">--%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-mono uppercase">Média de Pontos</span>
                                <span className="text-xl font-black text-white">--</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-mono uppercase">Tempo Médio</span>
                                <span className="text-xl font-black text-white">--min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
