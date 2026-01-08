import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService, type ScheduledTest } from '../../services/testService';
import { useAuthStore } from '../../store/authStore';

export function TestPage() {
    const navigate = useNavigate();
    const { } = useAuthStore();
    const [tests, setTests] = useState<ScheduledTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const data = await testService.getStudentTests();
            setTests(data);
        } catch (error) {
            console.error('Error loading tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = async (testId: string) => {
        // Verificar se aluno já fez ou pode fazer
        try {
            const canTake = await testService.canStudentTakeTest(testId);
            if (!canTake) {
                alert('Esta prova ainda não está liberada para execução (aguarde o horário agendado).');
                return;
            }
            navigate(`/student/test/${testId}`);
        } catch (error) {
            console.error(error);
            alert('Erro ao verificar permissão da prova.');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                            <span className="text-red-600">CENTRO DE AVALIAÇÃO</span> <span className="text-gray-600">//</span> PROVAS
                        </h2>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">MISSÕES TÁTICAS ATRIBUÍDAS</p>
                    </div>
                </div>

                {/* Tests Grid */}
                {tests.length === 0 ? (
                    <div className="gaming-card bg-[#0a0a0a] border-2 border-dashed border-[#333] p-16 text-center">
                        <div className="text-6xl mb-4 text-gray-700">📭</div>
                        <h3 className="text-2xl font-black text-gray-500 uppercase italic mb-2">Nenhuma Prova Disponível</h3>
                        <p className="text-gray-600 font-mono">Você não possui avaliações agendadas no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map(test => {
                            const now = new Date();
                            // If scheduled_at exists, use it. Otherwise assume available.
                            const scheduledDate = test.scheduled_at ? new Date(test.scheduled_at) : null;
                            const isFuture = scheduledDate ? scheduledDate > now : false;

                            // Status Display Logic
                            let statusText = 'DISPONÍVEL';
                            let canStart = true;

                            if (isFuture && scheduledDate) {
                                statusText = `AGENDADA: ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                canStart = false;
                            }

                            return (
                                <div key={test.id} className={`gaming-card p-6 border-2 flex flex-col justify-between ${canStart ? 'bg-gradient-to-br from-red-900/10 to-black border-red-900/50' : 'bg-[#0a0a0a] border-[#333] opacity-70'}`}>
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${canStart ? 'bg-red-600 text-white border-red-600' : 'bg-[#111] text-yellow-500 border-yellow-900'}`}>
                                                {statusText}
                                            </span>
                                            {scheduledDate && (
                                                <span className="text-xs font-mono text-gray-500">
                                                    {scheduledDate.toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-black italic text-white uppercase mb-2 leading-tight">{test.name}</h3>
                                        {test.description && (
                                            <p className="text-sm text-gray-400 font-mono line-clamp-2 mb-4">{test.description}</p>
                                        )}

                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500 uppercase">Questões</span>
                                                <span className="text-white font-bold">{test.questionCount}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500 uppercase">Duração</span>
                                                <span className="text-white font-bold">{Math.ceil((test.duration || 0) / 60)} min</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500 uppercase">Tipo</span>
                                                <span className="text-blue-400 font-bold">PADRÃO</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => canStart && handleStartTest(test.id)}
                                        disabled={!canStart}
                                        className={`w-full py-3 font-black uppercase tracking-widest text-sm transition-all ${canStart
                                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                                            : 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed border border-[#333]'
                                            }`}
                                    >
                                        {canStart ? 'INICIAR MISSÃO' : 'AGUARDANDO HORÁRIO'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
