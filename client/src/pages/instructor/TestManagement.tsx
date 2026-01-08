import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService, type ScheduledTest } from '../../services/testService';
import { equipmentService } from '../../services/equipmentService';
import type { Category } from '../../types';

export function TestManagement() {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [tests, setTests] = useState<ScheduledTest[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editingTestId, setEditingTestId] = useState<string | null>(null);

    // Results View State
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [selectedTestResults, setSelectedTestResults] = useState<any[]>([]);
    const [selectedTestName, setSelectedTestName] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        question_count: 20,
        time_per_question: 15,
        passing_score: 70,
        scheduled_date: '',
        location: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [testsData, categoriesData] = await Promise.all([
                testService.getAllTests(),
                equipmentService.getCategories()
            ]);
            setTests(testsData);
            setCategories(categoriesData.categories);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewResults = async (testId: string, testName: string) => {
        try {
            setLoading(true);
            const results = await testService.getTestAttempts(testId);
            setSelectedTestResults(results);
            setSelectedTestName(testName);
            setIsResultsModalOpen(true);
        } catch (error: any) {
            alert('Erro ao carregar resultados: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingTestId(null);
        setFormData({
            title: '',
            description: '',
            category_id: '',
            question_count: 20,
            time_per_question: 15,
            passing_score: 70,
            scheduled_date: '',
            location: '',
        });
        setView('create');
    };

    const handleEditClick = (test: ScheduledTest) => {
        setEditingTestId(test.id);
        const testDate = new Date(test.createdAt);
        // Adjust for timezone offset if necessary, but ISO slice(0,16) is a quick hack for datetime-local
        // Better to use local time for the input
        const localDate = new Date(testDate.getTime() - (testDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        setFormData({
            title: test.name,
            description: test.description || '',
            category_id: (test as any).categoryId?.toString() || '',
            question_count: test.questionCount,
            time_per_question: test.duration ? (Math.round(test.duration / (test.questionCount || 1))) : 15,
            passing_score: test.passingScore,
            scheduled_date: localDate,
            location: test.location || '',
        });
        setView('create');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                category_id: formData.category_id ? parseInt(formData.category_id) : undefined
            };

            if (editingTestId) {
                await testService.updateTest(editingTestId, payload);
            } else {
                await testService.createTest(payload);
            }

            setView('list');
            loadData();
            setEditingTestId(null);
        } catch (error: any) {
            alert('Erro ao salvar prova: ' + error.message);
        }
    };

    const handleActivate = async (testId: string) => {
        if (confirm('Liberar esta prova para os alunos?')) {
            try {
                await testService.activateTest(testId);
                loadData();
            } catch (error: any) {
                alert('Erro ao liberar prova: ' + error.message);
            }
        }
    };

    const handleFinish = async (testId: string) => {
        if (confirm('Encerrar esta prova? Todas as tentativas em andamento serão finalizadas.')) {
            try {
                await testService.finishTest(testId);
                loadData();
            } catch (error: any) {
                alert('Erro ao encerrar prova: ' + error.message);
            }
        }
    };

    const handleDelete = async (testId: string) => {
        if (confirm('Tem certeza que deseja deletar esta prova?')) {
            try {
                await testService.deleteTest(testId);
                loadData();
            } catch (error: any) {
                alert('Erro ao deletar prova: ' + error.message);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (test: ScheduledTest) => {
        const status = (test as any).status || 'SCHEDULED';
        switch (status) {
            case 'SCHEDULED':
                return <span className="px-3 py-1 bg-blue-900/20 text-blue-500 border border-blue-900 text-xs font-mono uppercase">Agendada</span>;
            case 'ACTIVE':
                return <span className="px-3 py-1 bg-green-900/20 text-green-500 border border-green-900 text-xs font-mono uppercase animate-pulse">Ativa</span>;
            case 'FINISHED':
                return <span className="px-3 py-1 bg-gray-900/20 text-gray-500 border border-gray-900 text-xs font-mono uppercase">Finalizada</span>;
            case 'CANCELLED':
                return <span className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900 text-xs font-mono uppercase">Cancelada</span>;
            default:
                return null;
        }
    };

    // CREATE / EDIT FORM
    if (view === 'create') {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                    <div className="flex items-center justify-between border-b border-green-900/30 pb-6">
                        <div>
                            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                                <span className="text-green-600">{editingTestId ? 'Editar' : 'Criar'}</span> Avaliação
                            </h1>
                            <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                                Configure os parâmetros da prova
                            </p>
                        </div>
                        <button
                            onClick={() => setView('list')}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600"
                        >
                            ← Voltar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 space-y-6">
                            <h3 className="text-xl font-black italic text-green-600 uppercase mb-4">Informações Básicas</h3>

                            <div>
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
                                <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none h-24 resize-none"
                                    placeholder="Descrição opcional da prova..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Bateria (Categoria)</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                >
                                    <option value="">Todas as Categorias</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Test Config */}
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 space-y-6">
                            <h3 className="text-xl font-black italic text-green-600 uppercase mb-4">Configuração da Prova</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Nº Questões</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        required
                                        value={formData.question_count}
                                        onChange={(e) => setFormData({ ...formData, question_count: parseInt(e.target.value) })}
                                        className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                    />
                                    {editingTestId && <p className="text-[10px] text-red-500 font-mono">⚠️ Editar pode regenerar questões</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Tempo/Questão (s)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="60"
                                        required
                                        value={formData.time_per_question}
                                        onChange={(e) => setFormData({ ...formData, time_per_question: parseInt(e.target.value) })}
                                        className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-mono uppercase text-gray-400 mb-2">Nota Mínima (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        value={formData.passing_score}
                                        onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                                        className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 space-y-6">
                            <h3 className="text-xl font-black italic text-green-600 uppercase mb-4">Agendamento</h3>

                            <div className="grid grid-cols-2 gap-4">
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

                        <button type="submit" className="w-full btn-gaming bg-green-700 hover:bg-green-600 border-green-500 py-4 text-xl">
                            {editingTestId ? 'SALVAR ALTERAÇÕES' : 'CRIAR AVALIAÇÃO'}
                        </button>
                    </form>
                </div>
            </DashboardLayout>
        );
    }

    // LIST VIEW
    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-green-900/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                            <span className="text-green-600">Gerenciar</span> Avaliações
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-2">
                            Criar e controlar provas agendadas
                        </p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="btn-gaming bg-green-700 hover:bg-green-600 border-green-500"
                    >
                        + Nova Avaliação
                    </button>
                </div>

                {loading && !isResultsModalOpen ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : tests.length === 0 ? (
                    <div className="gaming-card bg-[#0a0a0a] border-2 border-green-900/50 p-16 text-center">
                        <svg className="w-32 h-32 mx-auto mb-8 text-green-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-3xl font-black italic text-white uppercase mb-4">Nenhuma Avaliação Criada</h2>
                        <p className="text-gray-400 font-mono mb-8">Crie sua primeira avaliação agendada para os alunos.</p>
                        <button
                            onClick={handleCreateClick}
                            className="btn-gaming bg-green-700 hover:bg-green-600 border-green-500"
                        >
                            CRIAR PRIMEIRA AVALIAÇÃO
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tests.map(test => {
                            const status = (test as any).status || 'SCHEDULED';
                            return (
                                <div key={test.id} className="gaming-card bg-[#0a0a0a] border border-[#333] hover:border-green-600 p-6 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black italic text-white">{test.name}</h3>
                                                {getStatusBadge(test)}
                                            </div>
                                            {test.description && (
                                                <p className="text-sm text-gray-400 mb-4">{test.description}</p>
                                            )}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                                                <div>
                                                    <span className="text-gray-500 uppercase block">Data/Hora</span>
                                                    <span className="text-white">{formatDate(test.createdAt || new Date().toISOString())}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 uppercase block">Local</span>
                                                    <span className="text-white">{test.location || 'Sala padrão'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 uppercase block">Questões</span>
                                                    <span className="text-white">{test.questionCount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 uppercase block">Tempo/Q</span>
                                                    <span className="text-white">{test.duration ? Math.round(test.duration / (test.questionCount || 1)) : 0}m</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4 self-center flex-col md:flex-row">
                                            <button
                                                onClick={() => handleViewResults(test.id, test.name)}
                                                className="btn-gaming bg-[#111] border-[#333] hover:border-white text-xs py-2 px-4"
                                            >
                                                RESULTADOS
                                            </button>

                                            {status === 'SCHEDULED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(test)}
                                                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-blue-500 hover:text-blue-500 text-xs py-2 px-4 uppercase"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleActivate(test.id)}
                                                        className="btn-gaming bg-blue-900/30 text-blue-500 border-blue-800 hover:bg-blue-900/50 hover:text-white text-xs py-2 px-4"
                                                    >
                                                        LIBERAR
                                                    </button>
                                                </>
                                            )}
                                            {status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleFinish(test.id)}
                                                    className="btn-gaming bg-yellow-900/30 text-yellow-500 border-yellow-800 hover:bg-yellow-900/50 hover:text-white text-xs py-2 px-4"
                                                >
                                                    ENCERRAR
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(test.id)}
                                                className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-red-600 text-xs py-2 px-4 text-red-500"
                                                title="Excluir Prova"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* RESULTS MODAL (Existing Code) */}
                {isResultsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#0f0f0f] border-2 border-green-600 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl p-6">
                            <div className="flex justify-between items-center border-b border-green-900/30 pb-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-black italic text-white uppercase">Resultados da Avaliação</h2>
                                    <p className="text-green-500 font-mono text-sm">{selectedTestName}</p>
                                </div>
                                <button onClick={() => setIsResultsModalOpen(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
                            </div>

                            {selectedTestResults.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 font-mono border border-dashed border-[#333]">
                                    Nenhum aluno realizou esta prova ainda.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 gap-4 text-xs font-mono uppercase text-gray-500 border-b border-[#333] pb-2 px-4">
                                        <div>Aluno</div>
                                        <div>Nota</div>
                                        <div>Acertos</div>
                                        <div>Data</div>
                                    </div>
                                    {selectedTestResults.map((result, idx) => (
                                        <div key={idx} className="grid grid-cols-4 gap-4 items-center bg-[#0a0a0a] border border-[#222] p-4 hover:border-green-600 transition-all">
                                            <div className="text-white font-bold truncate">
                                                {result.user?.email || 'Aluno ID: ' + result.userId}
                                            </div>
                                            <div>
                                                <span className={`text-lg font-black italic ${result.score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {Math.round(result.score)}%
                                                </span>
                                            </div>
                                            <div className="text-gray-400 font-mono text-xs">
                                                {result.correctAnswers} / {result.totalQuestions}
                                            </div>
                                            <div className="text-gray-500 text-xs font-mono">
                                                {new Date(result.completedAt).toLocaleDateString('pt-BR')} {new Date(result.completedAt).toLocaleTimeString('pt-BR')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
