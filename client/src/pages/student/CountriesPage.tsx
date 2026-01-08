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
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">ATLAS</span> <span className="text-gray-600">//</span> MILITAR
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">EXPLORE EQUIPAMENTOS POR NAÇÃO</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="gaming-card bg-black border border-[#333] p-6 hover:border-red-600 transition-colors">
                        <div className="text-3xl font-black text-white mb-1">{countries.length}</div>
                        <div className="w-8 h-1 bg-red-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Países Mapeados</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6 hover:border-red-600 transition-colors">
                        <div className="text-3xl font-black text-white mb-1">
                            {formatNumber(countries.reduce((sum, c) => sum + (c.activeMilitary || 0), 0))}
                        </div>
                        <div className="w-8 h-1 bg-red-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Força Ativa Global</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6 hover:border-red-600 transition-colors">
                        <div className="text-3xl font-black text-white mb-1">
                            ${formatNumber(countries.reduce((sum, c) => sum + (c.militaryBudgetUsd || 0), 0))}
                        </div>
                        <div className="w-8 h-1 bg-lime-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Orçamento Total</div>
                    </div>
                    <div className="gaming-card bg-black border border-[#333] p-6 hover:border-red-600 transition-colors">
                        <div className="text-3xl font-black text-white mb-1">{continents.length}</div>
                        <div className="w-8 h-1 bg-gray-600 mb-3"></div>
                        <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Continentes</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-mono uppercase text-lime-500 mb-2">
                                🔍 Buscar País
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Digite o nome ou código..."
                                className="w-full bg-[#111] border border-[#333] text-white px-4 py-3 font-mono focus:border-red-600 focus:outline-none placeholder-gray-700 uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase text-lime-500 mb-2">
                                🌍 Filtrar por Continente
                            </label>
                            <select
                                value={selectedContinent}
                                onChange={(e) => setSelectedContinent(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] text-white px-4 py-3 font-mono focus:border-red-600 focus:outline-none uppercase"
                            >
                                <option value="">Todos os Continentes</option>
                                {continents.map(continent => (
                                    <option key={continent} value={continent}>{continent}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600 font-mono uppercase tracking-widest border-t border-[#222] pt-3">
                        {filteredCountries.length} {filteredCountries.length === 1 ? 'nação encontrada' : 'nações encontradas'}
                    </div>
                </div>

                {/* Countries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCountries.map(country => (
                        <Link
                            key={country.id}
                            to={`/student/countries/${country.id}`}
                            className="gaming-card bg-[#0a0a0a] border border-[#333] hover:border-red-600 transition-all group overflow-hidden"
                        >
                            {/* Flag */}
                            <div className="aspect-video bg-black border-b border-[#333] overflow-hidden relative">
                                {country.flagUrl ? (
                                    <img
                                        src={country.flagUrl}
                                        alt={`${country.name} flag`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-700">
                                        🏳️
                                    </div>
                                )}
                                {/* Rank Badge */}
                                {country.militaryRank && country.militaryRank <= 50 && (
                                    <div className="absolute top-2 right-2 bg-red-900/90 border border-red-600 text-white px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider">
                                        RK #{country.militaryRank}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 bg-gradient-to-b from-[#111] to-black">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-white italic uppercase group-hover:text-red-500 transition-colors line-clamp-1">
                                            {country.name}
                                        </h3>
                                        <p className="text-[10px] text-lime-500 font-mono">{country.code}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-2 text-[10px] uppercase">
                                    <div className="flex justify-between border-b border-[#222] pb-1">
                                        <span className="text-gray-500 font-mono">Capital</span>
                                        <span className="text-gray-300 font-bold">{country.capital || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#222] pb-1">
                                        <span className="text-gray-500 font-mono">Força Ativa</span>
                                        <span className="text-red-500 font-bold font-mono">{formatNumber(country.activeMilitary)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-mono">Budget</span>
                                        <span className="text-lime-500 font-bold font-mono">${formatNumber(country.militaryBudgetUsd)}</span>
                                    </div>
                                </div>

                                {/* Region Badge */}
                                <div className="mt-4 pt-3 border-t border-[#333] flex justify-between items-center">
                                    <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] border border-[#333] text-[9px] font-mono text-gray-500 uppercase group-hover:border-gray-500 transition-colors">
                                        {country.region || country.continent}
                                    </span>
                                    <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCountries.length === 0 && (
                    <div className="gaming-card bg-[#0a0a0a] border-2 border-red-900/50 p-16 text-center animate-fade-in">
                        <div className="text-6xl mb-4 opacity-50">📡</div>
                        <h2 className="text-2xl font-black italic text-white uppercase mb-2">Nenhum Alvo Localizado</h2>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Ajuste os parâmetros de busca</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
