import { useState, useEffect } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService, type ScheduledTest, type TestQuestion, type TestAttempt } from '../../services/testService';
import { equipmentService } from '../../services/equipmentService';
import { TestAnswerSheet } from '../../components/features/TestAnswerSheet';
import { AircraftButton } from '../../components/ui/AircraftButton';

type TestState = 'LOADING' | 'READY' | 'IN_PROGRESS' | 'FINISHED';
type ViewMode = 'CARD' | 'SHEET'; // Card is the standard image-focused view, Sheet is the retro grid

export function TakeTestPage() {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [state, setState] = useState<TestState>('LOADING');
    const [test, setTest] = useState<ScheduledTest | null>(null);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [equipmentData, setEquipmentData] = useState<Map<string, any>>(new Map());
    const [attempt, setAttempt] = useState<TestAttempt | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

    // View Mode State
    const [viewMode, setViewMode] = useState<ViewMode>('CARD');

    useEffect(() => {
        if (testId) {
            loadTest();
        }
    }, [testId]);

    // Auto-save quando resposta muda
    useEffect(() => {
        if (state === 'IN_PROGRESS' && attempt) {
            // In Sheet mode, we save whichever changed. The sheet component calls handleAnswerChange directly.
            // But for the 'current' question concept in CARD mode:
            if (viewMode === 'CARD') {
                const currentQuestion = questions[currentQuestionIndex];
                const answer = answers.get(currentQuestion?.id);

                if (answer !== undefined && currentQuestion) {
                    const debounce = setTimeout(() => {
                        saveAnswer(currentQuestion.id, answer);
                    }, 2000);
                    return () => clearTimeout(debounce);
                }
            }
        }
    }, [answers, currentQuestionIndex, state, attempt, viewMode]);

    const loadTest = async () => {
        try {
            const testData = await testService.getTest(testId!);
            setTest(testData);

            if (!testData.name) {
                // Mock active check for development
                const isActive = true;
                if (!isActive) {
                    alert('Esta prova ainda não foi liberada pelo instrutor.');
                    navigate('/student/dashboard');
                    return;
                }
            }

            const questionsData = await testService.getTestQuestions(testId!);
            setQuestions(questionsData);

            // Carregar somente equipamentos das questões (Paralelo)
            const equipMap = new Map();
            const equipmentPromises = questionsData.map(async (q) => {
                try {
                    const { equipment } = await equipmentService.getEquipmentById(q.equipment_id);
                    return { id: q.equipment_id, data: equipment };
                } catch (err) {
                    console.error(`Erro ao carregar equipamento ${q.equipment_id}`, err);
                    return null;
                }
            });

            const results = await Promise.all(equipmentPromises);
            results.forEach(res => {
                if (res) equipMap.set(res.id, res.data);
            });

            setEquipmentData(equipMap);

            setState('READY');
        } catch (error) {
            console.error('Error loading test:', error);
            alert('Erro ao carregar prova');
            navigate('/student/dashboard');
        }
    };

    const startTest = async () => {
        try {
            const attemptData = await testService.createAttempt(testId!);
            setAttempt(attemptData);
            setState('IN_PROGRESS');
            setQuestionStartTime(Date.now());
        } catch (error: any) {
            alert('Erro ao iniciar prova: ' + error.message);
        }
    };

    const saveAnswer = async (questionId: string, answerText: string) => {
        if (!attempt) return;

        // Note: Time tracking is less precise in Sheet mode (bulk entry), but we do what we can.
        const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);

        try {
            await testService.saveStudentAnswer(
                attempt.id,
                questionId,
                answerText,
                timeSpentOnQuestion
            );
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleAnswerChange = (value: string, specificQuestionId?: string) => {
        const qId = specificQuestionId || questions[currentQuestionIndex]?.id;
        if (qId) {
            setAnswers(prev => new Map(prev).set(qId, value));
            // For Manual Sheet mode, we might want to trigger save immediately or denounce logic per field
            // Reusing the effect for simplicity, but explicit save call here for Sheet mode might be better safeguard
            if (viewMode === 'SHEET') {
                // Debounce handling could be complex for multiple fields, 
                // simply updating state triggers the Effect if we tracked 'answers' broadly, 
                // but the Effect only looks at 'currentQuestion'.
                // So for Sheet Mode, we should probably auto-save explicitly here with a small debounce or just fire-and-forget
                saveAnswer(qId, value);
            }
        }
    };

    const goToQuestion = async (index: number) => {
        // Salvar resposta atual antes de trocar (only needed for Card mode really)
        if (viewMode === 'CARD') {
            const currentQuestion = questions[currentQuestionIndex];
            const currentAnswer = answers.get(currentQuestion?.id);

            if (currentAnswer && currentQuestion && attempt) {
                await saveAnswer(currentQuestion.id, currentAnswer);
            }
        }

        setCurrentQuestionIndex(index);
        setQuestionStartTime(Date.now());
    };

    const finishTest = async () => {
        if (!confirm('Tem certeza que deseja finalizar a prova?')) return;

        if (!attempt) return;

        try {
            // Salvar última resposta (Card mode)
            if (viewMode === 'CARD') {
                const currentQuestion = questions[currentQuestionIndex];
                const currentAnswer = answers.get(currentQuestion?.id);
                if (currentAnswer && currentQuestion) {
                    await saveAnswer(currentQuestion.id, currentAnswer);
                }
            }

            // Finalizar tentativa
            await testService.updateAttempt(attempt.id, {
                status: 'COMPLETED',
                finished_at: new Date().toISOString()
            });

            setState('FINISHED');
        } catch (error: any) {
            alert('Erro ao finalizar prova: ' + error.message);
        }
    };

    // LOADING
    if (state === 'LOADING') {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-mono">Carregando prova...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // READY TO START
    if (state === 'READY' && test) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto text-center space-y-8 py-12 animate-fade-in">
                    <div className="w-32 h-32 mx-auto bg-red-900/20 rounded-full border-4 border-red-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-5xl font-black italic text-white uppercase mb-4">{test.name}</h1>
                        <p className="text-gray-400 font-mono">{test.description}</p>
                    </div>

                    {/* Mode Selection Introduction */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div
                            onClick={() => setViewMode('CARD')}
                            className={`cursor-pointer border-2 p-4 w-40 hover:border-red-500 transition-all ${viewMode === 'CARD' ? 'bg-red-900/20 border-red-500' : 'bg-[#111] border-[#333]'}`}
                        >
                            <div className="text-xl mb-2">💻</div>
                            <div className="text-xs font-bold uppercase">Modo Online</div>
                            <div className="text-[10px] text-gray-400">Padrão com Imagens</div>
                        </div>
                        <div
                            onClick={() => setViewMode('SHEET')}
                            className={`cursor-pointer border-2 p-4 w-40 hover:border-red-500 transition-all ${viewMode === 'SHEET' ? 'bg-red-900/20 border-red-500' : 'bg-[#111] border-[#333]'}`}
                        >
                            <div className="text-xl mb-2">📝</div>
                            <div className="text-xs font-bold uppercase">Modo Sala</div>
                            <div className="text-[10px] text-gray-400">Folha de Resposta</div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 text-left">
                        <h3 className="text-xl font-black italic text-white uppercase mb-4">Instruções</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-red-600">▸</span>
                                <span>Você terá <strong>{questions.length} questões</strong> para responder</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-600">▸</span>
                                <span>Modo Selecionado: <strong>{viewMode === 'CARD' ? 'ONLINE (Completo)' : 'SALA DE AULA (Apenas Folha)'}</strong></span>
                            </li>
                        </ul>
                    </div>

                    <AircraftButton
                        onClick={startTest}
                        label="INICIAR PROVA AGORA"
                        className="w-full text-xl py-6"
                    />
                </div>
            </DashboardLayout>
        );
    }

    // IN PROGRESS
    if (state === 'IN_PROGRESS' && questions.length > 0) {

        // --- SHEET VIEW RENDER ---
        if (viewMode === 'SHEET') {
            const answeredCount = Array.from(answers.values()).filter(a => a.trim()).length;
            return (
                <div className="min-h-screen bg-[#111] p-4 flex flex-col items-center justify-start pt-10">
                    {/* Simplified Header for Sheet Mode */}
                    <div className="w-full max-w-5xl flex justify-between items-center mb-6">
                        <button onClick={() => navigate('/student/dashboard')} className="text-gray-500 hover:text-white font-mono text-sm">
                            ← SAIR
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setViewMode('CARD')} className="px-3 py-1 border border-gray-600 text-xs text-gray-400 hover:text-white hover:border-white uppercase font-mono">
                                Alternar para Modo Online
                            </button>
                        </div>
                    </div>

                    <TestAnswerSheet
                        questions={questions}
                        answers={answers}
                        onAnswerChange={(qId, val) => handleAnswerChange(val, qId)}
                        onFinish={finishTest}
                        answeredCount={answeredCount}
                    />
                </div>
            );
        }

        // --- CARD VIEW RENDER (Original) ---
        const currentQuestion = questions[currentQuestionIndex];
        const currentEquipment = equipmentData.get(currentQuestion.equipment_id);
        const currentAnswer = answers.get(currentQuestion.id) || '';
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const answeredCount = Array.from(answers.values()).filter(a => a.trim()).length;

        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase">Questão</p>
                            <p className="text-3xl font-black italic text-white">
                                {currentQuestionIndex + 1} / {questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Toggle Button */}
                            <button
                                onClick={() => setViewMode('SHEET')}
                                className="px-3 py-1 border border-gray-600 bg-[#111] text-xs font-mono text-gray-400 hover:text-white hover:border-white uppercase"
                            >
                                📝 Ver Folha
                            </button>
                            <div className="text-right">
                                <p className="text-xs font-mono text-gray-500 uppercase">Respondidas</p>
                                <p className="text-3xl font-black italic text-white">{answeredCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-[#1a1a1a] border border-[#333]">
                        <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Image */}
                    <div className="gaming-card bg-black border-2 border-[#333] aspect-video flex items-center justify-center p-8">
                        {currentEquipment?.imagePath ? (
                            <ZoomableImage
                                src={currentEquipment.imagePath}
                                alt="Equipment"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-600">Carregando imagem...</div>
                        )}
                    </div>

                    {/* Answer Input */}
                    <div className="space-y-3">
                        <label className="block text-sm font-mono uppercase text-gray-400">
                            Digite o nome do equipamento:
                        </label>
                        <input
                            type="text"
                            value={currentAnswer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="w-full bg-[#111] border-2 border-[#333] text-white px-6 py-4 text-xl font-mono focus:border-red-600 focus:outline-none"
                            placeholder="Digite aqui..."
                            autoFocus
                        />
                        {currentAnswer && (
                            <p className="text-xs text-green-500 font-mono flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Resposta salva automaticamente
                            </p>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => goToQuestion(currentQuestionIndex - 1)}
                            disabled={currentQuestionIndex === 0}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-1"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => goToQuestion(currentQuestionIndex + 1)}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-1"
                        >
                            Próxima →
                        </button>
                    </div>

                    {/* Quick Navigation */}
                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-4">
                        <p className="text-xs text-gray-500 uppercase font-mono mb-3">Navegação Rápida:</p>
                        <div className="grid grid-cols-10 gap-2">
                            {questions.map((q, idx) => {
                                const hasAnswer = answers.get(q.id)?.trim();
                                const isCurrent = idx === currentQuestionIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(idx)}
                                        className={`aspect-square border-2 text-sm font-bold transition-all ${isCurrent
                                            ? 'border-red-600 bg-red-600 text-white'
                                            : hasAnswer
                                                ? 'border-green-900 bg-green-900/20 text-green-500'
                                                : 'border-[#333] text-gray-600 hover:border-red-600'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Finish Button */}
                    <AircraftButton
                        onClick={finishTest}
                        label="FINALIZAR PROVA"
                        color="green"
                        className="w-full text-xl py-6 mt-8"
                    />
                </div>
            </DashboardLayout>
        );
    }

    // FINISHED
    if (state === 'FINISHED') {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto text-center space-y-8 py-12 animate-fade-in">
                    <div className="w-32 h-32 mx-auto bg-green-900/20 rounded-full border-4 border-green-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-5xl font-black italic text-white uppercase mb-4">Prova Finalizada!</h1>
                        <p className="text-gray-400 font-mono">Suas respostas foram enviadas com sucesso</p>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-green-900/50 p-8">
                        <p className="text-white mb-4">
                            Você respondeu <strong className="text-green-500">{answers.size} de {questions.length}</strong> questões.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Aguarde a correção do instrutor para ver sua nota final.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="w-full btn-gaming bg-red-700 hover:bg-red-600 border-red-500 py-4"
                        >
                            Voltar ao Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/student/results')}
                            className="w-full btn-gaming bg-[#1a1a1a] border-[#333] hover:border-green-600 py-4"
                        >
                            Ver Histórico de Avaliações
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return null;
}
