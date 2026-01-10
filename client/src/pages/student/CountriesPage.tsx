import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';

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
        </DashboardLayout>
    );
}
