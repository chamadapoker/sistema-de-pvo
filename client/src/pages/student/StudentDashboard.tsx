import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MFDButton } from '../../components/ui/CockpitControls';

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
                        <h2 className="text-3xl lg:text-4xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">DA PÁTRIA OS OLHOS...</span> <span className="text-gray-600">//</span> NA GUERRA E NA PAZ...
                        </h2>
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
                {/* Menu Cards Grid - AMX Style Instruments */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.link}
                            className="group relative flex flex-col bg-[#1a1a1a] border-4 border-[#2a2a2a] rounded-lg shadow-2xl overflow-hidden hover:border-[#3a3a3a] transition-colors"
                        >
                            {/* Decorative Screws (Bezel) */}
                            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] z-20"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] z-20"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] z-20"></div>
                            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] z-20"></div>

                            {/* "Screen" Area */}
                            <div className="relative aspect-[3/3] w-full overflow-hidden border-b-4 border-[#2a2a2a]">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                    alt={item.title}
                                />
                                {/* Scanlines & Glare */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,0,0.05)_1px,transparent_1px)] bg-[length:100%_3px] pointer-events-none"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>

                                <div className="absolute top-3 right-3">
                                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#dc2626]"></div>
                                </div>
                            </div>

                            {/* "Control Panel" Area */}
                            <div className="flex-1 bg-[#222] p-4 flex flex-col justify-between relative pt-6">
                                <div>
                                    <div className="text-[10px] font-mono text-green-600 mb-1 tracking-widest uppercase">SYS. {item.subtitle}</div>
                                    <div className="text-xl font-black italic text-white uppercase leading-none tracking-tighter mb-4">{item.title}</div>
                                </div>

                                <MFDButton
                                    label="ACESSAR"
                                    className="w-full pointer-events-none group-hover:bg-[#333] group-hover:text-green-400 border-green-900/30 text-green-700"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
