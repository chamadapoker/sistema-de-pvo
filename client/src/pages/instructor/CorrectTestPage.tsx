import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService, type ScheduledTest, type StudentAnswer } from '../../services/testService';
import { equipmentService } from '../../services/equipmentService';

type CorrectionView = 'SELECT_TEST' | 'SELECT_STUDENT' | 'CORRECTING' | 'FINISHED';

export function CorrectTestPage() {
    const navigate = useNavigate();

    const [view, setView] = useState<CorrectionView>('SELECT_TEST');
    const [loading, setLoading] = useState(true);

    // Selection
    const [testsNeedingCorrection, setTestsNeedingCorrection] = useState<any[]>([]);
    const [selectedTest, setSelectedTest] = useState<ScheduledTest | null>(null);
    const [attempts, setAttempts] = useState<any[]>([]);
    const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);

    // Correction
    const [answers, setAnswers] = useState<any[]>([]); // Using any because includes joined question data
    const [equipmentData, setEquipmentData] = useState<Map<string, any>>(new Map());
    const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
    const [correctedCount, setCorrectedCount] = useState(0);

    useEffect(() => {
        loadTestsNeedingCorrection();
    }, []);

    const loadTestsNeedingCorrection = async () => {
        try {
            const tests = await testService.getTestsNeedingCorrection();
            setTestsNeedingCorrection(tests);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectTest = async (testId: string) => {
        try {
            setLoading(true);
            const testData = await testService.getTest(testId);
            const attemptsData = await testService.getTestAttemptsForCorrection(testId);
            setSelectedTest(testData);
            setAttempts(attemptsData);
            setView('SELECT_STUDENT');
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao carregar prova');
        } finally {
            setLoading(false);
        }
    };

    const selectAttempt = async (attempt: any) => {
        try {
            setLoading(true);
            const attemptDetails = await testService.getAttemptForCorrection(attempt.id);
            setSelectedAttempt(attempt);
            setAnswers(attemptDetails.answers || []);

            // Carregar equipamentos
            const equipMap = new Map();
            for (const answer of attemptDetails.answers || []) {
                if (answer.question?.equipment_id) {
                    try {
                        const { equipment } = await equipmentService.getAllEquipment();
                        const equip = equipment.find(e => e.id === answer.question.equipment_id);
                        if (equip) {
                            equipMap.set(answer.question.equipment_id, equip);
                        }
                    } catch (error) {
                        console.error('Error loading equipment:', error);
                    }
                }
            }
            setEquipmentData(equipMap);

            // Contar já corrigidas
            const corrected = attemptDetails.answers.filter((a: StudentAnswer) => a.is_correct !== null && a.is_correct !== undefined).length;
            setCorrectedCount(corrected);

            setView('CORRECTING');
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao carregar tentativa');
        } finally {
            setLoading(false);
        }
    };

    const correctAnswer = async (isCorrect: boolean, points?: number, feedback?: string) => {
        const currentAnswer = answers[currentAnswerIndex];
        if (!currentAnswer) return;

        try {
            const pointsToAward = points !== undefined ? points : (isCorrect ? (currentAnswer.question?.points || 1) : 0);

            await testService.correctAnswer(
                currentAnswer.id,
                isCorrect,
                pointsToAward,
                feedback
            );

            // Atualizar estado local
            const updatedAnswers = [...answers];
            updatedAnswers[currentAnswerIndex] = {
                ...currentAnswer,
                is_correct: isCorrect,
                points_earned: pointsToAward,
                instructor_feedback: feedback
            };
            setAnswers(updatedAnswers);
            setCorrectedCount(prev => prev + 1);

            // Ir para próxima questão se não for a última
            if (currentAnswerIndex < answers.length - 1) {
                setCurrentAnswerIndex(prev => prev + 1);
            }
        } catch (error: any) {
            alert('Erro ao salvar correção: ' + error.message);
        }
    };

    const finishCorrection = async () => {
        if (!selectedAttempt) return;

        const uncorrected = answers.filter(a => a.is_correct === null || a.is_correct === undefined).length;
        if (uncorrected > 0) {
            if (!confirm(`Ainda há ${uncorrected} questões sem correção. Deseja continuar?`)) {
                return;
            }
        }

        try {
            await testService.calculateWrittenTestScore(selectedAttempt.id);
            alert('Correção finalizada e nota calculada com sucesso!');
            setView('FINISHED');
        } catch (error: any) {
            alert('Erro ao finalizar correção: ' + error.message);
        }
    };

    // SELECT TEST VIEW
    if (view === 'SELECT_TEST') {
        return (
            <DashboardLayout>
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <div className="border-b border-green-900/30 pb-6">
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                            <span className="text-green-600">Corrigir</span> Provas
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                            Selecione uma prova para corrigir
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : testsNeedingCorrection.length === 0 ? (
                        <div className="gaming-card bg-[#0a0a0a] border-2 border-green-900/50 p-16 text-center">
                            <svg className="w-32 h-32 mx-auto mb-8 text-green-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-black italic text-white uppercase mb-4">
                                Nenhuma Prova Pendente
                            </h2>
                            <p className="text-gray-400 font-mono">Todas as provas foram corrigidas!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {testsNeedingCorrection.map((test: any) => (
                                <button
                                    key={test.test_id}
                                    onClick={() => selectTest(test.test_id)}
                                    className="w-full gaming-card bg-[#0a0a0a] border border-[#333] hover:border-green-600 p-6 text-left transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black italic text-white mb-2">{test.test_title}</h3>
                                            <p className="text-sm text-gray-400 font-mono">
                                                {test.uncorrected_count} respostas pendentes de correção
                                            </p>
                                        </div>
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/instructor/tests')}
                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600"
                    >
                        ← Voltar
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // SELECT STUDENT VIEW
    if (view === 'SELECT_STUDENT' && selectedTest) {
        return (
            <DashboardLayout>
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <div className="border-b border-green-900/30 pb-6">
                        <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">
                            {selectedTest.name}
                        </h1>
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                            Selecione um aluno para corrigir
                        </p>
                    </div>

                    {attempts.length === 0 ? (
                        <div className="gaming-card bg-[#0a0a0a] border-2 border-green-900/50 p-16 text-center">
                            <p className="text-gray-400 font-mono">Nenhum aluno completou esta prova ainda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {attempts.map((attempt: any) => (
                                <button
                                    key={attempt.id}
                                    onClick={() => selectAttempt(attempt)}
                                    className="gaming-card bg-[#0a0a0a] border border-[#333] hover:border-green-600 p-6 text-left transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-900/20 border border-green-900 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-bold text-lg">
                                                {attempt.student?.raw_user_meta_data?.name?.[0]?.toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-bold">{attempt.student?.raw_user_meta_data?.name || 'Aluno'}</p>
                                            <p className="text-xs text-gray-500 font-mono">{attempt.student?.email}</p>
                                        </div>
                                        {attempt.score !== null && (
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-green-600">{attempt.score}%</p>
                                                <p className="text-xs text-gray-500 font-mono">Corrigida</p>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setView('SELECT_TEST')}
                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600"
                    >
                        ← Voltar
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // CORRECTING VIEW
    if (view === 'CORRECTING' && answers.length > 0) {
        const currentAnswer = answers[currentAnswerIndex];
        const equipment = equipmentData.get(currentAnswer.question?.equipment_id);
        const progress = ((currentAnswerIndex + 1) / answers.length) * 100;
        const isCorrected = currentAnswer.is_correct !== null && currentAnswer.is_correct !== undefined;

        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase">Questão</p>
                            <p className="text-3xl font-black italic text-white">
                                {currentAnswerIndex + 1} / {answers.length}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-mono text-gray-500 uppercase">Corrigidas</p>
                            <p className="text-3xl font-black italic text-white">{correctedCount}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="h-2 bg-[#1a1a1a] border border-[#333]">
                        <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }}></div>
                    </div>

                    {/* Image */}
                    <div className="gaming-card bg-black border-2 border-[#333] aspect-video flex items-center justify-center p-8">
                        {equipment?.imagePath ? (
                            <img
                                src={equipment.imagePath}
                                alt="Equipment"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-600">Carregando imagem...</div>
                        )}
                    </div>

                    {/* Comparison */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="gaming-card bg-[#0a0a0a] border border-blue-900/50 p-6">
                            <p className="text-xs text-gray-500 uppercase font-mono mb-2">Resposta Esperada</p>
                            <p className="text-xl font-black text-blue-500">{equipment?.name || 'Carregando...'}</p>
                            <p className="text-sm text-gray-400 font-mono mt-1">{equipment?.code}</p>
                        </div>
                        <div className="gaming-card bg-[#0a0a0a] border border-yellow-900/50 p-6">
                            <p className="text-xs text-gray-500 uppercase font-mono mb-2">Resposta do Aluno</p>
                            <p className="text-xl font-black text-yellow-500">{currentAnswer.answer_text || '(Não respondeu)'}</p>
                        </div>
                    </div>

                    {/* Correction */}
                    {!isCorrected && (
                        <div className="gaming-card bg-[#0a0a0a] border-2 border-green-900/50 p-8 space-y-6">
                            <h3 className="text-xl font-black italic text-green-600 uppercase">Avaliação</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => correctAnswer(true)}
                                    className="btn-gaming bg-green-700 hover:bg-green-600 border-green-500 py-8 text-xl"
                                >
                                    <div className="text-4xl mb-2">✓</div>
                                    <div>CORRETO</div>
                                    <div className="text-xs mt-1 opacity-75">1.0 ponto</div>
                                </button>
                                <button
                                    onClick={() => correctAnswer(false)}
                                    className="btn-gaming bg-red-700 hover:bg-red-600 border-red-500 py-8 text-xl"
                                >
                                    <div className="text-4xl mb-2">✗</div>
                                    <div>INCORRETO</div>
                                    <div className="text-xs mt-1 opacity-75">0.0 pontos</div>
                                </button>
                                <button
                                    onClick={() => correctAnswer(true, 0.5)}
                                    className="btn-gaming bg-yellow-700 hover:bg-yellow-600 border-yellow-500 py-8 text-xl"
                                >
                                    <div className="text-4xl mb-2">~</div>
                                    <div>PARCIAL</div>
                                    <div className="text-xs mt-1 opacity-75">0.5 pontos</div>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-mono uppercase text-gray-400 mb-2">
                                    Feedback (Opcional)
                                </label>
                                <textarea
                                    id="feedback"
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-4 py-3 font-mono focus:border-green-600 focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="Deixe um comentário para o aluno..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Already Corrected */}
                    {isCorrected && (
                        <div className="gaming-card bg-[#0a0a0a] border-2 border-green-900/50 p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-white font-bold">Questão já corrigida</p>
                                    <p className="text-sm text-gray-400">
                                        {currentAnswer.is_correct ? '✓ Correto' : '✗ Incorreto'} • {currentAnswer.points_earned} pontos
                                    </p>
                                </div>
                            </div>
                            {currentAnswer.instructor_feedback && (
                                <div className="bg-[#111] border border-[#333] p-4">
                                    <p className="text-xs text-gray-500 uppercase font-mono mb-2">Feedback:</p>
                                    <p className="text-white">{currentAnswer.instructor_feedback}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setCurrentAnswerIndex(prev => prev - 1)}
                            disabled={currentAnswerIndex === 0}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600 disabled:opacity-30 flex-1"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => setCurrentAnswerIndex(prev => prev + 1)}
                            disabled={currentAnswerIndex === answers.length - 1}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600 disabled:opacity-30 flex-1"
                        >
                            Próxima →
                        </button>
                    </div>

                    {/* Finish */}
                    <button
                        onClick={finishCorrection}
                        className="w-full btn-gaming bg-green-700 hover:bg-green-600 border-green-500 py-4 text-xl"
                    >
                        ✓ FINALIZAR CORREÇÃO E CALCULAR NOTA
                    </button>

                    <button
                        onClick={() => setView('SELECT_STUDENT')}
                        className="w-full btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600"
                    >
                        ← Voltar para Lista de Alunos
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // FINISHED VIEW
    if (view === 'FINISHED') {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto text-center space-y-8 py-12 animate-fade-in">
                    <div className="w-32 h-32 mx-auto bg-green-900/20 rounded-full border-4 border-green-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-5xl font-black italic text-white uppercase mb-4">Correção Finalizada!</h1>
                        <p className="text-gray-400 font-mono">Nota calculada e salva com sucesso</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setView('SELECT_STUDENT')}
                            className="w-full btn-gaming bg-green-700 hover:bg-green-600 border-green-500 py-4"
                        >
                            Corrigir Outro Aluno
                        </button>
                        <button
                            onClick={() => navigate('/instructor/tests')}
                            className="w-full btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600 py-4"
                        >
                            Voltar para Gerenciar Provas
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return null;
}
