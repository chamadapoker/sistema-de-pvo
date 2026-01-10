import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';
import { aiService } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';

export function CountriesPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContinent, setSelectedContinent] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'map' | 'alliances'>('grid');
    const [sortBy, setSortBy] = useState<'rank' | 'budget' | 'power'>('rank');

    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            const data = await countryService.getAllCountries();
            setCountries(data);
        } catch (error) {
            console.error('Error loading countries:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num?: number) => {
        if (!num) return '-';
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getMobilizationForce = (c: Country) => (c.activeMilitary || 0) + (c.reserveMilitary || 0);

    // Alliance Aggregation Logic (The "Query de Milhões")
    const allianceStats = useMemo(() => {
        const stats = countries.reduce((acc, country) => {
            const alliance = country.alliance || 'Non-Aligned';
            if (!acc[alliance]) {
                acc[alliance] = {
                    name: alliance,
                    count: 0,
                    totalBudget: 0,
                    totalActive: 0,
                    totalReserve: 0,
                    rankSum: 0
                };
            }
            acc[alliance].count += 1;
            acc[alliance].totalBudget += (country.militaryBudgetUsd || 0);
            acc[alliance].totalActive += (country.activeMilitary || 0);
            acc[alliance].totalReserve += (country.reserveMilitary || 0);
            acc[alliance].rankSum += (country.militaryRank || 0);
            return acc;
        }, {} as Record<string, any>);

        return Object.values(stats).map(stat => ({
            ...stat,
            avgRank: stat.count > 0 ? (stat.rankSum / stat.count).toFixed(1) : 0,
            totalForce: stat.totalActive + stat.totalReserve,
            budgetBillions: stat.totalBudget / 1000000000
        })).sort((a, b) => b.totalBudget - a.totalBudget);
    }, [countries]);

    const filteredAndSortedCountries = useMemo(() => {
        let result = countries.filter(country => {
            const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                country.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesContinent = !selectedContinent || country.continent === selectedContinent;
            return matchesSearch && matchesContinent;
        });

        return result.sort((a, b) => {
            if (sortBy === 'rank') return (a.militaryRank || 999) - (b.militaryRank || 999);
            if (sortBy === 'budget') return (b.militaryBudgetUsd || 0) - (a.militaryBudgetUsd || 0);
            if (sortBy === 'power') return getMobilizationForce(b) - getMobilizationForce(a);
            return 0;
        });
    }, [countries, searchTerm, selectedContinent, sortBy]);

    const continents = Array.from(new Set(countries.map(c => c.continent).filter(Boolean)));
    const totalActive = countries.reduce((sum, c) => sum + (c.activeMilitary || 0), 0);
    const totalReserve = countries.reduce((sum, c) => sum + (c.reserveMilitary || 0), 0);
    const totalBudget = countries.reduce((sum, c) => sum + (c.militaryBudgetUsd || 0), 0);

    // Map Helper Functions
    const getX = (long?: number) => ((long || 0) + 180) * (100 / 360);
    const getY = (lat?: number) => (90 - (lat || 0)) * (100 / 180);

    // Bubble Size Calculation
    const maxBudget = Math.max(...countries.map(c => c.militaryBudgetUsd || 0));
    const getBubbleSize = (budget?: number) => {
        if (!budget) return 4;
        // Logarithmic scale for better visual distribution
        const minSize = 6;
        const maxSize = 40;
        const scale = Math.log(budget) / Math.log(maxBudget);
        return Math.max(minSize, scale * maxSize);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-mono tracking-widest uppercase">Carregando dados globais...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-red-900/30 pb-4 gap-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">ATLAS</span> <span className="text-gray-600">//</span> WAR_ROOM
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">INTELIGÊNCIA MILITAR GLOBAL</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#111] p-1 rounded border border-[#333]">
                        <button
                            onClick={() => setShowComparison(true)}
                            className="mr-2 px-4 py-1 flex items-center gap-2 text-xs font-mono uppercase bg-red-600 text-white font-bold hover:bg-red-500 transition-colors animate-pulse"
                        >
                            <span>⚔️ WAR GAME</span>
                        </button>
                        <div className="w-px h-6 bg-[#333] mx-2"></div>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-1 flex items-center gap-2 text-xs font-mono uppercase transition-colors ${viewMode === 'grid' ? 'bg-red-900/30 text-red-500 border border-red-900/50' : 'text-gray-500 hover:text-white'}`}
                        >
                            <span>GRID</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-1 flex items-center gap-2 text-xs font-mono uppercase transition-colors ${viewMode === 'map' ? 'bg-red-900/30 text-red-500 border border-red-900/50' : 'text-gray-500 hover:text-white'}`}
                        >
                            <span>MAPA ESTRATÉGICO</span>
                        </button>
                        <button
                            onClick={() => setViewMode('alliances')}
                            className={`px-4 py-1 flex items-center gap-2 text-xs font-mono uppercase transition-colors ${viewMode === 'alliances' ? 'bg-red-900/30 text-red-500 border border-red-900/50' : 'text-gray-500 hover:text-white'}`}
                        >
                            <span>ALIANÇAS</span>
                        </button>
                    </div>
                </div>

                {/* Global KPI */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="gaming-card bg-black border border-[#333] p-4 group hover:border-red-600 transition-colors">
                        <div className="text-xs text-gray-500 font-mono uppercase mb-1">Nações Monitoradas</div>
                        <div className="text-2xl font-black text-white">{countries.length}</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-4 group hover:border-red-600 transition-colors">
                        <div className="text-xs text-gray-500 font-mono uppercase mb-1">Mobilização Global</div>
                        <div className="text-2xl font-black text-white flex items-baseline gap-2">
                            {formatNumber(totalActive + totalReserve)}
                            <span className="text-[10px] text-gray-600 font-normal">PERS: {formatNumber(totalActive)} ATIVO</span>
                        </div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-4 group hover:border-lime-600 transition-colors">
                        <div className="text-xs text-gray-500 font-mono uppercase mb-1">Orçamento Defesa</div>
                        <div className="text-2xl font-black text-lime-500">${formatNumber(totalBudget)}</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-4 group hover:border-red-600 transition-colors">
                        <div className="text-xs text-gray-500 font-mono uppercase mb-1">Hotspots</div>
                        <div className="text-2xl font-black text-white">{continents.length} <span className="text-xs text-gray-600">REGIONS</span></div>
                    </div>
                </div>

                {/* Controls (Hidden in Map Mode to save space, or visible?) - Visible for now */}
                {viewMode !== 'alliances' && (
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-4 sticky top-4 z-30 shadow-xl backdrop-blur-md bg-opacity-90">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Busca</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="PROCURAR PAÍS..."
                                    className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 text-sm font-mono focus:border-red-600 focus:outline-none uppercase"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Continente</label>
                                <select
                                    value={selectedContinent}
                                    onChange={(e) => setSelectedContinent(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 text-sm font-mono focus:border-red-600 focus:outline-none uppercase"
                                >
                                    <option value="">Global</option>
                                    {continents.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="w-full md:w-48">
                                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Ordenar Por</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 text-sm font-mono focus:border-red-600 focus:outline-none uppercase"
                                >
                                    <option value="rank">Ranking Militar</option>
                                    <option value="power">Força Total (Ativa+Res)</option>
                                    <option value="budget">Orçamento (USD)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW MODES */}
                {viewMode === 'map' && (
                    <div className="gaming-card bg-[#050505] border border-[#333] relative overflow-hidden aspect-[16/9] md:aspect-[2/1] group">
                        {/* Map Grid / Background */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                                backgroundSize: '4% 8%'
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none select-none opacity-30">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/2560px-Equirectangular_projection_SW.jpg"
                                className="w-full h-full object-fill mix-blend-overlay grayscale contrast-150"
                                alt="World Map Strat Layer"
                            />
                            <div className="absolute inset-0 bg-black/50"></div>
                        </div>

                        {/* Plots */}
                        {filteredAndSortedCountries.map(country => {
                            if (country.latitude === undefined || country.longitude === undefined) return null;
                            const size = getBubbleSize(country.militaryBudgetUsd);
                            const isPowerful = (country.militaryRank || 999) <= 10;

                            return (
                                <Link
                                    key={country.id}
                                    to={`/student/countries/${country.id}`}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 hover:scale-125 hover:z-50 transition-all duration-300 hover:border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer flex items-center justify-center group/bubble"
                                    style={{
                                        left: `${getX(country.longitude)}%`,
                                        top: `${getY(country.latitude)}%`,
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        backgroundColor: isPowerful ? 'rgba(220, 38, 38, 0.6)' : 'rgba(100, 116, 139, 0.4)'
                                    }}
                                >
                                    {isPowerful && <div className="absolute -inset-1 rounded-full bg-red-600/20 animate-pulse"></div>}

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/bubble:block z-50 whitespace-nowrap">
                                        <div className="bg-black/90 border border-red-600 p-2 text-xs">
                                            <div className="font-bold text-white uppercase">{country.name}</div>
                                            <div className="text-red-500 font-mono">RANK #{country.militaryRank}</div>
                                            <div className="text-lime-500 font-mono">${formatNumber(country.militaryBudgetUsd)}</div>
                                            <div className="text-gray-400 text-[10px]">MOB: {formatNumber(getMobilizationForce(country))}</div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {viewMode === 'alliances' && (
                    <div className="space-y-6">
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6 animate-fade-in">
                            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Analise de Alianças <span className="text-red-600">//</span> POWER BLOCS</h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono">
                                    <thead>
                                        <tr className="border-b-2 border-red-900 text-xs text-red-500 uppercase tracking-widest">
                                            <th className="py-2">Aliança / Bloco</th>
                                            <th className="py-2 text-center">Nº Países</th>
                                            <th className="py-2 text-right">Orçamento (Bi USD)</th>
                                            <th className="py-2 text-right">Rank Médio</th>
                                            <th className="py-2 text-right">Força Total (M)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {allianceStats.map((stat, idx) => (
                                            <tr key={stat.name} className="border-b border-[#222] hover:bg-[#111] transition-colors group">
                                                <td className="py-4 font-bold text-white text-lg uppercase flex items-center gap-2">
                                                    <span className="text-gray-600 text-xs">#{idx + 1}</span>
                                                    {stat.name}
                                                    {(stat.name === 'NATO' || stat.name === 'OTAN') && <span className="text-[10px] bg-blue-900 text-blue-200 px-1 rounded">BLUE</span>}
                                                    {stat.name === 'BRICS+' && <span className="text-[10px] bg-red-900 text-red-200 px-1 rounded">RED</span>}
                                                </td>
                                                <td className="py-4 text-center text-gray-400">{stat.count}</td>
                                                <td className="py-4 text-right text-lime-500 font-bold">${(stat.budgetBillions || 0).toFixed(1)}B</td>
                                                <td className="py-4 text-right text-gray-300">{stat.avgRank}</td>
                                                <td className="py-4 text-right text-white font-bold">{formatNumber(stat.totalForce)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Visual Comparison Charts (Mock style with Divs) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="gaming-card bg-black border border-[#333] p-6">
                                <h4 className="text-xs font-mono text-gray-500 uppercase mb-4">Participação no Orçamento Global</h4>
                                <div className="space-y-4">
                                    {allianceStats.map(stat => (
                                        <div key={stat.name}>
                                            <div className="flex justify-between text-xs mb-1 uppercase font-bold">
                                                <span className="text-gray-300">{stat.name}</span>
                                                <span className="text-lime-500">{(stat.budgetBillions / (totalBudget / 1000000000) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-lime-600"
                                                    style={{ width: `${(stat.budgetBillions / (totalBudget / 1000000000) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="gaming-card bg-black border border-[#333] p-6">
                                <h4 className="text-xs font-mono text-gray-500 uppercase mb-4">Concentração de Força Humana</h4>
                                <div className="space-y-4">
                                    {allianceStats.map(stat => (
                                        <div key={stat.name}>
                                            <div className="flex justify-between text-xs mb-1 uppercase font-bold">
                                                <span className="text-gray-300">{stat.name}</span>
                                                <span className="text-white">{(stat.totalForce / (totalActive + totalReserve) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-600"
                                                    style={{ width: `${(stat.totalForce / (totalActive + totalReserve) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedCountries.map((country, index) => (
                            <Link
                                key={country.id}
                                to={`/student/countries/${country.id}`}
                                className="gaming-card bg-[#0a0a0a] border border-[#333] hover:border-red-600 transition-all group overflow-hidden flex flex-col"
                            >
                                <div className="h-32 relative bg-black overflow-hidden border-b border-[#333]">
                                    {country.flagUrl ? (
                                        <img
                                            src={country.flagUrl}
                                            alt={country.name}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">🏳️</div>
                                    )}
                                    <div className="absolute top-0 left-0 bg-black/80 px-2 py-1 border-r border-b border-[#333] text-[10px] mobile-font text-red-500">
                                        RANK #{country.militaryRank || 'N/A'}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-red-900/90 px-2 py-1 text-[10px] font-bold text-white font-mono">
                                        {country.code}
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-black text-white italic uppercase mb-3 truncate group-hover:text-red-500 transition-colors">
                                        <span className="text-gray-600 text-xs mr-2">#{index + 1}</span>
                                        {country.name}
                                    </h3>

                                    <div className="space-y-2 text-[11px] font-mono mt-auto">
                                        {/* Firepower Bar */}
                                        <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden mb-1">
                                            <div
                                                className="h-full bg-gradient-to-r from-red-900 to-red-500"
                                                style={{ width: `${Math.min(((country.activeMilitary || 0) / 2000000) * 100, 100)}%` }} // 2M reference max
                                            />
                                        </div>

                                        <div className="flex justify-between items-center text-gray-400">
                                            <span>ATIVOS</span>
                                            <span className="text-white">{formatNumber(country.activeMilitary)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-400">
                                            <span>RESERVA</span>
                                            <span className="text-gray-500">{formatNumber(country.reserveMilitary)}</span>
                                        </div>
                                        <div className="border-t border-[#222] my-1 pt-1 flex justify-between items-center">
                                            <span className="text-lime-600">ORÇAMENTO</span>
                                            <span className="text-lime-400 font-bold">${formatNumber(country.militaryBudgetUsd)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <ComparisonModal
                isOpen={showComparison}
                onClose={() => setShowComparison(false)}
                countries={countries}
            />
        </DashboardLayout>
    );
}

function ComparisonModal({ isOpen, onClose, countries }: { isOpen: boolean; onClose: () => void; countries: Country[] }) {
    const [selectedIdA, setSelectedIdA] = useState<number | ''>('');
    const [selectedIdB, setSelectedIdB] = useState<number | ''>('');
    const [analyzing, setAnalyzing] = useState(false);
    const [report, setReport] = useState<string | null>(null);

    const countryA = countries.find(c => c.id === Number(selectedIdA));
    const countryB = countries.find(c => c.id === Number(selectedIdB));

    const handleSimulation = async () => {
        if (!countryA || !countryB) return;
        setAnalyzing(true);
        setReport(null);
        try {
            const result = await aiService.compareCountries(countryA.name, countryB.name);
            setReport(result);
        } catch (error) {
            setReport("ERRO CRÍTICO NO WAR ROOM: Falha ao conectar com o serviço de inteligência artificial.");
        } finally {
            setAnalyzing(false);
        }
    };

    const formatNumber = (num?: number) => {
        if (!num) return '-';
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#050505] border border-red-900 w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                {/* Modal Header */}
                <div className="flex items-center justify-center p-4 border-b border-red-900/30 bg-red-950/10 relative">
                    <h2 className="text-3xl font-black italic text-red-500 uppercase tracking-widest drop-shadow-lg animate-pulse">
                        WAR ROOM // SIMULATION
                    </h2>
                    <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-white">✕</button>

                    {/* Decorative Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-10"
                        style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #ff0000 25%, #ff0000 26%, transparent 27%, transparent 74%, #ff0000 75%, #ff0000 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ff0000 25%, #ff0000 26%, transparent 27%, transparent 74%, #ff0000 75%, #ff0000 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">

                    {/* Selector Area */}
                    {!report && !analyzing && (
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 h-full">
                            {/* Side A */}
                            <div className="flex-1 w-full max-w-sm space-y-4">
                                <div className="text-center font-mono text-blue-500 text-xl tracking-widest">FORÇA AZUL</div>
                                <select
                                    value={selectedIdA}
                                    onChange={(e) => setSelectedIdA(Number(e.target.value))}
                                    className="w-full bg-[#111] border border-blue-900 text-white p-4 text-lg font-bold uppercase focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Selecione Nação...</option>
                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {countryA && (
                                    <div className="bg-blue-900/10 border border-blue-900/30 p-4 text-center animate-fade-in">
                                        <img src={countryA.flagUrl} alt={countryA.name} className="h-24 mx-auto mb-4 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                        <div className="text-2xl font-black text-white uppercase">{countryA.name}</div>
                                        <div className="font-mono text-blue-400 text-sm">Rank #{countryA.militaryRank}</div>
                                    </div>
                                )}
                            </div>

                            {/* VS Badge */}
                            <div className="text-6xl font-black italic text-gray-700 select-none">VS</div>

                            {/* Side B */}
                            <div className="flex-1 w-full max-w-sm space-y-4">
                                <div className="text-center font-mono text-red-500 text-xl tracking-widest">FORÇA VERMELHA</div>
                                <select
                                    value={selectedIdB}
                                    onChange={(e) => setSelectedIdB(Number(e.target.value))}
                                    className="w-full bg-[#111] border border-red-900 text-white p-4 text-lg font-bold uppercase focus:outline-none focus:border-red-500 transition-colors"
                                >
                                    <option value="">Selecione Nação...</option>
                                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {countryB && (
                                    <div className="bg-red-900/10 border border-red-900/30 p-4 text-center animate-fade-in">
                                        <img src={countryB.flagUrl} alt={countryB.name} className="h-24 mx-auto mb-4 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                        <div className="text-2xl font-black text-white uppercase">{countryB.name}</div>
                                        <div className="font-mono text-red-400 text-sm">Rank #{countryB.militaryRank}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Simulation Running */}
                    {analyzing && (
                        <div className="flex flex-col items-center justify-center h-full space-y-8">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-red-500 border-l-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-red-500 animate-pulse">AI</div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Processando Cenários de Combate</h3>
                                <p className="font-mono text-gray-500 text-sm typewriter">Analisando doutrinas... Comparando logística... Simulando variantes...</p>
                            </div>
                        </div>
                    )}

                    {/* Report Result */}
                    {report && countryA && countryB && (
                        <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-20">
                            {/* Match Header */}
                            <div className="flex items-center justify-between border-b border-[#333] pb-4">
                                <div className="flex items-center gap-4">
                                    <img src={countryA.flagUrl} className="h-12 border border-[#444]" />
                                    <span className="text-2xl font-black text-white uppercase">{countryA.name}</span>
                                </div>
                                <span className="text-red-600 font-bold text-xl italic">VS</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-white uppercase">{countryB.name}</span>
                                    <img src={countryB.flagUrl} className="h-12 border border-[#444]" />
                                </div>
                            </div>

                            {/* Stats Comparison Table */}
                            <div className="grid grid-cols-3 gap-y-4 gap-x-8 text-center font-mono text-sm bg-[#111] p-6 border border-[#222]">
                                <div className="text-gray-500">POPULAÇÃO</div>
                                <div className={countryA.population! > countryB.population! ? "text-green-500 font-bold" : "text-white"}>{formatNumber(countryA.population)}</div>
                                <div className={countryB.population! > countryA.population! ? "text-green-500 font-bold" : "text-white"}>{formatNumber(countryB.population)}</div>

                                <div className="text-gray-500">ORÇAMENTO</div>
                                <div className={countryA.militaryBudgetUsd! > countryB.militaryBudgetUsd! ? "text-green-500 font-bold" : "text-white"}>${formatNumber(countryA.militaryBudgetUsd)}</div>
                                <div className={countryB.militaryBudgetUsd! > countryA.militaryBudgetUsd! ? "text-green-500 font-bold" : "text-white"}>${formatNumber(countryB.militaryBudgetUsd)}</div>

                                <div className="text-gray-500">FORÇA ATIVA</div>
                                <div className={countryA.activeMilitary! > countryB.activeMilitary! ? "text-green-500 font-bold" : "text-white"}>{formatNumber(countryA.activeMilitary)}</div>
                                <div className={countryB.activeMilitary! > countryA.activeMilitary! ? "text-green-500 font-bold" : "text-white"}>{formatNumber(countryB.activeMilitary)}</div>
                            </div>

                            {/* Markdown Report */}
                            <div className="prose prose-invert prose-red max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-black text-red-500 uppercase border-l-4 border-red-600 pl-3 mt-8 mb-4 tracking-widest bg-red-950/10 py-1" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 text-gray-300" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                    }}
                                >
                                    {report}
                                </ReactMarkdown>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => setReport(null)}
                                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                >
                                    NOVA SIMULAÇÃO
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                {!report && !analyzing && (
                    <div className="p-6 border-t border-red-900/30 bg-black flex justify-center">
                        <button
                            disabled={!selectedIdA || !selectedIdB || selectedIdA === selectedIdB}
                            onClick={handleSimulation}
                            className="px-12 py-4 text-xl font-black italic uppercase tracking-tighter bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] clip-path-polygon"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
                        >
                            INICIAR WAR GAME
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
