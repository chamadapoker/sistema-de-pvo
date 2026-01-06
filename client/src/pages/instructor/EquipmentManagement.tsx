import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function EquipmentManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const categories = [
        { id: 1, name: 'Tanques' },
        { id: 2, name: 'Veículos Blindados' },
        { id: 3, name: 'Artilharia' },
        { id: 4, name: 'Aeronaves' },
        { id: 5, name: 'Helicópteros' },
        { id: 6, name: 'Navios' },
        { id: 7, name: 'Mísseis' },
        { id: 8, name: 'Outros' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gerenciar Equipamentos
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Adicione e organize equipamentos militares
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn btn-primary"
                    >
                        {showAddForm ? 'Cancelar' : '+ Adicionar Equipamento'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Novo Equipamento
                        </h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ex: M1A2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ex: Abrams"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoria
                                </label>
                                <select className="input">
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    className="input"
                                    rows={3}
                                    placeholder="Descrição do equipamento..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        País
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ex: EUA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fabricante
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ex: General Dynamics"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ano
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Ex: 1980"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagem
                                </label>
                                <input
                                    type="file"
                                    className="input"
                                    accept="image/*"
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button type="submit" className="btn btn-primary">
                                    Salvar Equipamento
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === null
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === cat.id
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Equipment List */}
                <div className="card">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛠️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Nenhum equipamento cadastrado
                        </h3>
                        <p className="text-gray-600">
                            Adicione equipamentos usando o botão acima
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
