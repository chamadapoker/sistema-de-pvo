import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { equipmentService } from '../../services/equipmentService';
import type { Equipment, Category } from '../../types';

// Simple Markdown Editor Help
const MdHelp = () => (
    <div className="text-xs text-gray-500 font-mono mt-2 p-2 bg-[#111] border border-[#333]">
        <p className="font-bold mb-1">Guia Rápido Markdown:</p>
        <ul className="grid grid-cols-2 gap-2">
            <li># Título 1</li>
            <li>## Título 2</li>
            <li>**Negrito**</li>
            <li>*Itálico*</li>
            <li>- Lista</li>
            <li>[Link](url)</li>
        </ul>
    </div>
);

export function EquipmentManagement() {
    // State
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Server-Side Filters
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [hasSearched, setHasSearched] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        categoryId: '',
        description: '',
        image: null as File | null,
        imagePreview: ''
    });

    // Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { categories } = await equipmentService.getCategories();
            setCategories(categories);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Prevent loading all if no filter
        if (!filterText && !selectedCategory) {
            alert('Por favor, selecione uma categoria ou digite um termo de busca.');
            return;
        }

        setLoading(true);
        setHasSearched(true);
        try {
            const { equipment } = await equipmentService.getAllEquipment({
                categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
                search: filterText || undefined
            });
            setEquipments(equipment);
        } catch (error) {
            console.error(error);
            alert('Erro ao buscar equipamentos');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleOpenModal = (item?: Equipment) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                code: item.code,
                categoryId: item.categoryId.toString(),
                description: item.description || '',
                image: null,
                imagePreview: item.imagePath
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                code: '',
                categoryId: '',
                description: '',
                image: null,
                imagePreview: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            if (editingItem) {
                await equipmentService.updateEquipment(editingItem.id, {
                    name: formData.name,
                    code: formData.code,
                    categoryId: parseInt(formData.categoryId),
                    description: formData.description,
                    image: formData.image || undefined
                });
            } else {
                await equipmentService.createEquipment({
                    name: formData.name,
                    code: formData.code,
                    categoryId: parseInt(formData.categoryId),
                    description: formData.description,
                    image: formData.image!
                });
            }
            setIsModalOpen(false);
            // Refresh list if we have a search active
            if (hasSearched) handleSearch();
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza? Isso não pode ser desfeito.')) {
            try {
                await equipmentService.deleteEquipment(id);
                if (hasSearched) handleSearch();
            } catch (error) {
                alert('Erro ao deletar');
            }
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newCategoryName.trim()) return;
            await equipmentService.createCategory(newCategoryName);
            setNewCategoryName('');
            loadCategories();
        } catch (error: any) {
            alert('Erro ao criar categoria: ' + error.message);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta categoria? Equipamentos vinculados ficarão sem categoria.')) {
            try {
                await equipmentService.deleteCategory(id);
                loadCategories();
            } catch (error: any) {
                alert('Erro ao excluir categoria: ' + error.message);
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-red-900/30 pb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            <span className="text-red-600">Arsenal</span> // Gerenciamento
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                            Base de Dados de Vetores
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-yellow-600 text-xs"
                        >
                            Gerenciar Categorias
                        </button>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500"
                        >
                            + Novo Equipamento
                        </button>
                    </div>
                </div>

                {/* Filters / Search Bar */}
                <form onSubmit={handleSearch} className="gaming-card bg-[#0a0a0a] border border-[#222] p-6 space-y-4">
                    <div className="text-xs text-red-500 font-mono uppercase tracking-widest mb-2">Filtros de Busca (Obrigatório)</div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="BUSCAR POR NOME OU CÓDIGO..."
                            className="flex-1 bg-[#111] border border-[#333] px-4 py-3 text-white font-mono focus:border-red-600 focus:outline-none uppercase"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <select
                            className="bg-[#111] border border-[#333] px-4 py-3 text-white font-mono focus:border-red-600 focus:outline-none uppercase min-w-[200px]"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            <option value="">TODAS AS CATEGORIAS</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button
                            type="submit"
                            disabled={loading || (!filterText && !selectedCategory)}
                            className="btn-gaming bg-red-900/20 text-red-500 border-red-900 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'BUSCANDO...' : 'LOCALIZAR'}
                        </button>
                    </div>
                </form>

                {/* Results List */}
                <div className="grid grid-cols-1 gap-2">
                    {loading ? (
                        <div className="text-center py-20 text-red-600 animate-pulse font-mono">CARREGANDO DADOS CLASSIFICADOS...</div>
                    ) : !hasSearched ? (
                        <div className="text-center py-20 bg-[#0a0a0a] border border-dashed border-[#333]">
                            <div className="text-4xl mb-4 opacity-50">🔍</div>
                            <p className="text-gray-500 font-mono uppercase">Utilize os filtros acima para localizar equipamentos.</p>
                        </div>
                    ) : equipments.length === 0 ? (
                        <div className="text-center py-20 text-gray-600 font-mono">NENHUM EQUIPAMENTO ENCONTRADO</div>
                    ) : (
                        <>
                            <div className="text-right text-xs text-gray-500 font-mono uppercase mb-2">
                                {equipments.length} Registros Encontrados
                            </div>
                            {equipments.map(item => (
                                <div key={item.id} className="group flex items-center gap-4 bg-[#0a0a0a] border border-[#222] p-2 hover:border-red-600 transition-all">
                                    <div className="w-20 h-14 bg-black border border-[#333] overflow-hidden flex-shrink-0">
                                        <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-white font-bold uppercase italic truncate">{item.name}</h3>
                                            <span className="text-[10px] bg-[#111] text-gray-500 px-2 py-0.5 border border-[#333] whitespace-nowrap">{item.code}</span>
                                        </div>
                                        <p className="text-xs text-red-500 font-mono truncate">{categories.find(c => c.id === item.categoryId)?.name || 'Sem Categoria'}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-4">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="text-xs font-mono text-gray-400 hover:text-white border border-[#333] hover:border-white px-3 py-1 bg-black uppercase"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-xs font-mono text-red-900 hover:text-red-500 border border-red-900/30 hover:border-red-500 px-3 py-1 bg-black uppercase"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* CATEGORY MANAGEMENT MODAL */}
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0f0f0f] border-2 border-yellow-600 w-full max-w-md p-6 shadow-2xl animate-fade-in">
                            <div className="flex justify-between items-center border-b border-yellow-900/30 pb-4 mb-4">
                                <h2 className="text-xl font-black italic text-white uppercase text-yellow-500">Gerenciar Categorias</h2>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                            </div>

                            {/* Create Form */}
                            <form onSubmit={handleCreateCategory} className="mb-6 flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder="Nova Categoria..."
                                    className="flex-1 bg-[#0a0a0a] border border-[#333] p-2 text-white text-sm focus:border-yellow-600 outline-none uppercase font-mono"
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                />
                                <button type="submit" className="bg-yellow-800 hover:bg-yellow-700 text-white px-4 text-xs font-bold uppercase transition-colors">CRIAR</button>
                            </form>

                            {/* List */}
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between bg-[#0a0a0a] p-3 border border-[#222] hover:border-yellow-900/50 transition-colors">
                                        <span className="text-sm text-gray-300 font-mono uppercase">{cat.name}</span>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="text-red-900 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider"
                                            title="Excluir Categoria"
                                        >
                                            REMOVER
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* EDIT/CREATE MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0f0f0f] border-2 border-red-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-fade-in">

                            {/* Left: Form */}
                            <div className="p-8 flex-1 space-y-6">
                                <h2 className="text-2xl font-black italic text-white uppercase border-b border-red-900/30 pb-4">
                                    {editingItem ? 'Editar Equipamento' : 'Novo Equipamento'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase">Nome</label>
                                            <input
                                                required
                                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-white focus:border-red-600 focus:outline-none uppercase"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-mono text-gray-500 uppercase">Designação (Código)</label>
                                            <input
                                                required
                                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-white focus:border-red-600 focus:outline-none uppercase"
                                                value={formData.code}
                                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase">Categoria</label>
                                        <select
                                            required
                                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-white focus:border-red-600 focus:outline-none uppercase"
                                            value={formData.categoryId}
                                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">Selecione...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-mono text-gray-500 uppercase">Imagem</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-gray-500 file:bg-red-900 file:text-white file:border-0 file:mr-4 file:px-4 file:py-1 file:text-xs hover:file:bg-red-700"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <label className="text-xs font-mono text-gray-500 uppercase mb-1">Ficha Técnica (Markdown)</label>
                                        <textarea
                                            className="w-full h-40 bg-[#0a0a0a] border border-[#333] p-2 text-white font-mono text-sm focus:border-red-600 focus:outline-none resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="# Especificações..."
                                        />
                                        <MdHelp />
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-[#333]">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2 text-gray-500 hover:text-white font-mono uppercase text-sm"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {uploading ? 'PROCESSANDO...' : 'SALVAR DADOS'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right: Preview */}
                            <div className="w-full md:w-1/3 bg-black border-l border-[#222] p-8 flex flex-col items-center justify-center relative">
                                <div className="absolute top-2 left-2 text-[10px] font-mono text-red-600 uppercase tracking-widest">PREVIEW DE IMAGEM</div>
                                {formData.imagePreview ? (
                                    <div className="relative w-full aspect-[3/4] border border-[#333] p-2">
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-600"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-red-600"></div>
                                        <img src={formData.imagePreview} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="text-gray-700 font-mono text-xs uppercase text-center border border-dashed border-[#333] p-8">
                                        Nenhuma Imagem Selecionada
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
