import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function StudentDashboard() {
    const menuItems = [
        {
            title: 'BATERIAS',
            subtitle: 'IDENTIFICAÇÃO',
            description: 'Pratique reconhecimento de equipamentos por categoria',
            link: '/student/training',
            id: 1,
            image: 'https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images/assets/categories/c1.jpg'
        },
        {
            title: 'FLASHCARDS',
            subtitle: 'MEMORIZAÇÃO',
            description: 'Aprimore sua memória e velocidade de digitação',
            link: '/student/flashcards',
            id: 2,
            image: 'https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images/assets/categories/c2.jpg'
        },
        {
            title: 'ATLAS',
            subtitle: 'MUNDIAL',
            description: 'Explore equipamentos de países ao redor do mundo',
            link: '/student/countries',
            id: 3,
            image: 'https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images/assets/categories/c3.jpg'
        },
        {
            title: 'RESULTADOS',
            subtitle: 'ANÁLISE',
            description: 'Veja seu histórico e desempenho',
            link: '/student/results',
            id: 4,
            image: 'https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images/assets/categories/c4.jpg'
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">DA PÁTRIA OS OLHOS...</span> <span className="text-gray-600">//</span> NA GUERRA E NA PAZ...
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">SELECIONE O VETOR PARA ANÁLISE</p>
                    </div>
                </div>

                {/* Video Background Section */}
                <div className="relative h-72 bg-black overflow-hidden gaming-card border-2 border-[#333]">
                    <div className="absolute inset-0 z-0 select-none pointer-events-none">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/jS0bnynp4QI?autoplay=1&mute=1&controls=0&loop=1&playlist=jS0bnynp4QI&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0"
                            title="Background Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="w-full h-[150%] -mt-[12.5%] object-cover opacity-80"
                        ></iframe>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black z-10"></div>

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center space-y-2">
                            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl">
                                <span className="text-red-600">PVO</span> POKER
                            </h1>
                            <p className="text-lg text-gray-300 font-mono uppercase tracking-widest">
                                SISTEMA DE TREINAMENTO TÁTICO
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Menu Cards Grid - Mesmo estilo das Baterias */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.link}
                            className="group relative aspect-[3/4] overflow-hidden gaming-card bg-black border-2 border-transparent hover:border-red-600 transition-all duration-300"
                        >
                            {/* Imagem de fundo com efeito Gray to Color */}
                            <img
                                src={item.image}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                                alt={item.title}
                            />

                            {/* Overlay Gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>

                            {/* UI Elements do Card */}
                            <div className="absolute top-0 right-0 p-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <div className="text-4xl font-black italic text-white uppercase leading-none drop-shadow-md">{item.title}</div>
                                <div className="text-xs font-mono text-red-500 mt-1 tracking-widest">{item.subtitle}</div>
                                <div className="flex justify-between items-center mt-2 border-t border-red-600 pt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    <span className="text-xs font-bold text-gray-300 font-mono tracking-widest">{item.description}</span>
                                    <span className="text-white">➜</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
