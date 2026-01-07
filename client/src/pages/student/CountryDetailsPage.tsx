import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
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
        const matchesCategory = !selectedCategory || e.equipment_category === selectedCategory;
        const matchesSearch = !searchText ||
            e.equipment_name.toLowerCase().includes(searchText.toLowerCase()) ||
            (e.equipment_code && e.equipment_code.toLowerCase().includes(searchText.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const categories = Array.from(new Set(equipment.map(e => e.equipment_category).filter(Boolean)));

    if (loading || !country) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-mono">Carregando...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative">
                {/* Header com Bandeira */}
                <div className="relative">
                    {/* Flag Background */}
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        {country.flag_url && (
                            <img
                                src={country.flag_url}
                                alt=""
                                className="w-full h-full object-cover blur-sm"
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative gaming-card bg-gradient-to-r from-[#0a0a0a] to-[#0a0a0a]/95 border-2 border-blue-900/50 p-8">
                        <button
                            onClick={() => navigate('/student/countries')}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-blue-600 mb-6"
                        >
                            ← Voltar
                        </button>

                        <div className="flex items-start gap-8">
                            {/* Flag */}
                            <div className="w-48 h-32 border-4 border-blue-900/50 overflow-hidden shrink-0">
                                {country.flag_url ? (
                                    <img
                                        src={country.flag_url}
                                        alt={`${country.name} flag`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-6xl">
                                        🏳️
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-5xl font-black italic text-white uppercase mb-2">
                                    {country.name}
                                </h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-xl text-gray-400 font-mono">{country.code}</span>
                                    {country.military_rank && (
                                        <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold font-mono">
                                            🏆 RANK #{country.military_rank}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500 uppercase font-mono text-xs mb-1">Capital</p>
                                        <p className="text-white font-bold">{country.capital}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase font-mono text-xs mb-1">Região</p>
                                        <p className="text-white font-bold">{country.region}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 uppercase font-mono text-xs mb-1">Continente</p>
                                        <p className="text-white font-bold">{country.continent}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Military Stats */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="gaming-card bg-gradient-to-br from-red-900/20 to-black border border-red-900/50 p-6">
                        <div className="text-4xl mb-2">🪖</div>
                        <div className="text-3xl font-black text-red-500">{formatNumber(country.active_military)}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">Militares Ativos</div>
                    </div>
                    <div className="gaming-card bg-gradient-to-br from-orange-900/20 to-black border border-orange-900/50 p-6">
                        <div className="text-4xl mb-2">🛡️</div>
                        <div className="text-3xl font-black text-orange-500">{formatNumber(country.reserve_military)}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">Reservistas</div>
                    </div>
                    <div className="gaming-card bg-gradient-to-br from-green-900/20 to-black border border-green-900/50 p-6">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-2xl font-black text-green-500">${formatNumber(country.military_budget_usd)}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">Orçamento Militar</div>
                    </div>
                    <div className="gaming-card bg-gradient-to-br from-blue-900/20 to-black border border-blue-900/50 p-6">
                        <div className="text-4xl mb-2">⚔️</div>
                        <div className="text-3xl font-black text-blue-500">{stats?.total_equipment || 0}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">Equipamentos</div>
                    </div>
                </div>

                {/* Equipment Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black italic text-white uppercase flex items-center gap-3">
                            <div className="w-1 h-10 bg-blue-600"></div>
                            Arsenal Militar
                        </h2>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Buscar equipamento..."
                                className="bg-[#111] border-2 border-[#333] text-white px-4 py-2 font-mono focus:border-blue-600 focus:outline-none w-64"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[#111] border-2 border-[#333] text-white px-4 py-2 font-mono focus:border-blue-600 focus:outline-none"
                            >
                                <option value="">Todas as Categorias</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredEquipment.length === 0 ? (
                        <div className="gaming-card bg-[#0a0a0a] border-2 border-blue-900/50 p-16 text-center">
                            <div className="text-8xl mb-4">📦</div>
                            <h3 className="text-2xl font-black text-white uppercase mb-2">Nenhum Equipamento Cadastrado</h3>
                            <p className="text-gray-400 font-mono">Ainda não há equipamentos registrados para este país</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEquipment.map((item: any) => (
                                <div key={`${item.equipment_id}-${Math.random()}`} className="gaming-card bg-[#0a0a0a] border border-[#333] hover:border-blue-600 p-4 transition-all">
                                    <div className="mb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold text-sm mb-1">{item.equipment_name}</h4>
                                                <p className="text-xs text-gray-500 font-mono">{item.equipment_code}</p>
                                            </div>
                                            {item.quantity && (
                                                <span className="px-2 py-1 bg-blue-900/30 border border-blue-900 text-blue-500 text-xs font-bold">
                                                    ×{item.quantity}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Imagem Thumb se tiver */}
                                    {item.equipment_image && (
                                        <div className="mb-3 h-32 overflow-hidden border border-[#222]">
                                            <ZoomableImage src={item.equipment_image} alt={item.equipment_name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}

                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-mono">Categoria:</span>
                                            <span className="text-white font-bold">{item.equipment_category}</span>
                                        </div>
                                        {item.status && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500 font-mono">Status:</span>
                                                <span className={`font-bold ${item.status === 'ACTIVE' ? 'text-green-500' :
                                                    item.status === 'RESERVE' ? 'text-yellow-500' :
                                                        item.status === 'RETIRED' ? 'text-gray-500' :
                                                            'text-blue-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        )}

                                        {item.variant && (
                                            <div className="mt-2 pt-2 border-t border-[#333]">
                                                <p className="text-gray-400 text-xs italic">
                                                    <span className="text-blue-500 font-bold">VARIANTE:</span> {item.variant}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSelectedEquipment(item)}
                                            className="w-full mt-4 py-2 bg-[#111] hover:bg-blue-900/20 border border-[#333] hover:border-blue-500/50 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <span className="group-hover:text-blue-400">📄</span> Ver Ficha Técnica
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tech Sheet Modal */}
            {selectedEquipment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedEquipment(null)}>
                    <div className="bg-[#0a0a0a] border border-blue-900/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10 border-b border-blue-900/30 p-6 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-900/20 border border-blue-900/50 rounded">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">{selectedEquipment.equipment_name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs font-mono font-bold border border-blue-900/30 rounded">
                                            {selectedEquipment.equipment_code || 'SEM CÓDIGO'}
                                        </span>
                                        <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                                            {selectedEquipment.equipment_category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEquipment(null)}
                                className="text-gray-500 hover:text-white hover:bg-red-900/20 w-10 h-10 flex items-center justify-center rounded transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#111] p-4 rounded border border-[#222]">
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-mono mb-1">Status Operacional</p>
                                    <p className={`font-bold text-sm ${selectedEquipment.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {selectedEquipment.status === 'ACTIVE' ? 'ATIVO' : selectedEquipment.status}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-mono mb-1">Quantidade</p>
                                    <p className="text-white font-bold text-sm">{selectedEquipment.quantity || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-mono mb-1">Ano Aquisição</p>
                                    <p className="text-white font-bold text-sm">{selectedEquipment.year_acquired || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-mono mb-1">Variante</p>
                                    <p className="text-white font-bold text-sm">{selectedEquipment.variant || 'Padrão'}</p>
                                </div>
                            </div>

                            {/* Main Description */}
                            <div className="space-y-4">
                                <h3 className="text-blue-500 font-bold uppercase text-sm tracking-widest flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-blue-500"></div>
                                    Análise de Inteligência
                                </h3>

                                <div className="bg-[#111] p-6 border-l-2 border-blue-600 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="text-6xl">🛡️</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light relative z-10 whitespace-pre-wrap">
                                        {selectedEquipment.equipment_description || selectedEquipment.description || "Nenhuma ficha técnica disponível para este equipamento."}
                                    </p>
                                </div>
                            </div>

                            {/* Image no Modal */}
                            {selectedEquipment.equipment_image && (
                                <div className="space-y-4">
                                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-widest">Registro Visual</h3>
                                    <div className="rounded border border-[#333] overflow-hidden bg-black">
                                        <ZoomableImage src={selectedEquipment.equipment_image} alt="" className="w-full h-auto max-h-96 object-contain opacity-90" />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-[#050505] border-t border-[#333] flex justify-between items-center">
                            <p className="text-xs text-gray-600 font-mono">PVO SYSTEM // INTEL DATABASE // RESTRICTED</p>
                            <button
                                onClick={() => setSelectedEquipment(null)}
                                className="px-6 py-2 bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors uppercase tracking-wider"
                            >
                                Fechar Relatório
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
