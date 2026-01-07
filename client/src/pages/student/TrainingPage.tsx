
import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { equipmentService } from '../../services/equipmentService';
import type { Category, Equipment } from '../../types';

export function TrainingPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingEquipments, setLoadingEquipments] = useState(false);

    // Modal State
    const [viewItem, setViewItem] = useState<Equipment | null>(null);

    const STORAGE_URL = "https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images";

    useEffect(() => {
        async function loadCategories() {
            try {
                const { categories } = await equipmentService.getCategories();
                setCategories(categories.sort((a, b) => a.id - b.id));
                setCategories(categories.sort((a, b) => a.id - b.id));
            } catch (error: any) {
                console.error('Erro ao carregar categorias', error);
                setLoading(false);
                // Temporary debug:
                alert(`Erro ao carregar categorias: ${error.message || 'Erro desconhecido'}`);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setEquipments([]);
            return;
        }

        async function loadEquipments() {
            setLoadingEquipments(true);
            try {
                const { equipment } = await equipmentService.getAllEquipment({ categoryId: selectedCategory || undefined });
                setEquipments(equipment);
            } catch (error) {
                console.error('Erro ao carregar', error);
            } finally {
                setLoadingEquipments(false);
            }
        }
        loadEquipments();
    }, [selectedCategory]);

    if (loading) return <div className="text-center p-10 font-mono text-red-600 animate-pulse tracking-widest">INICIALIZANDO SISTEMA DE BATERIAS...</div>;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">BATERIAS</span> <span className="text-gray-600">//</span> IDENTIFICAÇÃO
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">SELECIONE O VETOR PARA ANÁLISE</p>
                    </div>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="btn-gaming text-xs py-2 px-4 bg-[#1a1a1a] border border-[#333] hover:border-red-600"
                        >
                            ← RETORNAR AO MENU
                        </button>
                    )}
                </div>

                {!selectedCategory ? (
                    /* Categoria Grid Gaming Style */
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="group relative aspect-[3/4] overflow-hidden gaming-card bg-black border-2 border-transparent hover:border-red-600 transition-all duration-300"
                            >
                                {/* Imagem com efeito Hover Brightness */}
                                <img
                                    src={`${STORAGE_URL}/assets/categories/c${cat.id}.jpg`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                                    alt={cat.name}
                                />

                                {/* Overlay Gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>

                                {/* UI Elements do Card */}
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="text-4xl font-black italic text-white uppercase leading-none drop-shadow-md">{cat.name}</div>
                                    <div className="flex justify-between items-center mt-2 border-t border-red-600 pt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        <span className="text-xs font-bold text-red-500 font-mono tracking-widest">{cat._count?.equipments || 0} REGS</span>
                                        <span className="text-white">➜</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Lista Equipamentos Gaming Style */
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="bg-red-900/10 border-l-4 border-red-600 px-4 py-3 mb-6 flex justify-between items-center font-mono text-sm">
                            <div className="flex items-center gap-2 text-white">
                                <span className="text-red-500 font-bold">ALVO:</span>
                                {categories.find(c => c.id === selectedCategory)?.name.toUpperCase()}
                            </div>
                            <div className="text-gray-400">{equipments.length} ARQUIVOS CARREGADOS</div>
                        </div>

                        {loadingEquipments ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse rounded gaming-card border border-[#333]"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                {equipments.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setViewItem(item)}
                                        className="group relative aspect-square bg-black border border-[#333] hover:border-red-500 transition-all overflow-hidden gaming-card"
                                    >
                                        <img
                                            src={item.imagePath || ''}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                            alt="Foto"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                                        <div className="absolute bottom-0 left-0 w-full p-3">
                                            <div className="text-red-500 text-[10px] font-mono mb-1">{item.code}</div>
                                            <h4 className="font-bold text-white text-xs uppercase leading-tight truncate group-hover:text-red-400 transition-colors">
                                                {item.name}
                                            </h4>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* MODAL TÁTICO FULLSCREEN */}
                {viewItem && (
                    <div className="modal-backdrop" onClick={() => setViewItem(null)}>
                        <div
                            className="modal-content max-w-6xl bg-[#080808] border border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.2)] flex flex-col md:flex-row overflow-hidden relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Decorative Tech Lines */}
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-600 z-50 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-600 z-50 pointer-events-none"></div>

                            {/* Lado Esquerdo: VISUAL */}
                            <div className="w-full md:w-2/3 bg-black relative group flex items-center justify-center p-8">
                                <ZoomableImage
                                    src={viewItem.imagePath || ''}
                                    className="w-full h-full object-contain opacity-90"
                                    alt="Visual Principal"
                                />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20 pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 bg-black/80 text-red-500 font-mono text-xs px-2 py-1 border border-red-900">
                                    IMG_SOURCE: SAT_V4
                                </div>
                            </div>

                            {/* Lado Direito: DADOS */}
                            <div className="w-full md:w-1/3 border-l border-[#333] flex flex-col">
                                <div className="p-6 border-b border-[#333] bg-[#1a1a1a]">
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
                                        {viewItem.name}
                                    </h2>
                                    <div className="text-red-600 font-mono text-sm mt-2 flex gap-4">
                                        <span>COD: {viewItem.code}</span>
                                        <span>CAT: {viewItem.categoryId}</span>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0c0c0c]">
                                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        Análise de Inteligência
                                    </h3>
                                    <div className="prose prose-invert prose-sm font-mono text-gray-300 leading-relaxed text-justify">
                                        {viewItem.description ? (
                                            viewItem.description
                                        ) : (
                                            <span className="italic text-gray-600">
                                                {">> ACESSO NEGADO. NENHUMA DESCRIÇÃO TÉCNICA ENCONTRADA NO SERVIDOR PVO."}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-[#333] bg-[#0f0f0f] space-y-3">
                                    {viewItem.thumbnailPath ? (
                                        <a
                                            href={viewItem.thumbnailPath}
                                            target="_blank"
                                            className="btn-gaming w-full flex items-center justify-center gap-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                                            FICHA TÉCNICA
                                        </a>
                                    ) : (
                                        <button disabled className="btn-gaming w-full bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700">
                                            SEM FICHA
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setViewItem(null)}
                                        className="w-full py-3 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest hover:bg-[#222] transition-colors"
                                    >
                                        [ FECHAR RELATÓRIO ]
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
