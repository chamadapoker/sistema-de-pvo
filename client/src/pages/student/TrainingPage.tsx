import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { TechSheet } from '../../components/ui/TechSheet';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { equipmentService } from '../../services/equipmentService';
import { aiService } from '../../services/aiService';
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

    // AI & Comparison State
    const [isSelectingCompare, setIsSelectingCompare] = useState(false);
    const [comparingItem, setComparingItem] = useState<any>(null);
    const [intelOpen, setIntelOpen] = useState(false);
    const [intelData, setIntelData] = useState('');
    const [loadingIntel, setLoadingIntel] = useState(false);
    const [isAskingIntel, setIsAskingIntel] = useState(false);
    const [intelQuery, setIntelQuery] = useState('');
    const [operators, setOperators] = useState<{ id: number; name: string; flagUrl: string }[]>([]);

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

    // Load Operators when item changes
    useEffect(() => {
        if (!currentViewItem) {
            setOperators([]);
            return;
        }
        equipmentService.getOperators(currentViewItem.id).then(setOperators);
    }, [currentViewItem]);

    const handleAskIntel = () => {
        setIsAskingIntel(true);
        setIntelQuery('');
        setIntelOpen(false); // Close previous report if open
    };

    const handleGenerateIntel = async () => {
        if (!currentViewItem) return;
        setLoadingIntel(true);
        setIsAskingIntel(false);
        setIntelOpen(true);
        setIntelData(''); // Clear previous data to show loading state correctly

        try {
            const report = await aiService.getTacticalIntel(
                currentViewItem.name,
                currentViewItem.category?.name || 'Unknown',
                currentViewItem.country || 'Desconhecido',
                intelQuery || undefined
            );
            setIntelData(report);
        } catch (error) {
            setIntelData('ERRO AO ESTABELECER LINK COM CENTRO DE INTELIGÊNCIA. TENTE NOVAMENTE.');
        } finally {
            setLoadingIntel(false);
        }
    };

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
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedModelGroup(null)}>
                        <div
                            className={`bg-[#0a0a0a] border-2 border-lime-900 w-full transition-all duration-500 ease-in-out h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(101,163,13,0.2)] ${comparingItem || isSelectingCompare ? 'max-w-[95vw]' : 'max-w-[90vw]'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* --- COLUNA ESQUERDA (ITEM PRINCIPAL / GALERIA) --- */}
                            <div className={`${comparingItem || isSelectingCompare ? 'w-full md:w-1/2 border-r border-[#333]' : 'w-full md:w-3/4 border-r border-[#222]'} bg-black relative group flex flex-col transition-all duration-500`}>

                                {/* Header (Only visible in Compare Mode usually, but let's keep it clean) */}
                                {comparingItem && (
                                    <div className="absolute top-0 left-0 p-4 z-10 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                        <h2 className="text-2xl font-black italic text-white uppercase drop-shadow-lg">{currentViewItem.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] px-1.5 py-0.5 border rounded font-bold uppercase tracking-widest ${currentViewItem.descriptionSource === 'AI_GENERATED' || (currentViewItem.description && currentViewItem.description.includes('**ANÁLISE PVO:**'))
                                                ? 'border-red-500 text-red-400 bg-red-900/40'
                                                : 'border-blue-500 text-blue-400 bg-blue-900/40'
                                                }`}>
                                                {currentViewItem.descriptionSource === 'AI_GENERATED' || (currentViewItem.description && currentViewItem.description.includes('**ANÁLISE PVO:**')) ? '🤖 IA Analysis' : '👤 Instrutor'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Main Image Viewer / Gallery */}
                                <div className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 ${comparingItem ? 'h-1/2 border-b border-[#222]' : 'h-full'}`}>
                                    <ZoomableImage
                                        src={currentViewItem.imagePath || ''}
                                        className="w-full h-full object-contain"
                                        alt={currentViewItem.name}
                                    />

                                    {/* Gallery Navigation (Only if NOT comparing for cleaner look, or small) */}
                                    {!comparingItem && selectedModelGroup.length > 1 && (
                                        <>
                                            <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/90 hover:bg-lime-900 border border-gray-700 hover:border-lime-500 rounded-full transition-all z-40 text-white">←</button>
                                            <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/90 hover:bg-lime-900 border border-gray-700 hover:border-lime-500 rounded-full transition-all z-40 text-white">→</button>
                                        </>
                                    )}

                                    {!comparingItem && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/90 border border-lime-900 rounded-full text-lime-400 font-mono text-xs z-40">
                                            IMG {galleryIndex + 1} / {selectedModelGroup.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails Strip (Only if NOT comparing) */}
                                {!comparingItem && (
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
                                )}

                                {/* TechSheet in Comparison Mode (Left Side) */}
                                {comparingItem && (
                                    <div className="h-1/2 overflow-y-auto p-6 custom-scrollbar bg-[#0f0f0f]">
                                        <TechSheet markdown={currentViewItem.description || ''} />
                                    </div>
                                )}

                                {/* Compare Button (If not comparing) */}
                                {!comparingItem && !isSelectingCompare && (
                                    <div className="absolute bottom-28 right-4 z-50">
                                        <button
                                            onClick={() => setIsSelectingCompare(true)}
                                            className="btn-gaming bg-blue-900/20 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center gap-2"
                                        >
                                            <span className="text-lg">⇄</span> COMPARAR
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* --- COLUNA DIREITA (INFO / INTEL / COMPARISON) --- */}
                            <div className={`${comparingItem || isSelectingCompare ? 'w-full md:w-1/2' : 'w-full md:w-1/4'} flex flex-col bg-[#111] z-10 transition-all duration-500 relative`}>

                                {/* CASE 1: MODO COMPARAÇÃO (ITEM B) */}
                                {comparingItem ? (
                                    <div className="flex flex-col h-full relative">
                                        <div className="absolute top-2 right-2 z-50">
                                            <button
                                                onClick={() => setComparingItem(null)}
                                                className="bg-black/90 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 text-[10px] border border-red-900 font-mono font-bold uppercase tracking-widest shadow-lg transition-all"
                                            >
                                                Encerrar Comparação ✕
                                            </button>
                                        </div>
                                        <div className="absolute top-0 left-0 p-4 z-10 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                            <h2 className="text-2xl font-black italic text-white uppercase drop-shadow-lg text-right pr-48">{comparingItem.name}</h2>
                                            <div className="flex items-center gap-2 justify-end pr-48">
                                                <span className={`text-[9px] px-1.5 py-0.5 border rounded font-bold uppercase tracking-widest bg-black/50 ${comparingItem.descriptionSource === 'AI_GENERATED' || (comparingItem.description && comparingItem.description.includes('**ANÁLISE PVO:**'))
                                                    ? 'border-red-500 text-red-400'
                                                    : 'border-blue-500 text-blue-400'
                                                    }`}>
                                                    {comparingItem.descriptionSource === 'AI_GENERATED' || (comparingItem.description && comparingItem.description.includes('**ANÁLISE PVO:**')) ? '🤖 IA Analysis' : '👤 Instrutor'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-1/2 w-full flex items-center justify-center p-8 bg-[#080808] border-b border-[#222]">
                                            <ZoomableImage
                                                src={comparingItem.imagePath || comparingItem.imageUrl} // Handle different field names if any
                                                alt={comparingItem.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="h-1/2 overflow-y-auto p-6 custom-scrollbar bg-[#111]">
                                            <TechSheet markdown={comparingItem.description || ''} />
                                        </div>
                                    </div>

                                    /* CASE 2: SELECTION MODE */
                                ) : isSelectingCompare ? (
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                                            <h3 className="text-white font-bold uppercase italic text-lg">Selecione para Comparar</h3>
                                            <button onClick={() => setIsSelectingCompare(false)} className="text-gray-500 hover:text-white">CANCELAR</button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                            <div className="grid grid-cols-1 gap-4">
                                                {equipments // Use the full list of equipments in this category
                                                    ?.filter(e => e.id !== currentViewItem.id) // Filter out itself
                                                    .map(target => (
                                                        <button
                                                            key={target.id}
                                                            onClick={() => {
                                                                setComparingItem(target);
                                                                setIsSelectingCompare(false);
                                                            }}
                                                            className="flex items-center gap-3 p-2 border border-[#333] bg-[#050505] hover:border-blue-500 hover:bg-[#111] transition-all text-left group"
                                                        >
                                                            <div className="w-16 h-12 bg-black border border-[#222]">
                                                                <img src={target.imagePath} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xs uppercase">{target.name}</div>
                                                                <div className="text-gray-500 text-[10px] font-mono">{target.code}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>

                                    /* CASE 2.5: ASKING INTEL MODE */
                                ) : isAskingIntel ? (
                                    <div className="flex flex-col h-full bg-[#111] border-l border-red-900/30 animate-fade-in">
                                        <div className="p-4 border-b border-red-900/30 bg-red-900/10">
                                            <h3 className="text-red-500 font-black italic uppercase text-lg">⚠️ REQUISIÇÃO DE INTELIGÊNCIA</h3>
                                            <p className="text-[10px] font-mono text-gray-400 mt-1">Especifique sua necessidade de informação tática.</p>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <textarea
                                                className="w-full flex-1 bg-[#050505] border border-[#333] p-4 text-white text-sm font-mono focus:border-red-600 focus:outline-none resize-none"
                                                placeholder="Ex: Qual o alcance máximo de engajamento? Quais as principais vulnerabilidades em terreno urbano? Histórico de combate recente?"
                                                value={intelQuery}
                                                onChange={e => setIntelQuery(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsAskingIntel(false)}
                                                    className="flex-1 py-3 bg-[#1a1a1a] border border-[#333] hover:border-gray-500 text-gray-400 uppercase font-bold text-xs"
                                                >
                                                    CANCELAR
                                                </button>
                                                <button
                                                    onClick={handleGenerateIntel}
                                                    disabled={!intelQuery.trim()}
                                                    className="flex-1 py-3 bg-red-900/20 border border-red-600 hover:bg-red-900 text-red-500 hover:text-white uppercase font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    ENVIAR REQUISIÇÃO
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    /* CASE 3: STANDARD INFO MODE */
                                ) : (
                                    <>
                                        <div className="p-6 border-b border-[#333] bg-[#0f0f0f]">
                                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none break-words">
                                                {currentViewItem.name}
                                            </h2>

                                            {/* Operators Flags */}
                                            {operators.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3 mb-2 animate-fade-in">
                                                    {operators.map(op => (
                                                        <div key={op.id} className="relative group/flag" title={op.name}>
                                                            <img
                                                                src={op.flagUrl}
                                                                alt={op.name}
                                                                className="h-4 w-auto rounded-sm border border-[#333] opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-help"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-lime-500 font-mono text-sm mt-3 flex flex-wrap gap-4 items-center">
                                                <span className="px-2 bg-lime-900/20 text-xs rounded border border-lime-900/50 flex items-center">
                                                    {selectedModelGroup.length} VARIAÇÕES
                                                </span>
                                                <span className={`text-[9px] px-1.5 py-0.5 border rounded font-bold uppercase tracking-widest ${currentViewItem.descriptionSource === 'AI_GENERATED' || (currentViewItem.description && currentViewItem.description.includes('**ANÁLISE PVO:**'))
                                                    ? 'border-red-500 text-red-400 bg-red-900/40'
                                                    : 'border-blue-500 text-blue-400 bg-blue-900/40'
                                                    }`}>
                                                    {currentViewItem.descriptionSource === 'AI_GENERATED' || (currentViewItem.description && currentViewItem.description.includes('**ANÁLISE PVO:**')) ? '🤖 IA Analysis' : '👤 Instrutor'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
                                            <TechSheet markdown={currentViewItem.description || ''} />
                                        </div>

                                        <div className="p-4 border-t border-[#333] bg-[#080808] flex flex-col gap-2 relative">
                                            <button
                                                onClick={() => setShowFullSheet(true)}
                                                className="w-full py-3 bg-lime-900/20 border border-lime-900 hover:bg-lime-900/40 hover:text-white text-lime-500 font-bold uppercase tracking-widest transition-all text-xs"
                                            >
                                                [ + ] EXPANDIR FICHA TÉCNICA
                                            </button>

                                            <button
                                                onClick={handleAskIntel}
                                                disabled={loadingIntel}
                                                className="w-full py-3 bg-red-900/10 text-red-500 hover:text-white border border-red-900 hover:bg-red-900 font-bold uppercase tracking-widest transition-all disabled:opacity-50 text-xs"
                                            >
                                                {loadingIntel ? 'TRANSMITINDO...' : '📡 SOLICITAR INTEL REPORT'}
                                            </button>

                                            <button
                                                onClick={() => setSelectedModelGroup(null)}
                                                className="w-full py-3 bg-[#1a1a1a] border border-[#333] hover:border-red-600 hover:text-red-500 text-gray-400 font-bold uppercase tracking-widest transition-all text-xs"
                                            >
                                                ENCERRAR ANÁLISE
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* --- INTEL OVERLAY (INSIDE RIGHT COL) --- */}
                                {intelOpen && !comparingItem && !isSelectingCompare && !isAskingIntel && (
                                    <div className="absolute top-0 right-0 w-full bg-[#0a0a0a]/95 h-full flex flex-col animate-fade-in z-50 backdrop-blur-xl border-l border-red-900/50">
                                        <div className="p-4 border-b border-red-900/30 flex justify-between items-center bg-red-900/5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${loadingIntel ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
                                                <h3 className="text-red-500 font-black italic uppercase text-xs">RELATÓRIO DE CAMPO AI</h3>
                                            </div>
                                            <button onClick={() => setIntelOpen(false)} className="text-gray-500 hover:text-white font-mono text-xs">⚡ FECHAR</button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar font-mono text-xs leading-relaxed text-gray-300">
                                            {loadingIntel ? (
                                                <div className="space-y-4 opacity-50">
                                                    <div className="h-2 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                                                    <div className="h-2 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                                                    <div className="h-2 bg-gray-800 rounded w-full animate-pulse"></div>
                                                    <p className="text-center text-red-500 mt-10 animate-pulse">ESTABELECENDO LINK SEGURO COM QG DE INTELIGÊNCIA...</p>
                                                </div>
                                            ) : (
                                                <TechSheet markdown={intelData} className="intel-report" />
                                            )}
                                        </div>
                                    </div>
                                )}

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
