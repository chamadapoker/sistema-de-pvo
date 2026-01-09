import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { equipmentService } from '../../services/equipmentService';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import type { Category, Equipment } from '../../types';

type Mode = 'MENTAL' | 'TYPING';
type Step = 'SELECT_BATTERY' | 'CONFIGURE' | 'STUDY' | 'SUMMARY';
type SelectionMode = 'RANDOM' | 'MANUAL';

export function FlashcardPage() {
    // Navigation State
    const [step, setStep] = useState<Step>('SELECT_BATTERY');

    // Category Selection
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState<number | null>(null);

    // Configuration
    const [itemCount, setItemCount] = useState(10);
    const [mode, setMode] = useState<Mode>('MENTAL');
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('RANDOM');
    const [availableEquipments, setAvailableEquipments] = useState<Equipment[]>([]);
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingEquipments, setLoadingEquipments] = useState(false);

    // Study State
    const [cards, setCards] = useState<Equipment[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

    // Results
    const [correctCount, setCorrectCount] = useState(0);

    const STORAGE_URL = "https://baoboggeqhksaxkuudap.supabase.co/storage/v1/object/public/equipment-images";

    useEffect(() => {
        equipmentService.getCategories().then(res => setCategories(res.categories));
    }, []);

    // Fetch equipments when entering configuration if needed, or when switching to manual
    useEffect(() => {
        if (selectedCat && selectionMode === 'MANUAL' && availableEquipments.length === 0) {
            loadCategoryEquipments(selectedCat);
        }
    }, [selectedCat, selectionMode]);

    const loadCategoryEquipments = async (catId: number) => {
        setLoadingEquipments(true);
        try {
            const { equipment } = await equipmentService.getAllEquipment({ categoryId: catId });
            setAvailableEquipments(equipment);
        } catch (error) {
            console.error("Error loading equipments", error);
        } finally {
            setLoadingEquipments(false);
        }
    };

    const selectBattery = (catId: number) => {
        setSelectedCat(catId);
        setSelectionMode('RANDOM'); // Reset to default
        setAvailableEquipments([]);
        setSelectedEquipmentIds([]);
        setStep('CONFIGURE');
    };

    const toggleEquipmentSelection = (id: string) => {
        setSelectedEquipmentIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const selectAllEquipments = () => {
        if (selectedEquipmentIds.length === availableEquipments.length) {
            setSelectedEquipmentIds([]);
        } else {
            setSelectedEquipmentIds(availableEquipments.map(e => e.id));
        }
    };

    const startSession = async () => {
        if (!selectedCat) return;
        setLoading(true);
        try {
            let sessionCards: Equipment[] = [];

            if (selectionMode === 'MANUAL') {
                if (selectedEquipmentIds.length === 0) {
                    alert('Selecione pelo menos um equipamento!');
                    setLoading(false);
                    return;
                }
                // Filter selected from available
                sessionCards = availableEquipments.filter(e => selectedEquipmentIds.includes(e.id));
                // Shuffle them for the session (optional, but good for flashcards)
                sessionCards = sessionCards.sort(() => Math.random() - 0.5);
            } else {
                // RANDOM MODE
                const { equipment } = await equipmentService.getAllEquipment({ categoryId: selectedCat });
                sessionCards = [...equipment].sort(() => Math.random() - 0.5).slice(0, itemCount);
            }

            setCards(sessionCards);
            setCurrentIndex(0);
            setCorrectCount(0);
            setStep('STUDY');
            setFlipped(false);
            setTypedAnswer('');
            setFeedback(null);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setFlipped(false);
            setTypedAnswer('');
            setFeedback(null);
        } else {
            setStep('SUMMARY');
        }
    };

    const handleTypingSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (feedback) return;

        const current = cards[currentIndex];
        const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        const isCorrect = normalize(typedAnswer) === normalize(current.name) || normalize(typedAnswer) === normalize(current.code) || (current.name.toLowerCase().includes(typedAnswer.toLowerCase()) && typedAnswer.length > 3);

        setFeedback(isCorrect ? 'CORRECT' : 'WRONG');
        if (isCorrect) setCorrectCount(prev => prev + 1);
    };

    // STEP 1: SELECT BATTERY (Category Selection with Cards like TrainingPage)
    if (step === 'SELECT_BATTERY') {
        return (
            <DashboardLayout>
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                        <div>
                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                                <span className="text-red-600">FLASHCARDS</span> <span className="text-gray-600">//</span> SELEÇÃO DE BATERIA
                            </h2>
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Escolha a categoria para treinamento rápido</p>
                        </div>
                    </div>

                    {/* Category Grid (Same as TrainingPage) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => selectBattery(cat.id)}
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
                                        <span className="text-xs font-bold text-red-500 font-mono tracking-widest">{cat._count?.equipments || 0} ITENS</span>
                                        <span className="text-white">➜</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // STEP 2: CONFIGURE (Mode and Count Selection)
    if (step === 'CONFIGURE') {
        const selectedCategory = categories.find(c => c.id === selectedCat);

        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                        <div>
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                                Configuração de Treinamento
                            </h2>
                            <p className="text-sm text-lime-500 font-mono mt-1">
                                Bateria Selecionada: <span className="text-white">{selectedCategory?.name}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setStep('SELECT_BATTERY');
                                setSelectedCat(null);
                            }}
                            className="btn-gaming text-xs py-2 px-4 bg-[#1a1a1a] border border-[#333] hover:border-red-600"
                        >
                            ← Trocar Bateria
                        </button>
                    </div>

                    {/* Configuration Grid - Full Width */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* 1. Mode Selection */}
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8">
                            <h3 className="text-xl font-black text-white uppercase italic mb-6 text-red-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                1. Selecione o Modo de Treino
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setMode('MENTAL')}
                                    className={`group relative aspect-[3/1] overflow-hidden border-2 transition-all ${mode === 'MENTAL' ? 'border-red-500 bg-red-900/20' : 'border-[#333] hover:border-red-600 bg-[#111]'}`}
                                >
                                    <div className="relative z-10 h-full flex items-center justify-start gap-4 p-6">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-lg font-black uppercase tracking-widest text-white">Modo Mental</div>
                                            <div className="text-xs text-gray-400 font-mono">Visualização e Memorização</div>
                                        </div>
                                    </div>
                                    {mode === 'MENTAL' && <div className="absolute top-2 right-2 text-red-500 text-xs font-black">ACTIVE</div>}
                                </button>
                                <button
                                    onClick={() => setMode('TYPING')}
                                    className={`group relative aspect-[3/1] overflow-hidden border-2 transition-all ${mode === 'TYPING' ? 'border-red-500 bg-red-900/20' : 'border-[#333] hover:border-red-600 bg-[#111]'}`}
                                >
                                    <div className="relative z-10 h-full flex items-center justify-start gap-4 p-6">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-lg font-black uppercase tracking-widest text-white">Modo Digitação</div>
                                            <div className="text-xs text-gray-400 font-mono">Teste de Resposta Rápida</div>
                                        </div>
                                    </div>
                                    {mode === 'TYPING' && <div className="absolute top-2 right-2 text-red-500 text-xs font-black">ACTIVE</div>}
                                </button>
                            </div>
                        </div>

                        {/* 2. Selection Logic */}
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8">
                            <h3 className="text-xl font-black text-white uppercase italic mb-6 text-red-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                2. Configurar Itens
                            </h3>

                            {/* Logic Toggle */}
                            <div className="flex bg-[#111] p-1 rounded-sm border border-[#333] mb-8 w-fit">
                                <button
                                    onClick={() => setSelectionMode('RANDOM')}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all ${selectionMode === 'RANDOM' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Aleatório
                                </button>
                                <button
                                    onClick={() => setSelectionMode('MANUAL')}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all ${selectionMode === 'MANUAL' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Seleção Manual
                                </button>
                            </div>

                            {/* Content based on Selection Mode */}
                            {selectionMode === 'RANDOM' ? (
                                <div className="animate-fade-in">
                                    <p className="text-gray-400 mb-4 font-mono text-sm">Quantos itens você deseja treinar nesta sessão?</p>
                                    <div className="grid grid-cols-3 gap-6 max-w-lg">
                                        {[10, 30, 60].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setItemCount(n)}
                                                className={`group relative aspect-square border-2 transition-all overflow-hidden ${itemCount === n
                                                    ? 'bg-red-600 border-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)]'
                                                    : 'bg-[#111] border-[#333] text-gray-400 hover:border-red-600'
                                                    }`}
                                            >
                                                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                                    <div className="text-5xl font-black italic mb-2">{n}</div>
                                                    <div className="text-xs uppercase tracking-widest">Cards</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    {loadingEquipments ? (
                                        <div className="text-center py-10 text-gray-500 font-mono">Carregando equipamentos da bateria...</div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm font-mono text-gray-400">
                                                    Selecione os equipamentos para estudo: <span className="text-white">{selectedEquipmentIds.length}</span> selecionados
                                                </div>
                                                <button onClick={selectAllEquipments} className="text-xs text-red-500 hover:text-red-400 font-mono uppercase underline">
                                                    {selectedEquipmentIds.length === availableEquipments.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto p-2 border border-[#333] bg-[#0f0f0f]">
                                                {availableEquipments.map(eq => {
                                                    const isSelected = selectedEquipmentIds.includes(eq.id);
                                                    return (
                                                        <button
                                                            key={eq.id}
                                                            onClick={() => toggleEquipmentSelection(eq.id)}
                                                            className={`relative aspect-square border-2 group transition-all ${isSelected ? 'border-red-600 opacity-100' : 'border-[#222] opacity-50 hover:opacity-100 hover:border-gray-500'}`}
                                                        >
                                                            <img src={eq.thumbnailPath || eq.imagePath} alt={eq.name} className="w-full h-full object-cover" />
                                                            {isSelected && (
                                                                <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                                                                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                                                                </div>
                                                            )}
                                                            <div className="absolute bottom-0 left-0 w-full bg-black/80 text-[10px] text-white p-1 truncate font-mono">
                                                                {eq.name}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="pt-8 text-center pb-20">
                        <button
                            onClick={startSession}
                            disabled={loading || (selectionMode === 'MANUAL' && selectedEquipmentIds.length === 0)}
                            className={`btn-gaming w-full max-w-md mx-auto text-xl py-6 border-2 shadow-[0_0_30px_rgba(220,38,38,0.4)] ${loading || (selectionMode === 'MANUAL' && selectedEquipmentIds.length === 0)
                                    ? 'bg-[#222] border-[#333] text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-500 border-red-400 text-white'
                                }`}
                        >
                            {loading ? 'CARREGANDO DADOS...' : 'INICIAR EXERCÍCIO'}
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // STEP 3: STUDY (Existing logic)
    if (step === 'STUDY') {
        const current = cards[currentIndex];
        const progress = ((currentIndex + 1) / cards.length) * 100;

        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto flex flex-col min-h-[85vh]">
                    <div className="flex justify-between items-end mb-6 border-b-2 border-[#333] pb-2">
                        <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase">PROGRESSO DA MISSÃO</div>
                            <div className="text-3xl font-black italic text-white">{currentIndex + 1} <span className="text-gray-600 text-xl">/ {cards.length}</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">MODO ATUAL</div>
                            <div className="text-red-500 font-black uppercase tracking-widest">{mode === 'MENTAL' ? 'VISUALIZAÇÃO' : 'INPUT MANUAL'}</div>
                        </div>
                    </div>

                    <div className="w-full h-2 bg-[#1a1a1a] mb-8 overflow-hidden skew-x-[-20deg] border border-[#333]">
                        <div className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_10px_#dc2626]" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div
                            className="relative w-full max-w-3xl aspect-[16/9] group bg-black border-2 border-[#333] cursor-pointer hover:border-red-500/50 perspective-1000 rounded-xl overflow-visible shadow-2xl"
                            onClick={() => mode === 'MENTAL' && setFlipped(!flipped)}
                        >
                            <div className={`flip-card-inner duration-500 w-full h-full ${flipped || (mode === 'TYPING' && feedback) ? 'rotate-y-180' : ''}`}>

                                <div className="flip-card-front bg-black flex items-center justify-center relative">
                                    <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
                                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>

                                    <div className="w-full h-full p-8 z-10 flex items-center justify-center pointer-events-auto">
                                        <ZoomableImage
                                            src={current.imagePath || ''}
                                            alt={current.name}
                                            className="w-full h-full"
                                        />
                                    </div>

                                    {mode === 'MENTAL' && (
                                        <div className="absolute bottom-8 text-xs font-mono bg-red-900/80 text-white px-4 py-1 border border-red-500 animate-pulse z-20">
                                            CLIQUE PARA IDENTIFICAR
                                        </div>
                                    )}
                                </div>

                                <div className="flip-card-back bg-[#151515] rotate-y-180 flex flex-col items-center justify-center p-8 border border-red-900">
                                    <div className="text-red-600 font-mono text-xs mb-2 tracking-[0.3em] uppercase">Arquivo Classificado</div>
                                    <h2 className="text-5xl font-black italic text-white uppercase text-center mb-2">{current.name}</h2>
                                    <div className="px-4 py-1 bg-[#222] font-mono text-gray-300 text-lg border border-[#444] mb-6">{current.code}</div>
                                    <p className="max-w-xl text-center text-gray-400 leading-relaxed font-mono text-sm">
                                        {current.description || "Descrição técnica não disponível."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-xl mx-auto">
                        {mode === 'TYPING' && !feedback && (
                            <form onSubmit={handleTypingSubmit} className="relative group">
                                <input
                                    autoFocus
                                    type="text"
                                    className="input-gaming text-center text-2xl uppercase font-black tracking-wider bg-black/80 border-red-900 text-white focus:border-red-500"
                                    placeholder="INSIRA DESIGNAÇÃO..."
                                    value={typedAnswer}
                                    onChange={e => setTypedAnswer(e.target.value)}
                                />
                                <button className="absolute right-0 top-0 bottom-0 px-6 bg-red-600 text-white font-bold hover:bg-red-500 transition-colors">
                                    ➜
                                </button>
                            </form>
                        )}

                        {feedback && (
                            <div className={`text-center py-4 font-black italic uppercase text-xl border-l-8 ${feedback === 'CORRECT' ? 'bg-lime-900/20 text-lime-500 border-lime-500' : 'bg-red-900/20 text-red-500 border-red-500'}`}>
                                {feedback === 'CORRECT' ? 'ALVO CONFIRMADO' : 'ALVO INCORRETO'}
                            </div>
                        )}

                        {(mode === 'MENTAL' || feedback) && (
                            <button onClick={handleNext} className="btn-gaming w-full mt-4 bg-red-700 hover:bg-red-600 border-red-500 text-lg">
                                {currentIndex === cards.length - 1 ? 'FINALIZAR MISSÃO' : 'PRÓXIMO ALVO →'}
                            </button>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // STEP 4: SUMMARY
    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto pt-20 text-center animate-fade-in">
                <div className="w-40 h-40 bg-[#121212] rounded-full mx-auto flex items-center justify-center border-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)] mb-8">
                    <svg className="w-24 h-24 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-4">
                    Missão Completa
                </h1>

                {mode === 'TYPING' && (
                    <div className="flex justify-center gap-8 mb-12">
                        <div className="text-center">
                            <div className="text-5xl font-black text-lime-500">{correctCount}</div>
                            <div className="text-xs font-mono text-gray-500 uppercase">Confirmados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-black text-red-500">{cards.length - correctCount}</div>
                            <div className="text-xs font-mono text-gray-500 uppercase">Abortados</div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 max-w-md mx-auto">
                    <button onClick={() => { setStep('SELECT_BATTERY'); setSelectedCat(null); }} className="btn-gaming w-full bg-red-600 hover:bg-red-500">
                        Nova Bateria
                    </button>
                    <a href="/student/dashboard" className="block text-gray-500 hover:text-white uppercase font-mono text-sm tracking-widest mt-6">
                        Retornar ao QG
                    </a>
                </div>
            </div>
        </DashboardLayout>
    );
}
