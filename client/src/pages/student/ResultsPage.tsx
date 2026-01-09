import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function ResultsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="border-b border-red-900/30 pb-6">
                    <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                        <span className="text-red-600">Histórico</span> de Avaliações
                    </h1>
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                        Acompanhe seu desempenho ao longo do tempo
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-mono uppercase">Avaliações Feitas</p>
                                <p className="text-3xl font-black italic text-white">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-mono uppercase">Média Geral</p>
                                <p className="text-3xl font-black italic text-white">--%</p>
                            </div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-mono uppercase">Melhor Nota</p>
                                <p className="text-3xl font-black italic text-white">--%</p>
                            </div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-mono uppercase">Tempo Médio</p>
                                <p className="text-3xl font-black italic text-white">--min</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* No Data Card */}
                <div className="gaming-card bg-[#0a0a0a] border-2 border-red-900/50 p-16 text-center">
                    <svg className="w-32 h-32 mx-auto mb-8 text-red-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-3xl font-black italic text-white uppercase mb-4">
                        Nenhuma Avaliação Registrada
                    </h2>
                    <p className="text-gray-400 font-mono max-w-2xl mx-auto mb-8">
                        Seu histórico de avaliações aparecerá aqui. Complete sua primeira avaliação para começar a acompanhar seu progresso e desempenho ao longo do tempo.
                    </p>
                    <a href="/student/test" className="inline-block btn-gaming bg-red-700 hover:bg-red-600 border-red-500">
                        FAZER PRIMEIRA AVALIAÇÃO
                    </a>
                </div>

                {/* Future: Results List */}
                {/* 
                <div className="space-y-4">
                    <h3 className="text-xl font-black italic text-white uppercase flex items-center gap-3">
                        <div className="w-1 h-6 bg-red-600"></div>
                        Últimas Avaliações
                    </h3>
                    
                    // Results will be listed here
                    // Each result card will show: date, score, time, category, etc.
                </div>
                */}
            </div>
        </DashboardLayout>
    );
}
