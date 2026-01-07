import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function EquipmentManagement() {
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            <span className="text-red-600">Gerenciar</span> Equipamentos
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                            Adicionar, editar e organizar vetores do sistema
                        </p>
                    </div>
                    <button className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500">
                        + Novo Equipamento
                    </button>
                </div>

                {/* Coming Soon Card */}
                <div className="gaming-card bg-[#0a0a0a] border-2 border-red-900/50 p-16 text-center">
                    <svg className="w-32 h-32 mx-auto mb-8 text-red-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2 className="text-3xl font-black italic text-white uppercase mb-4">
                        Módulo em Desenvolvimento
                    </h2>
                    <p className="text-gray-400 font-mono max-w-2xl mx-auto">
                        O sistema de gerenciamento de equipamentos está sendo desenvolvido. Em breve você poderá adicionar, editar e organizar todos os vetores do banco de dados através desta interface.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Sistema Offline</span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-900/20 border border-red-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono uppercase">Total de Equipamentos</p>
                                <p className="text-2xl font-black text-white">1,600+</p>
                            </div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-900/20 border border-yellow-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono uppercase">Categorias</p>
                                <p className="text-2xl font-black text-white">8</p>
                            </div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#111] border border-[#333] p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-900/20 border border-blue-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono uppercase">Com Imagens</p>
                                <p className="text-2xl font-black text-white">100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
