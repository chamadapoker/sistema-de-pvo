import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuthStore } from '../../store/authStore';

export function StudentDashboard() {
    const { user } = useAuthStore();

    const menuItems = [
        {
            title: 'Modo Treinamento',
            description: 'Pratique reconhecendo equipamentos militares',
            icon: '🎯',
            link: '/student/training',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Fazer Teste',
            description: 'Teste seus conhecimentos',
            icon: '📝',
            link: '/student/test',
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Meus Resultados',
            description: 'Veja seu histórico e desempenho',
            icon: '📊',
            link: '/student/results',
            color: 'from-purple-500 to-purple-600',
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        Bem-vindo, {user?.name}!
                    </h1>
                    <p className="text-primary-100">
                        Continue seu treinamento de reconhecimento visual de equipamentos militares
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Testes Realizados</p>
                                <p className="text-3xl font-bold text-gray-900">0</p>
                            </div>
                            <div className="text-4xl">📝</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Taxa de Acerto</p>
                                <p className="text-3xl font-bold text-gray-900">0%</p>
                            </div>
                            <div className="text-4xl">🎯</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tempo Médio</p>
                                <p className="text-3xl font-bold text-gray-900">0s</p>
                            </div>
                            <div className="text-4xl">⏱️</div>
                        </div>
                    </div>
                </div>

                {/* Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.link}
                            to={item.link}
                            className="group"
                        >
                            <div className="card hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                <div className={`w-full h-2 bg-gradient-to-r ${item.color} rounded-t-lg`} />
                                <div className="p-6">
                                    <div className="text-5xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
