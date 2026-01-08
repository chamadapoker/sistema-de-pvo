import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { TechSheet } from '../../components/ui/TechSheet';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';

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
                                { /* Correctly Removed Code Display */}
                                <h4 className="font-black text-white text-sm italic uppercase leading-tight group-hover:text-lime-400 transition-colors">
                                    {item.name}
                                </h4>
                            </div>
                        </button>
                    ))}
                </div>

                {/* MODAL (Reused/Adapted Design from TrainingPage) */}
                {selectedEquipment && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setSelectedEquipment(null)}>
                        <div
                            className="bg-[#0a0a0a] border-2 border-lime-900 w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(101,163,13,0.2)] animate-scale-in"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* LEFT: IMAGE */}
                            <div className="w-full md:w-2/3 bg-black relative border-r border-[#222]">
                                <div className="absolute top-0 left-0 p-4 z-10">
                                    <h2 className="text-3xl font-black italic text-white uppercase">{selectedEquipment.name}</h2>
                                    <p className="text-lime-500 font-mono text-xs">{selectedEquipment.categoryName} // {country.name}</p>
                                </div>
                                <div className="w-full h-full flex items-center justify-center p-8">
                                    <ZoomableImage
                                        src={selectedEquipment.imageUrl}
                                        alt={selectedEquipment.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* RIGHT: DATA */}
                            <div className="w-full md:w-1/3 bg-[#0f0f0f] lex flex-col flex">
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
                                <div className="p-4 border-t border-[#222] bg-[#050505]">
                                    <div className="text-[10px] font-mono text-gray-600 uppercase text-center">
                                        PVO DATABASE // {new Date().getFullYear()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
