import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { TechSheet } from '../../components/ui/TechSheet';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { equipmentService } from '../../services/equipmentService';
import type { Category, Equipment } from '../../types';

export function TrainingPage() {
    // Navigation State
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedModelGroup, setSelectedModelGroup] = useState<Equipment[] | null>(null);
    const [showFullSheet, setShowFullSheet] = useState(false);

    // Data State
    const [categories, setCategories] = useState<Category[]>([]);
    const [equipments, setEquipments] = useState<Equipment[] | null>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [loadingEquipments, setLoadingEquipments] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const STORAGE_URL = "https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images";

    // Load Categories on Mount
    useEffect(() => {
        async function loadCategories() {
            try {
                const { categories } = await equipmentService.getCategories();
                // Sort by ID is usually stable
                setCategories(categories.sort((a, b) => a.id - b.id));
            } catch (error: any) {
                console.error('Erro ao carregar categorias', error);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    // Load Equipments when Category Selected
    useEffect(() => {
        if (!selectedCategory) {
            setEquipments([]);
            setSelectedModelGroup(null);
            setShowFullSheet(false);
            return;
        }

        async function loadEquipments() {
            setLoadingEquipments(true);
            try {
                const { equipment } = await equipmentService.getAllEquipment({ categoryId: selectedCategory || undefined });
                setEquipments(equipment);
            } catch (error) {
                console.error('Erro ao carregar', error);
                setEquipments([]);
            } finally {
                setLoadingEquipments(false);
            }
        }
        loadEquipments();
    }, [selectedCategory]);

    // GROUPS LOGIC: Group equipments by name
    const models = (equipments || []).reduce((acc, item) => {
        const nameKey = item.name.trim().toUpperCase(); // Normalize
        if (!acc[nameKey]) {
            acc[nameKey] = [];
        }
        acc[nameKey].push(item);
        return acc;
    }, {} as Record<string, Equipment[]>);

    const modelKeys = Object.keys(models).sort();

    const handleSelectModel = (modelName: string) => {
        const group = models[modelName];
        if (group && group.length > 0) {
            setSelectedModelGroup(group);
            setGalleryIndex(0);
            setShowFullSheet(false);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedModelGroup) {
            setGalleryIndex(prev => (prev + 1) % selectedModelGroup.length);
        }
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedModelGroup) {
            setGalleryIndex(prev => (prev - 1 + selectedModelGroup.length) % selectedModelGroup.length);
        }
    };

    // Current Item in Gallery
    const currentViewItem = selectedModelGroup ? selectedModelGroup[galleryIndex] : null;

    if (loading) return <div className="text-center p-10 font-mono text-red-600 animate-pulse tracking-widest">INICIALIZANDO SISTEMA DE BATERIAS...</div>;

    return (
        <DashboardLayout>
            <div className="space-y-8 min-h-screen pb-20">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg flex items-center gap-3">
                            <span className="text-red-600">BATERIAS</span>
                            <span className="text-gray-600">//</span>
                            {selectedCategory ? (
                                <span className="animate-fade-in text-white">{categories.find(c => c.id === selectedCategory)?.name}</span>
                            ) : (
                                "IDENTIFICAÇÃO"
                            )}
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">
                            {!selectedCategory ? "SELECIONE O VETOR PARA ANÁLISE" : "CLIQUE NO MODELO PARA ACESSAR FICHA TÉCNICA E GALERIA"}
                        </p>
                    </div>
                    {selectedCategory && (
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedModelGroup(null);
                            }}
                            className="btn-gaming text-xs py-2 px-4 bg-[#1a1a1a] border border-[#333] hover:border-red-600 transition-colors"
                        >
                            ← RETORNAR AO MENU
                        </button>
                    )}
                </div>

                {/* LEVEL 1: CATEGORY SELECTION */}
                {!selectedCategory && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="group relative aspect-[3/4] overflow-hidden gaming-card bg-black border-2 border-transparent hover:border-red-600 transition-all duration-300"
                            >
                                <img
                                    src={`${STORAGE_URL}/assets/categories/c${cat.id}.jpg`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                                    alt={cat.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
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
                )}

                {/* LEVEL 2: MODELS GRID */}
                {selectedCategory && !selectedModelGroup && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="bg-red-900/10 border-l-4 border-red-600 px-4 py-3 mb-6 flex justify-between items-center font-mono text-sm">
                            <div className="flex items-center gap-2 text-white">
                                <span className="text-red-500 font-bold">CATEGORIA:</span>
                                {categories.find(c => c.id === selectedCategory)?.name.toUpperCase()}
                            </div>
                            <div className="text-gray-400">
                                {Object.keys(models).length} MODELOS IDENTIFICADOS | {equipments?.length || 0} IMAGENS TOTAIS
                            </div>
                        </div>

                        {loadingEquipments ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse rounded gaming-card border border-[#333]"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                {modelKeys.map((modelName) => {
                                    const groupItems = models[modelName];
                                    const coverItem = groupItems[0];

                                    return (
                                        <button
                                            key={modelName}
                                            onClick={() => handleSelectModel(modelName)}
                                            className="group relative aspect-square bg-black border border-[#333] hover:border-lime-500 transition-all overflow-hidden gaming-card"
                                        >
                                            <img
                                                src={coverItem.imagePath || ''}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                                alt={modelName}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity"></div>

                                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 border border-lime-600 text-lime-400 text-[10px] font-mono font-bold rounded">
                                                {groupItems.length} IMGS
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-4">
                                                <div className="text-lime-500 text-[10px] font-mono mb-1">{coverItem.code}</div>
                                                <h4 className="font-black text-white text-lg italic uppercase leading-tight group-hover:text-lime-400 transition-colors">
                                                    {modelName}
                                                </h4>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* LEVEL 3: MODEL DETAILS & GALLERY MODAL */}
                {selectedModelGroup && currentViewItem && (
                    <div className="modal-backdrop" onClick={() => setSelectedModelGroup(null)}>
                        <div
                            className="modal-content max-w-[90vw] h-[90vh] bg-[#080808] border border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.2)] flex flex-col md:flex-row overflow-hidden relative animate-scale-in"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-600 z-50 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-600 z-50 pointer-events-none"></div>

                            {/* LEFT SIDE: VISUAL GALLERY */}
                            <div className="w-full md:w-3/4 bg-black relative group flex flex-col border-r border-[#333]">

                                {/* Main Image Viewer */}
                                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
                                    <ZoomableImage
                                        src={currentViewItem.imagePath || ''}
                                        className="w-full h-full object-contain"
                                        alt={currentViewItem.name}
                                    />

                                    {/* Navigation Arrows */}
                                    {selectedModelGroup.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/90 hover:bg-lime-900 border border-gray-700 hover:border-lime-500 rounded-full transition-all z-40 text-white"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/90 hover:bg-lime-900 border border-gray-700 hover:border-lime-500 rounded-full transition-all z-40 text-white"
                                            >
                                                →
                                            </button>
                                        </>
                                    )}

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/90 border border-lime-900 rounded-full text-lime-400 font-mono text-xs z-40">
                                        IMG {galleryIndex + 1} / {selectedModelGroup.length}
                                    </div>
                                </div>

                                {/* Thumbnails Strip */}
                                <div className="h-24 bg-[#0a0a0a] border-t border-[#222] p-2 flex gap-2 overflow-x-auto custom-scrollbar">
                                    {selectedModelGroup.map((item, idx) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setGalleryIndex(idx)}
                                            className={`relative aspect-video h-full flex-shrink-0 border-2 transition-all ${idx === galleryIndex ? 'border-lime-600 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                        >
                                            <img src={item.imagePath} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT SIDE: INTELLIGENCE DATA */}
                            <div className="w-full md:w-1/4 flex flex-col bg-[#111] z-10">
                                <div className="p-6 border-b border-[#333] bg-[#0f0f0f]">
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none break-words">
                                        {currentViewItem.name}
                                    </h2>
                                    <div className="text-lime-500 font-mono text-sm mt-3 flex flex-wrap gap-4">
                                        <span>COD: {currentViewItem.code || "N/A"}</span>
                                        <span className="px-2 bg-lime-900/20 text-xs rounded border border-lime-900/50 flex items-center">
                                            {selectedModelGroup.length} VARIAÇÕES
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
                                    <TechSheet markdown={currentViewItem.description || ''} />
                                </div>

                                <div className="p-6 border-t border-[#333] bg-[#080808] space-y-3">
                                    <button
                                        onClick={() => setShowFullSheet(true)}
                                        className="w-full py-3 bg-lime-900/20 border border-lime-900 hover:bg-lime-900/40 hover:text-white text-lime-500 font-bold uppercase tracking-widest transition-all text-xs"
                                    >
                                        [ + ] EXPANDIR FICHA TÉCNICA
                                    </button>
                                    <button
                                        onClick={() => setSelectedModelGroup(null)}
                                        className="w-full py-3 bg-[#1a1a1a] border border-[#333] hover:border-red-600 hover:text-red-500 text-gray-400 font-bold uppercase tracking-widest transition-all text-xs"
                                    >
                                        ENCERRAR ANÁLISE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEVEL 4: FULL TECH SHEET MODAL */}
                {showFullSheet && selectedModelGroup && currentViewItem && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setShowFullSheet(false)}>
                        <div
                            className="bg-[#0a0a0a] border-2 border-lime-900 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(101,163,13,0.2)] animate-scale-in"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-lime-900/50 bg-[#0f0f0f] flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black italic text-white uppercase">{currentViewItem.name}</h2>
                                    <p className="text-lime-500 font-mono text-xs mt-1">RELATÓRIO DE INTELIGÊNCIA COMPLETO</p>
                                </div>
                                <button
                                    onClick={() => setShowFullSheet(false)}
                                    className="w-10 h-10 flex items-center justify-center border border-red-900/50 hover:bg-red-900/50 hover:text-white text-gray-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                                <div className="max-w-3xl mx-auto bg-black/80 border border-[#333] p-8 backdrop-blur-sm">
                                    <TechSheet markdown={currentViewItem.description || ''} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-[#222] bg-[#050505] flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase">
                                <span>Classified // PVO Internal Use Only</span>
                                <span>{new Date().toLocaleDateString()} // {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
