import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export function TestPage() {
    const [testType, setTestType] = useState<'free' | 'standard' | null>(null);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fazer Teste</h1>
                    <p className="text-gray-600 mt-2">
                        Escolha o tipo de teste que deseja realizar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Test */}
                    <button
                        onClick={() => setTestType('free')}
                        className={`card text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${testType === 'free' ? 'ring-2 ring-primary-500' : ''
                            }`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-5xl">🎲</div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Teste Livre
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Teste com equipamentos aleatórios de todas as categorias
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Equipamentos aleatórios
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Sem limite de tempo
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Resultado imediato
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </button>

                    {/* Standard Test */}
                    <button
                        onClick={() => setTestType('standard')}
                        className={`card text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${testType === 'standard' ? 'ring-2 ring-primary-500' : ''
                            }`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-5xl">📋</div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Teste Padrão
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Teste criado por um instrutor com tempo definido
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Equipamentos específicos
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Tempo cronometrado
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Avaliação formal
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </button>
                </div>

                {testType === 'free' && (
                    <div className="card">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎲</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Teste Livre
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Configure seu teste livre personalizado
                            </p>
                            <div className="max-w-md mx-auto space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número de questões
                                    </label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="10"
                                        min="5"
                                        max="50"
                                    />
                                </div>
                                <button className="btn btn-primary w-full">
                                    Iniciar Teste
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {testType === 'standard' && (
                    <div className="card">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Nenhum teste disponível
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Aguarde os instrutores criarem testes padrão
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
