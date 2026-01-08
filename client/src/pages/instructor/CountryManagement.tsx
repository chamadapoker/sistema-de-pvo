
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { countryService, type Country } from '../../services/countryService';

export function CountryManagement() {
    // Mode: LIST or FORM
    const [view, setView] = useState<'LIST' | 'FORM'>('LIST');

    // Data
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, activePersonnel: 0 });

    // Editing
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Country>();
    const [flagPreview, setFlagPreview] = useState<string | null>(null);
    const [coatPreview, setCoatPreview] = useState<string | null>(null);

    // Filters
    const [filter, setFilter] = useState('');
    const [continentFilter, setContinentFilter] = useState('');

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        setLoading(true);
        try {
            const data = await countryService.getAllCountries();
            setCountries(data);

            // Stats
            const total = data.length;
            const personnel = data.reduce((acc, c) => acc + (c.activeMilitary || 0), 0);
            setStats({ total, activePersonnel: personnel });
        } catch (error) {
            console.error('Failed to load countries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCountry(null);
        reset({});
        setFlagPreview(null);
        setCoatPreview(null);
        setView('FORM');
    };

    const handleEdit = (country: Country) => {
        setEditingCountry(country);
        reset(country);
        setFlagPreview(country.flagUrl);
        setCoatPreview(country.coatOfArmsUrl);
        setView('FORM');
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja dissolver esta nação? Esta ação não pode ser desfeita.')) return;

        try {
            await countryService.deleteCountry(id);
            setCountries(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Falha ao excluir país.');
        }
    };

    const handleSave = async (data: any) => {
        try {
            const flagFile = (data.flagFile as FileList)?.[0];
            const coatFile = (data.coatFile as FileList)?.[0];

            if (editingCountry) {
                // Update
                await countryService.updateCountry(editingCountry.id, data, flagFile, coatFile);
            } else {
                // Create
                await countryService.createCountry(data, flagFile, coatFile);
            }

            await loadCountries();
            setView('LIST');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Falha ao salvar país.');
        }
    };

    const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFlagPreview(URL.createObjectURL(file));
        }
    };

    const handleCoatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoatPreview(URL.createObjectURL(file));
        }
    };

    const filteredCountries = countries.filter(c =>
        (c.name.toLowerCase().includes(filter.toLowerCase()) || c.code.toLowerCase().includes(filter.toLowerCase())) &&
        (continentFilter ? c.continent === continentFilter : true)
    );

    const formatNumber = (num?: number) => {
        if (!num) return '-';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // --- RENDER LIST ---
    if (view === 'LIST') {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-fade-in pb-20">
                    <div className="flex justify-between items-center border-b border-lime-900/30 pb-4">
                        <div>
                            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                                <span className="text-lime-500">Geopolítica</span> Global
                            </h1>
                            <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-1">
                                Gerenciamento de Nações e Territórios
                            </p>
                        </div>
                        <button onClick={handleCreate} className="btn-gaming bg-lime-600 hover:bg-lime-500 border-lime-400 text-black font-bold">
                            + Nova Nação
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="gaming-card bg-black border border-[#333] p-6">
                            <div className="text-3xl font-black text-white">{stats.total}</div>
                            <div className="text-xs text-lime-500 font-mono uppercase">Países Cadastrados</div>
                        </div>
                        <div className="gaming-card bg-black border border-[#333] p-6">
                            <div className="text-3xl font-black text-white">{formatNumber(stats.activePersonnel)}</div>
                            <div className="text-xs text-lime-500 font-mono uppercase">Efetivo Global Ativo</div>
                        </div>
                        <div className="gaming-card bg-black border border-[#333] p-6">
                            <div className="text-3xl font-black text-white text-right">DEFCON 5</div>
                            <div className="text-xs text-lime-500 font-mono uppercase text-right">Status Global</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Buscar Nação..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="flex-1 bg-[#111] border border-[#333] text-white px-4 py-3 font-mono focus:border-lime-500 focus:outline-none uppercase"
                        />
                        <select
                            value={continentFilter}
                            onChange={(e) => setContinentFilter(e.target.value)}
                            className="bg-[#111] border border-[#333] text-white px-4 py-3 font-mono focus:border-lime-500 focus:outline-none uppercase"
                        >
                            <option value="">Todos Continentes</option>
                            <option value="South America">América do Sul</option>
                            <option value="North America">América do Norte</option>
                            <option value="Europe">Europa</option>
                            <option value="Asia">Ásia</option>
                            <option value="Africa">África</option>
                            <option value="Oceania">Oceania</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-[#333]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1a1a1a] text-xs font-mono text-gray-500 uppercase">
                                    <th className="p-4 border-b border-[#333]">Bandeira</th>
                                    <th className="p-4 border-b border-[#333]">Nação / Código</th>
                                    <th className="p-4 border-b border-[#333]">Região</th>
                                    <th className="p-4 border-b border-[#333]">Rank Militar</th>
                                    <th className="p-4 border-b border-[#333] text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Carregando dados de inteligência...</td></tr>
                                ) : filteredCountries.map(country => (
                                    <tr key={country.id} className="border-b border-[#222] hover:bg-[#111] transition-colors group">
                                        <td className="p-4">
                                            <div className="w-12 h-8 bg-black border border-[#333] overflow-hidden">
                                                {country.flagUrl ? (
                                                    <img src={country.flagUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">N/A</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white uppercase">{country.name}</div>
                                            <div className="text-[10px] text-lime-600 font-mono">{country.code} | {country.code2}</div>
                                        </td>
                                        <td className="p-4 text-gray-400 font-mono uppercase text-xs">
                                            {country.continent} <br /> <span className="text-[10px] opacity-70">{country.region}</span>
                                        </td>
                                        <td className="p-4">
                                            {country.militaryRank ? (
                                                <span className="bg-lime-900/30 text-lime-500 text-[10px] px-2 py-1 border border-lime-800 font-mono font-bold">
                                                    #{country.militaryRank}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(country)}
                                                className="px-3 py-1 bg-[#222] hover:bg-lime-900/30 text-white border border-[#444] hover:border-lime-500 text-xs font-bold uppercase transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(country.id)}
                                                className="px-3 py-1 bg-[#222] hover:bg-red-900/30 text-gray-400 hover:text-red-500 border border-[#444] hover:border-red-500 text-xs font-bold uppercase transition-all"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- RENDER FORM ---
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="border-b border-lime-900/30 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                            {editingCountry ? `Editar: ${editingCountry.name}` : 'Nova Nação'}
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-1">
                            Preencha os dados estratégicos
                        </p>
                    </div>
                    <button onClick={() => setView('LIST')} className="text-gray-400 hover:text-white uppercase text-xs font-bold border border-transparent hover:border-[#333] px-4 py-2">
                        Cancelar Operação
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleSave)} className="space-y-8">

                    {/* Basic Info */}
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6 space-y-6">
                        <h3 className="text-lime-500 font-black italic uppercase border-b border-[#222] pb-2">Dados Básicos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-gaming">Nome da Nação</label>
                                <input {...register('name', { required: true })} className="input-gaming" placeholder="Ex: Brasil" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-gaming">Código (ISO 3)</label>
                                    <input {...register('code', { required: true, maxLength: 3 })} className="input-gaming" placeholder="BRA" />
                                </div>
                                <div>
                                    <label className="label-gaming">Código (ISO 2)</label>
                                    <input {...register('code2', { required: true, maxLength: 2 })} className="input-gaming" placeholder="BR" />
                                </div>
                            </div>
                            <div>
                                <label className="label-gaming">Continente</label>
                                <select {...register('continent', { required: true })} className="input-gaming">
                                    <option value="South America">América do Sul</option>
                                    <option value="North America">América do Norte</option>
                                    <option value="Europe">Europa</option>
                                    <option value="Asia">Ásia</option>
                                    <option value="Africa">África</option>
                                    <option value="Oceania">Oceania</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-gaming">Região</label>
                                <input {...register('region')} className="input-gaming" placeholder="Ex: América Latina" />
                            </div>
                            <div>
                                <label className="label-gaming">Capital</label>
                                <input {...register('capital')} className="input-gaming" placeholder="Ex: Brasília" />
                            </div>
                            <div>
                                <label className="label-gaming">Aliança / Bloco</label>
                                <input {...register('alliance')} className="input-gaming" placeholder="Ex: NATO, BRICS, Non-Aligned" />
                            </div>
                        </div>
                    </div>

                    {/* Military Stats */}
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6 space-y-6">
                        <h3 className="text-red-600 font-black italic uppercase border-b border-[#222] pb-2">Inteligência Militar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="label-gaming">Ranking Global</label>
                                <input type="number" {...register('militaryRank')} className="input-gaming" placeholder="#" />
                            </div>
                            <div>
                                <label className="label-gaming">Efetivo Ativo</label>
                                <input type="number" {...register('activeMilitary')} className="input-gaming" placeholder="Soldados" />
                            </div>
                            <div>
                                <label className="label-gaming">Orçamento (USD)</label>
                                <input type="number" {...register('militaryBudgetUsd')} className="input-gaming" placeholder="$" />
                            </div>
                        </div>
                        <div>
                            <label className="label-gaming">Resumo Militar (Markdown)</label>
                            <textarea {...register('militaryDescription')} rows={4} className="input-gaming font-mono text-sm" placeholder="Descreva as capacidades militares..." />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-6 space-y-6">
                        <h3 className="text-blue-500 font-black italic uppercase border-b border-[#222] pb-2">Mídia & Símbolos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Flag Upload */}
                            <div>
                                <label className="label-gaming mb-2 block">Bandeira Nacional</label>
                                <div className="border border-dashed border-[#444] p-4 text-center hover:border-lime-500 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('flagFile')}
                                        onChange={handleFlagChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {flagPreview ? (
                                        <img src={flagPreview} className="h-32 mx-auto object-cover border border-[#333]" />
                                    ) : (
                                        <div className="py-8 text-gray-500 text-xs uppercase">Clique para upload</div>
                                    )}
                                </div>
                            </div>
                            {/* Coat Upload */}
                            <div>
                                <label className="label-gaming mb-2 block">Brasão de Armas</label>
                                <div className="border border-dashed border-[#444] p-4 text-center hover:border-lime-500 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('coatFile')}
                                        onChange={handleCoatChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {coatPreview ? (
                                        <img src={coatPreview} className="h-32 mx-auto object-contain" />
                                    ) : (
                                        <div className="py-8 text-gray-500 text-xs uppercase">Clique para upload</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 p-4 bg-[#111] border-t border-[#333] sticky bottom-0 z-10">
                        <button type="button" onClick={() => setView('LIST')} className="btn-gaming bg-[#222] border-[#444] hover:bg-[#333]">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-gaming bg-lime-600 border-lime-500 hover:bg-lime-500 text-black font-bold text-lg px-8">
                            {editingCountry ? 'SALVAR ALTERAÇÕES' : 'CRIAR NAÇÃO'}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}
