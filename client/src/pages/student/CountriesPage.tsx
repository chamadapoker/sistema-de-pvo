import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';

export function CountriesPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContinent, setSelectedContinent] = useState<string>('');

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

    const filteredCountries = countries.filter(country => {
        const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesContinent = !selectedContinent || country.continent === selectedContinent;
        return matchesSearch && matchesContinent;
    });

    const continents = Array.from(new Set(countries.map(c => c.continent).filter(Boolean)));

    const formatNumber = (num?: number) => {
        if (!num) return '-';
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-mono">Carregando países...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">ATLAS</span> <span className="text-gray-600">//</span> MILITAR
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">EXPLORE EQUIPAMENTOS POR NAÇÃO</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="gaming-card bg-black border border-[#333] p-6">
                        <div className="text-3xl font-black text-white mb-1">{countries.length}</div>
                        <div className="w-8 h-1 bg-blue-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Países Mapeados</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6">
                        <div className="text-3xl font-black text-white mb-1">
                            {formatNumber(countries.reduce((sum, c) => sum + (c.active_military || 0), 0))}
                        </div>
                        <div className="w-8 h-1 bg-red-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Força Ativa Global</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6">
                        <div className="text-3xl font-black text-white mb-1">
                            ${formatNumber(countries.reduce((sum, c) => sum + (c.military_budget_usd || 0), 0))}
                        </div>
                        <div className="w-8 h-1 bg-green-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Orçamento Total</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6">
                        <div className="text-3xl font-black text-white mb-1">{continents.length}</div>
                        <div className="w-8 h-1 bg-purple-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Continentes</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono uppercase text-gray-500 mb-2">
                                🔍 Buscar País
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Digite o nome ou código..."
                                className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase text-gray-500 mb-2">
                                🌍 Filtrar por Continente
                            </label>
                            <select
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                                className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-blue-600 focus:outline-none"
                            >
                                <option value="">Todos os Continentes</option>
                                {continents.map(continent => (
                                    <option key={continent} value={continent}>{continent}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 font-mono">
                        {filteredCountries.length} {filteredCountries.length === 1 ? 'país encontrado' : 'países encontrados'}
                    </div>
                </div>

                {/* Countries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCountries.map(country => (
                        <Link
                            key={country.id}
                            to={`/student/countries/${country.id}`}
                            className="gaming-card bg-[#0a0a0a] border-2 border-[#333] hover:border-blue-600 transition-all group overflow-hidden"
                        >
                            {/* Flag */}
                            <div className="aspect-video bg-black border-b-2 border-[#333] overflow-hidden relative">
                                {country.flag_url ? (
                                    <img
                                        src={country.flag_url}
                                        alt={`${country.name} flag`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        🏳️
                                    </div>
                                )}
                                {/* Rank Badge */}
                                {country.military_rank && country.military_rank <= 30 && (
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 text-xs font-bold font-mono">
                                        #{country.military_rank}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                                            {country.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-mono">{country.code}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-mono">Capital:</span>
                                        <span className="text-white font-bold">{country.capital || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-mono">🪖 Militares:</span>
                                        <span className="text-red-500 font-bold">{formatNumber(country.active_military)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-mono">💰 Orçamento:</span>
                                        <span className="text-green-500 font-bold">${formatNumber(country.military_budget_usd)}</span>
                                    </div>
                                </div>

                                {/* Region Badge */}
                                <div className="mt-4 pt-3 border-t border-[#333]">
                                    <span className="inline-block px-3 py-1 bg-[#111] border border-[#333] text-xs font-mono text-gray-400">
                                        {country.region || country.continent}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCountries.length === 0 && (
                    <div className="gaming-card bg-[#0a0a0a] border-2 border-blue-900/50 p-16 text-center">
                        <div className="text-8xl mb-4">🔍</div>
                        <h2 className="text-3xl font-black italic text-white uppercase mb-4">Nenhum País Encontrado</h2>
                        <p className="text-gray-400 font-mono">Tente ajustar os filtros de busca</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
