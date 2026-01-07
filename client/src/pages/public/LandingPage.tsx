import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function LandingPage() {
    const { isAuthenticated, user } = useAuthStore();

    // Se já estiver autenticado, redireciona
    if (isAuthenticated) {
        if (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') {
            window.location.href = '/instructor/dashboard';
        } else {
            window.location.href = '/student/dashboard';
        }
        return null;
    }

    const features = [
        {
            title: 'Treinamento Tático',
            description: 'Sistema avançado de reconhecimento visual de equipamentos militares',
            icon: '🎯'
        },
        {
            title: 'Flashcards Interativos',
            description: 'Memorização eficiente com sistema de repetição espaçada',
            icon: '🎴'
        },
        {
            title: 'Avaliações',
            description: 'Testes personalizados com correção automática e manual',
            icon: '📝'
        },
        {
            title: 'Atlas Militar',
            description: 'Explore equipamentos de países ao redor do mundo',
            icon: '🌍'
        }
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                >
                    <source src="/a1-amx.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-7xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-6 animate-fade-in">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                            PVO POKER
                        </span>
                    </h1>
                    <p className="text-2xl text-gray-300 font-mono uppercase tracking-widest mb-12">
                        Sistema de Treinamento de Reconhecimento Visual
                    </p>
                    
                    <Link
                        to="/login"
                        className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold text-xl px-12 py-4 uppercase tracking-wider transition-all transform hover:scale-105"
                        style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}
                    >
                        ACESSAR SISTEMA
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-sm p-8 border-2 border-red-900/30 hover:border-red-600 transition-all group"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                }}
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase mb-3 tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="container mx-auto px-6 py-12 text-center border-t border-gray-800">
                    <p className="text-gray-500 font-mono">
                        © 2024 PVO POKER - Sistema de Treinamento Militar
                    </p>
                </div>
            </div>
        </div>
    );
}
