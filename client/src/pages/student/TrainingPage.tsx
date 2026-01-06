import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function TrainingPage() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const categories = [
        { id: 1, name: 'Tanques', count: 0 },
        { id: 2, name: 'Veículos Blindados', count: 0 },
        { id: 3, name: 'Artilharia', count: 0 },
        { id: 4, name: 'Aeronaves', count: 0 },
        { id: 5, name: 'Helicópteros', count: 0 },
        { id: 6, name: 'Navios', count: 0 },
        { id: 7, name: 'Mísseis', count: 0 },
        { id: 8, name: 'Outros', count: 0 },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Modo Treinamento</h1>
                    <p className="text-gray-600 mt-2">
                        Selecione uma categoria para começar a treinar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`card text-left hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${selectedCategory === category.id
                                    ? 'ring-2 ring-primary-500 bg-primary-50'
                                    : ''
                                }`}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {category.count} equipamentos
                            </p>
                        </button>
                    ))}
                </div>

                {selectedCategory && (
                    <div className="card">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Nenhum equipamento cadastrado
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Os equipamentos serão adicionados pelos instrutores
                            </p>
                            <button className="btn btn-primary">
                                Voltar ao Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
