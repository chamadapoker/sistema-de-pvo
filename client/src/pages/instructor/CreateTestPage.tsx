import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService } from '../../services/testService';
import { equipmentService } from '../../services/equipmentService';
import type { Equipment, Category } from '../../types';

type TestType = 'WRITTEN' | 'MULTIPLE_CHOICE';

export function CreateTestPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Dados disponíveis
    const [categories, setCategories] = useState<Category[]>([]);
    const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
    const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);

    // Formulário
    const [testType, setTestType] = useState<TestType>('WRITTEN');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        scheduled_date: '',
        location: '',
        time_per_question: 30, // 30s padrão para prova escrita
        passing_score: 60,
    });

    // Seleção de equipamentos (para prova escrita)
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterEquipment();
    }, [searchTerm, selectedCategory, allEquipment]);

    const loadData = async () => {
        try {
            const [categoriesData, equipmentData] = await Promise.all([
                equipmentService.getCategories(),
                equipmentService.getAllEquipment()
            ]);
            setCategories(categoriesData.categories);
            setAllEquipment(equipmentData.equipment);
            setFilteredEquipment(equipmentData.equipment);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const filterEquipment = () => {
        let filtered = allEquipment;

        // Filtrar por categoria
        if (selectedCategory) {
            filtered = filtered.filter(e => e.categoryId === parseInt(selectedCategory));
        }

        // Filtrar por busca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(e =>
                e.name.toLowerCase().includes(term) ||
                e.code?.toLowerCase().includes(term)
            );
        }

        setFilteredEquipment(filtered);
    };

    const toggleEquipment = (equipment: Equipment) => {
        const isSelected = selectedEquipment.find(e => e.id === equipment.id);
        if (isSelected) {
            setSelectedEquipment(prev => prev.filter(e => e.id !== equipment.id));
        } else {
            setSelectedEquipment(prev => [...prev, equipment]);
        }
    };

    const removeEquipment = (equipmentId: string) => {
        setSelectedEquipment(prev => prev.filter(e => e.id !== equipmentId));
    };

    const moveEquipment = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedEquipment.length) return;

        const newSelected = [...selectedEquipment];
        [newSelected[index], newSelected[newIndex]] = [newSelected[newIndex], newSelected[index]];
        setSelectedEquipment(newSelected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (testType === 'WRITTEN' && selectedEquipment.length === 0) {
            alert('Selecione pelo menos 1 equipamento para a prova');
            return;
        }

        setSaving(true);
        try {
            if (testType === 'WRITTEN') {
                // Criar prova escrita com questões
                await testService.createTestWithQuestions({
                    ...formData,
                    test_type: 'WRITTEN',
                    category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
                    question_count: selectedEquipment.length
                }, selectedEquipment.map(e => e.id));
            } else {
                // Criar prova múltipla escolha
                await testService.createTest({
                    ...formData,
                    test_type: 'MULTIPLE_CHOICE',
                    category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
                    question_count: 20 // padrão
                });
            }

            alert('Prova criada com sucesso!');
            navigate('/instructor/tests');
        } catch (error: any) {
            console.error('Error creating test:', error);
            alert('Erro ao criar prova: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-mono">Carregando...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-green-900/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                            <span className="text-green-600">Criar</span> Nova Prova
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                            Configure os parâmetros da avaliação
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/instructor/tests')}
                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600"
                    >
                        ← Voltar
                    </button>
                </div>

                {/* Tipo de Prova */}
                <div className="gaming-card bg-[#0a0a0a] border-2 border-[#333] p-8">
                    <h3 className="text-2xl font-black italic text-green-600 uppercase mb-6">1. Tipo de Prova</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <button
                            type="button"
                            onClick={() => setTestType('WRITTEN')}
                            className={`p-8 border-2 transition-all ${testType === 'WRITTEN'
                                    ? 'border-green-600 bg-green-900/20'
                                    : 'border-[#333] hover:border-green-600'
                                }`}
                        >
                            <svg className="w-16 h-16 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <div className="text-xl font-black text-white uppercase mb-2">Prova Escrita</div>
                            <div className="text-sm text-gray-400 font-mono">Aluno digita o nome • Correção manual</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTestType('MULTIPLE_CHOICE')}
                            className={`p-8 border-2 transition-all ${testType === 'MULTIPLE_CHOICE'
                                    ? 'border-green-600 bg-green-900/20'
                                    : 'border-[#333] hover:border-green-600'
                                }`}
                        >
                            <svg className="w-16 h-16 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <div className="text-xl font-black text-white uppercase mb-2">Múltipla Escolha</div>
                            <div className="text-sm text-gray-400 font-mono">4 opções • Correção automática</div>
                        </button>
                    </div>
                </div>

                {/* Informações Básicas */}
                <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 space-y-6">
                    <h3 className="text-2xl font-black italic text-green-600 uppercase">2. Informações Básicas</h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Título da Prova *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                placeholder="Ex: Avaliação Mensal - Aeronaves"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Data e Hora *</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Local</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                placeholder="Ex: Sala de Treinamento 1"
                            />
                        </div>
                    </div>
                </div>

                {/* Seleção de Equipamentos (WRITTEN) */}
                {testType === 'WRITTEN' && (
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black italic text-green-600 uppercase">3. Selecionar Equipamentos</h3>
                            <div className="text-sm font-mono text-gray-400">
                                <span className="text-green-600 font-bold">{selectedEquipment.length}</span> selecionados
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Filtrar por Categoria</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-2 font-mono focus:border-green-600 focus:outline-none text-sm"
                                >
                                    <option value="">Todas as Categorias</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Buscar</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-2 font-mono focus:border-green-600 focus:outline-none text-sm"
                                    placeholder="Digite para buscar..."
                                />
                            </div>
                        </div>

                        {/* Grid de Equipamentos */}
                        <div className="border-2 border-[#222] p-4 max-h-[500px] overflow-y-auto">
                            <div className="grid grid-cols-4 gap-4">
                                {filteredEquipment.slice(0, 100).map(equipment => {
                                    const isSelected = selectedEquipment.find(e => e.id === equipment.id);
                                    return (
                                        <button
                                            key={equipment.id}
                                            type="button"
                                            onClick={() => toggleEquipment(equipment)}
                                            className={`relative group border-2 transition-all overflow-hidden ${isSelected
                                                    ? 'border-green-600 bg-green-900/20'
                                                    : 'border-[#333] hover:border-green-600'
                                                }`}
                                        >
                                            <div className="aspect-square bg-black flex items-center justify-center p-2">
                                                <img
                                                    src={equipment.imagePath}
                                                    alt={equipment.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <div className="p-2 bg-[#0a0a0a]">
                                                <p className="text-xs text-white font-bold truncate">{equipment.name}</p>
                                                <p className="text-[10px] text-gray-500 font-mono">{equipment.code}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Lista de Selecionados (Reordenável) */}
                        {selectedEquipment.length > 0 && (
                            <div className="border-2 border-green-900/30 p-4">
                                <h4 className="text-sm font-mono uppercase text-gray-400 mb-3">Ordem da Prova:</h4>
                                <div className="space-y-2">
                                    {selectedEquipment.map((equipment, index) => (
                                        <div key={equipment.id} className="flex items-center gap-3 bg-[#111] p-3 border border-[#333]">
                                            <span className="text-green-600 font-black text-lg w-8">{index + 1}</span>
                                            <img src={equipment.imagePath} alt="" className="w-12 h-12 object-contain bg-black" />
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-bold">{equipment.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{equipment.code}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => moveEquipment(index, 'up')}
                                                    disabled={index === 0}
                                                    className="w-8 h-8 border border-[#333] hover:border-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveEquipment(index, 'down')}
                                                    disabled={index === selectedEquipment.length - 1}
                                                    className="w-8 h-8 border border-[#333] hover:border-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEquipment(equipment.id)}
                                                    className="w-8 h-8 border border-[#333] hover:border-red-600 text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-gaming bg-green-700 hover:bg-green-600 border-green-500 py-6 text-2xl disabled:opacity-50"
                >
                    {saving ? 'CRIANDO...' : 'CRIAR PROVA ✅'}
                </button>
            </form>
        </DashboardLayout>
    );
}
