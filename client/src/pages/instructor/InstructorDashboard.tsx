import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';

export function InstructorDashboard() {
    const { user } = useAuthStore();

    const menuItems = [
        {
            title: 'Gerenciar Equipamentos',
            description: 'Adicionar, editar e organizar equipamentos',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            link: '/instructor/equipment',
            color: 'yellow',
        },
        {
            title: 'Criar Testes',
            description: 'Criar testes padrão para os alunos',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: '/instructor/tests',
            color: 'green',
        },
        {
            title: 'Resultados dos Alunos',
            description: 'Acompanhar o desempenho dos alunos',
            icon: (
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            link: '/instructor/student-results',
            color: 'purple',
        },
    ];

    const stats = [
        { label: 'Equipamentos', value: '0', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'yellow' },
        { label: 'Testes Criados', value: '0', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'green' },
        { label: 'Alunos Ativos', value: '0', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'blue' },
        { label: 'Média Geral', value: '0%', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'purple' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Welcome Section */}
                <div className="relative gaming-card group bg-gradient-to-br from-red-900/20 via-[#0a0a0a] to-black border-2 border-red-900/50 p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-10"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <div>
                                <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                                    Bem-vindo, <span className="text-red-600">{user?.name}</span>!
                                </h1>
                                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mt-1">
                                    Painel de Comando <span className="text-red-600">█</span> Modo Instrutor
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="gaming-card bg-[#0a0a0a] border border-[#333] p-6 hover:border-red-600 transition-all group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className="text-4xl font-black italic text-white group-hover:text-red-600 transition-colors">{stat.value}</p>
                                </div>
                                <svg className="w-10 h-10 text-gray-700 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                </svg>
                            </div>
                            <div className="mt-4 h-1 bg-[#222] group-hover:bg-red-900 transition-colors"></div>
                        </div>
                    ))}
                </div>

                {/* Menu Grid */}
                <div>
                    <h2 className="text-2xl font-black italic text-white uppercase mb-6 flex items-center gap-3">
                        <div className="w-1 h-8 bg-red-600"></div>
                        Acesso Rápido
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.link}
                                to={item.link}
                                className="group"
                            >
                                <div className="gaming-card group bg-[#0a0a0a] border-2 border-[#222] hover:border-red-600 transition-all duration-300 overflow-hidden aspect-[4/3]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                                        <div className={`text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <h3 className="text-2xl font-black italic text-white uppercase mb-2 group-hover:text-red-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm font-mono">
                                            {item.description}
                                        </p>

                                        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-gray-600 group-hover:text-red-600 transition-colors">
                                            <span>ACESSAR</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
