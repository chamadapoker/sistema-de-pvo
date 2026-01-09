import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { TechSheet } from '../../components/ui/TechSheet';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';
import { aiService } from '../../services/aiService';

export function CountryDetailsPage() {
    const { countryId } = useParams<{ countryId: string }>();
    const navigate = useNavigate();

    const [country, setCountry] = useState<Country | null>(null);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchText, setSearchText] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

    // AI & Comparison State
    const [isSelectingCompare, setIsSelectingCompare] = useState(false);
    const [comparingItem, setComparingItem] = useState<any>(null);
    const [intelOpen, setIntelOpen] = useState(false);
    const [intelData, setIntelData] = useState('');
    const [loadingIntel, setLoadingIntel] = useState(false);
    const [isAskingIntel, setIsAskingIntel] = useState(false);
    const [intelQuery, setIntelQuery] = useState('');

    useEffect(() => {
        if (countryId) {
            loadCountryData();
        }
    }, [countryId]);

    const loadCountryData = async () => {
        try {
            const [countryData, equipmentData, statsData] = await Promise.all([
                countryService.getCountry(countryId!),
                countryService.getCountryEquipment(countryId!),
                countryService.getCountryStats(countryId!)
            ]);

            setCountry(countryData);
            setEquipment(equipmentData);
            setStats(statsData);
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao carregar dados do país');
            navigate('/student/countries');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num?: number) => {
        if (!num) return '-';
        return num.toLocaleString('pt-BR');
    };

    const filteredEquipment = equipment.filter(e => {
        const matchesCategory = selectedCategory ? e.categoryName === selectedCategory : true;
        const matchesSearch = searchText ? (e.name.toLowerCase().includes(searchText.toLowerCase()) || e.code.toLowerCase().includes(searchText.toLowerCase())) : true;
        return matchesCategory && matchesSearch;
    });

    const categories = Array.from(new Set(equipment.map(e => e.categoryName))).sort();

    const handleAskIntel = () => {
        setIsAskingIntel(true);
        setIntelQuery('');
        setIntelOpen(false); // Close previous report if open
    };

    const handleGenerateIntel = async () => {
        if (!selectedEquipment || !country) return;
        setLoadingIntel(true);
        setIsAskingIntel(false);
        setIntelOpen(true);
        setIntelData('');
        try {
            const report = await aiService.getTacticalIntel(
                selectedEquipment.name,
                selectedEquipment.categoryName,
                country.name,
                intelQuery || undefined
            );
            setIntelData(report);
        } catch (error) {
            setIntelData('ERRO AO ESTABELECER LINK COM CENTRO DE INTELIGÊNCIA. TENTE NOVAMENTE.');
        } finally {
            setLoadingIntel(false);
        }
    };

    if (loading) return <div className="text-center p-10 font-mono text-red-600 animate-pulse tracking-widest">CARREGANDO INTELIGÊNCIA...</div>;
    if (!country) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start border-b border-red-900/30 pb-6">
                    <img
                        src={country.flagUrl}
                        alt={country.name}
                        className="w-32 h-20 object-cover shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#333]"
                    />
                    <div className="flex-1">
                        <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg flex items-center gap-4">
                            {country.name}
                            <span className="text-red-600 text-lg font-mono font-normal tracking-widest px-2 border border-red-600 rounded bg-red-900/10">ALIANÇA: {country.alliance}</span>
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-3xl font-light leading-relaxed border-l-2 border-red-600 pl-4">
                            {country.description}
                        </p>
                        {country.militaryDescription && (
                            <p className="text-gray-500 mt-2 max-w-3xl font-mono text-xs leading-relaxed pl-4">
                                DOUTRINA: {country.militaryDescription}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/student/countries')}
                        className="btn-gaming text-xs py-2 px-4 bg-[#1a1a1a] border border-[#333] hover:border-red-600 transition-colors"
                    >
                        ← VOLTAR AO MAPA
                    </button>
                </div>

                {/* Status Grid - Intelligence Data */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Global Rank</div>
                        <div className="text-xl md:text-3xl font-black text-white">#{country.militaryRank}</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <div className="w-full h-full border-b-2 border-r-2 border-white"></div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Força Ativa</div>
                        <div className="text-xl md:text-2xl font-black text-lime-500">{formatNumber(country.activeMilitary)}</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Reserva</div>
                        <div className="text-xl md:text-2xl font-black text-gray-400">{formatNumber(country.reserveMilitary)}</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Orçamento (USD)</div>
                        <div className="text-xl md:text-2xl font-black text-green-500">{(country.militaryBudgetUsd ? '$' + (country.militaryBudgetUsd / 1000000000).toFixed(1) + 'B' : '-')}</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">População</div>
                        <div className="text-xl md:text-2xl font-black text-white">{(country.population ? (country.population / 1000000).toFixed(1) + 'M' : '-')}</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-4 relative overflow-hidden group hover:border-red-600 transition-colors">
                        <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Idiomas</div>
                        <div className="text-xs md:text-sm font-bold text-white leading-tight mt-1">
                            {Array.isArray(country.languages) ? country.languages.join(', ') : country.languages || '-'}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-[#0a0a0a] p-4 border border-[#222] items-center">
                    <div className="flex-1 flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 custom-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-[#333] text-gray-500 hover:border-red-600 hover:text-white'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-[#333] text-gray-500 hover:border-red-600 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="BUSCAR EQUIPAMENTO..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-white px-4 py-2 text-xs font-mono focus:border-red-600 focus:outline-none uppercase placeholder-gray-700"
                        />
                        <span className="absolute right-3 top-2 text-gray-600 text-xs">🔍</span>
                    </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredEquipment.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedEquipment(item)}
                            className="group relative aspect-[3/4] bg-black border border-[#333] hover:border-lime-500 transition-all overflow-hidden gaming-card text-left"
                        >
                            <img
                                src={item.imageUrl} // Use thumbnail if available in real app
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                alt={item.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-40 transition-opacity"></div>

                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-0.5 bg-black/80 border border-lime-600 text-lime-400 text-[9px] font-mono font-bold rounded">
                                    {item.categoryName}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <h4 className="font-black text-white text-sm italic uppercase leading-tight group-hover:text-lime-400 transition-colors">
                                    {item.name}
                                </h4>
                            </div>
                        </button>
                    ))}
                </div>

                {/* MODAL / COMPARISON SYSTEM */}
                {selectedEquipment && (
                    <div
                        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black animate-fade-in"
                        onClick={() => {
                            setSelectedEquipment(null);
                            setComparingItem(null);
                            setIsSelectingCompare(false);
                            setIntelOpen(false);
                        }}
                    >
                        <div
                            className={`bg-[#0a0a0a] border-2 border-lime-900 w-full transition-all duration-500 ease-in-out h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(101,163,13,0.2)] ${comparingItem || isSelectingCompare ? 'max-w-[95vw]' : 'max-w-6xl'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* --- COLUNA ESQUERDA (ITEM PRINCIPAL) --- */}
                            <div className={`${comparingItem || isSelectingCompare ? 'w-full md:w-1/2 border-r border-[#333]' : 'w-full md:w-2/3 border-r border-[#222]'} bg-black relative flex flex-col transition-all duration-500`}>
                                {/* Header Item Principal */}
                                <div className="absolute top-0 left-0 p-4 z-10 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                    <h2 className="text-2xl md:text-3xl font-black italic text-white uppercase drop-shadow-lg">{selectedEquipment.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lime-500 font-mono text-xs shadow-black drop-shadow-md">{selectedEquipment.categoryName} // {country.name}</p>
                                        {/* TAG DE FONTE */}
                                        <span className={`text-[9px] px-1.5 py-0.5 border rounded font-bold uppercase tracking-widest ${selectedEquipment.descriptionSource === 'AI_GENERATED' || (selectedEquipment.description && selectedEquipment.description.includes('**ANÁLISE PVO:**'))
                                            ? 'border-purple-500 text-purple-400 bg-purple-900/40'
                                            : 'border-blue-500 text-blue-400 bg-blue-900/40'
                                            }`}>
                                            {selectedEquipment.descriptionSource === 'AI_GENERATED' || (selectedEquipment.description && selectedEquipment.description.includes('**ANÁLISE PVO:**')) ? '🤖 IA Analysis' : '👤 Instrutor'}
                                        </span>
                                    </div>
                                </div>

                                {/* Imagem e Specs do Item Principal */}
                                <div className={`flex-1 relative ${comparingItem ? 'flex flex-col' : ''}`}>
                                    {/* Se comparando, a imagem fica no topo (50% height) e specs embaixo. Se não, layout normal (imagem full) */}
                                    <div className={`${comparingItem ? 'h-1/2 border-b border-[#222]' : 'h-full'} w-full flex items-center justify-center p-8 bg-black`}>
                                        <ZoomableImage
                                            src={selectedEquipment.imageUrl}
                                            alt={selectedEquipment.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    {comparingItem && (
                                        <div className="h-1/2 overflow-y-auto p-6 custom-scrollbar bg-[#0f0f0f]">
                                            <TechSheet markdown={selectedEquipment.description || ''} />
                                        </div>
                                    )}
                                </div>

                                {/* Botão de Ação -> Comparar (Só aparece se não estiver comparando ou selecionando) */}
                                {!comparingItem && !isSelectingCompare && (
                                    <div className="absolute bottom-4 right-4 z-20">
                                        <button
                                            onClick={() => setIsSelectingCompare(true)}
                                            className="btn-gaming bg-blue-900/20 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center gap-2"
                                        >
                                            <span className="text-lg">⇄</span> COMPARAR
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* --- COLUNA DIREITA (INTERATIVA) --- */}
                            <div className={`${comparingItem || isSelectingCompare ? 'w-full md:w-1/2' : 'w-full md:w-1/3'} bg-[#0f0f0f] flex flex-col transition-all duration-500`}>

                                {/* CASE 1: MODO COMPARAÇÃO ATIVO (MOSTRANDO ITEM B) */}
                                {comparingItem ? (
                                    <div className="flex flex-col h-full relative">
                                        <div className="absolute top-0 right-0 p-4 z-20">
                                            <button
                                                onClick={() => setComparingItem(null)}
                                                className="bg-red-900/50 hover:bg-red-600 text-white px-3 py-1 text-xs border border-red-500 uppercase font-bold"
                                            >
                                                Encerrar Comparação ✕
                                            </button>
                                        </div>

                                        {/* Header Item B */}
                                        <div className="absolute top-0 left-0 p-4 z-10 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                            <h2 className="text-2xl md:text-3xl font-black italic text-white uppercase drop-shadow-lg text-right pr-12">{comparingItem.name}</h2>
                                            <div className="flex items-center gap-2 justify-end pr-12">
                                                <span className={`text-[9px] px-1.5 py-0.5 border rounded font-bold uppercase tracking-widest bg-black/50 ${comparingItem.descriptionSource === 'AI_GENERATED' || (comparingItem.description && comparingItem.description.includes('**ANÁLISE PVO:**'))
                                                    ? 'border-purple-500 text-purple-400'
                                                    : 'border-blue-500 text-blue-400'
                                                    }`}>
                                                    {comparingItem.descriptionSource === 'AI_GENERATED' || (comparingItem.description && comparingItem.description.includes('**ANÁLISE PVO:**')) ? '🤖 IA Analysis' : '👤 Instrutor'}
                                                </span>
                                                <p className="text-yellow-500 font-mono text-xs shadow-black drop-shadow-md">{comparingItem.categoryName} // {country.name}</p>
                                            </div>
                                        </div>

                                        <div className="h-1/2 w-full flex items-center justify-center p-8 bg-[#080808] border-b border-[#222]">
                                            <ZoomableImage
                                                src={comparingItem.imageUrl}
                                                alt={comparingItem.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="h-1/2 overflow-y-auto p-6 custom-scrollbar bg-[#111]">
                                            <TechSheet markdown={comparingItem.description || ''} />
                                        </div>
                                    </div>

                                    /* CASE 2: MODO SELEÇÃO (ESCOLHER ITEM B) */
                                ) : isSelectingCompare ? (
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                                            <h3 className="text-white font-bold uppercase italic text-lg">Selecione para Comparar</h3>
                                            <button
                                                onClick={() => setIsSelectingCompare(false)}
                                                className="text-gray-500 hover:text-white"
                                            >
                                                CANCELAR
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {equipment
                                                    .filter(e => e.categoryName === selectedEquipment.categoryName && e.id !== selectedEquipment.id)
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
                                                                <img src={target.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xs uppercase">{target.name}</div>
                                                                <div className="text-gray-500 text-[10px] font-mono">{target.code}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                {equipment.filter(e => e.categoryName === selectedEquipment.categoryName && e.id !== selectedEquipment.id).length === 0 && (
                                                    <div className="col-span-2 text-center p-10 text-gray-600 font-mono text-xs">
                                                        Nenhum outro equipamento similar encontrado nesta categoria.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    /* CASE 2.5: ASKING INTEL MODE */
                                ) : isAskingIntel ? (
                                    <div className="flex flex-col h-full bg-[#111] border-l border-red-900/30 animate-fade-in">
                                        <div className="p-4 border-b border-red-900/30 bg-red-900/10">
                                            <h3 className="text-red-500 font-black italic uppercase text-lg">⚠️ REQUISIÇÃO DE INTELIGÊNCIA</h3>
                                            <p className="text-[10px] font-mono text-gray-400 mt-1">Especifique sua necessidade de informação tática sobre este ativo estrangeiro.</p>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <textarea
                                                className="w-full flex-1 bg-[#050505] border border-[#333] p-4 text-white text-sm font-mono focus:border-red-600 focus:outline-none resize-none"
                                                placeholder="Ex: Como este equipamento se compara às nossas contramedidas? Há relatórios de exportação para países hostis?"
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

                                    /* CASE 3: VISUALIZAÇÃO PADRÃO (DETAILS) */
                                ) : (
                                    <>
                                        <div className="p-6 border-b border-[#222] bg-[#111] flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">FICHA TÉCNICA</span>
                                                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-400">
                                                    <div>
                                                        <span className="text-red-500 block">FABRICANTE</span>
                                                        {selectedEquipment.manufacturer || 'Desconhecido'}
                                                    </div>
                                                    <div>
                                                        <span className="text-red-500 block">ANO</span>
                                                        {selectedEquipment.year || 'N/A'}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-red-500 block">ORIGEM</span>
                                                        {selectedEquipment.origin || 'Desconhecida'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedEquipment(null)}
                                                className="w-8 h-8 flex items-center justify-center border border-red-900/50 hover:bg-red-900 text-gray-500 hover:text-white transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                            <TechSheet markdown={selectedEquipment.description || ''} />
                                        </div>
                                        <div className="p-4 border-t border-[#222] bg-[#050505] flex justify-between items-center relative">
                                            <div className="text-[10px] font-mono text-gray-600 uppercase text-center flex-1">
                                                PVO DATABASE // {new Date().getFullYear()}
                                            </div>
                                            <button
                                                onClick={handleAskIntel}
                                                disabled={loadingIntel}
                                                className="absolute bottom-2 right-2 text-[10px] bg-red-900/10 text-red-500 hover:text-white border border-red-900 hover:bg-red-900 px-3 py-1 font-bold uppercase transition-all disabled:opacity-50"
                                            >
                                                {loadingIntel ? 'TRANSMITINDO...' : '📡 SOLICITAR INTEL REPORT'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* --- ABA DE INTELIGÊNCIA (OVERLAY) --- */}
                            {intelOpen && !comparingItem && !isSelectingCompare && !isAskingIntel && (
                                <div className="absolute top-0 right-0 w-full md:w-1/3 bg-[#0a0a0a]/95 h-full border-l border-red-900/50 flex flex-col animate-fade-in z-50 backdrop-blur-xl">
                                    <div className="p-4 border-b border-red-900/30 flex justify-between items-center bg-red-900/5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${loadingIntel ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
                                            <h3 className="text-red-500 font-black italic uppercase">RELATÓRIO DE CAMPO AI</h3>
                                        </div>
                                        <button onClick={() => setIntelOpen(false)} className="text-gray-500 hover:text-white font-mono">⚡ FECHAR</button>
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
                                    <div className="p-2 border-t border-red-900/30 bg-black text-[9px] text-gray-600 font-mono text-center">
                                        DADOS GERADOS VIA SATÉLITE EM TEMPO REAL. CONFIRMAÇÃO VISUAL RECOMENDADA.
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
