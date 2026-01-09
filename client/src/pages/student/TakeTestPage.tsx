// ... imports remain the same
import { useState, useEffect, useRef } from 'react';
import { ZoomableImage } from '../../components/ui/ZoomableImage';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { testService, type ScheduledTest, type TestQuestion, type TestAttempt } from '../../services/testService';
import { equipmentService } from '../../services/equipmentService';
import { TestAnswerSheet } from '../../components/features/TestAnswerSheet';
import { AircraftButton } from '../../components/ui/AircraftButton';

type TestState = 'LOADING' | 'READY' | 'IN_PROGRESS' | 'FINISHED';
type ViewMode = 'CARD' | 'SHEET' | 'SPEED'; // Added SPEED mode

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

    // Speed Mode State
    const [timeLeft, setTimeLeft] = useState(15);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const answerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (testId) {
            loadTest();
        }
    }, [testId]);

    // Timer Logic for Speed Mode
    useEffect(() => {
        let interval: any;
        if (state === 'IN_PROGRESS' && viewMode === 'SPEED' && isTimerRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Time's up for this question
                        handleTimeUp();
                        return 15; // Reset for next (visual only, actual handling in handleTimeUp)
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [state, viewMode, isTimerRunning, currentQuestionIndex]);

    const handleTimeUp = () => {
        // Save current answer
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = answers.get(currentQuestion?.id);
        if (currentQuestion) {
            saveAnswer(currentQuestion.id, currentAnswer || '');
        }

        // Move to next or finish
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(15);
            setQuestionStartTime(Date.now());
        } else {
            finishTest();
        }
    };

    // Auto-focus input when entering answer phase in Speed Mode
    useEffect(() => {
        if (viewMode === 'SPEED' && timeLeft <= 12 && timeLeft > 0) {
            // Give a tiny delay for render
            setTimeout(() => {
                answerInputRef.current?.focus();
            }, 50);
        }
    }, [timeLeft, viewMode]);

    // Auto-save quando resposta muda (Standard Card Mode Only)
    useEffect(() => {
        if (state === 'IN_PROGRESS' && attempt && viewMode === 'CARD') {
            const currentQuestion = questions[currentQuestionIndex];
            const answer = answers.get(currentQuestion?.id);

            if (answer !== undefined && currentQuestion) {
                const debounce = setTimeout(() => {
                    saveAnswer(currentQuestion.id, answer);
                }, 2000);
                return () => clearTimeout(debounce);
            }
        }
    }, [answers, currentQuestionIndex, state, attempt, viewMode]);

    const loadTest = async () => {
        try {
            const testData = await testService.getTest(testId!);
            setTest(testData);

            if (!testData.name) {
                // Mock active check for development
                const isActive = true; // testData.is_active;
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
            if (viewMode === 'SPEED') {
                setTimeLeft(15);
                setIsTimerRunning(true);
            }
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
            if (viewMode === 'SHEET') {
                saveAnswer(qId, value);
            }
        }
    };

    const goToQuestion = async (index: number) => {
        // Salvar resposta atual antes de trocar (only needed for Card mode really)
        if (viewMode === 'CARD' || viewMode === 'SPEED') {
            const currentQuestion = questions[currentQuestionIndex];
            const currentAnswer = answers.get(currentQuestion?.id);

            if (currentAnswer && currentQuestion && attempt) {
                await saveAnswer(currentQuestion.id, currentAnswer);
            }
        }

        setCurrentQuestionIndex(index);
        setQuestionStartTime(Date.now());

        if (viewMode === 'SPEED') {
            setTimeLeft(15);
            setIsTimerRunning(true);
        }
    };

    const finishTest = async () => {
        // For Speed Mode, we might want to skip confirmation if it's auto-finish, but let's keep it safe or simple
        if (viewMode !== 'SPEED' && !confirm('Tem certeza que deseja finalizar a prova?')) return;

        // Speed mode auto-finish doesn't confirm, manual button click does? 
        // Let's assume standard confirm if user clicks button, but auto-finish logic calls this too.
        // We'll skip confirm if called programmatically via timer? 
        // For now, simplicity: confirm is removed for SPEED mode ending automatically.

        if (!attempt) return;
        setIsTimerRunning(false);

        try {
            // Salvar última resposta (Card mode)
            if (viewMode === 'CARD' || viewMode === 'SPEED') {
                const currentQuestion = questions[currentQuestionIndex];
                const currentAnswer = answers.get(currentQuestion?.id);
                if (currentAnswer !== undefined && currentQuestion) {
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
                <div className="max-w-4xl mx-auto text-center space-y-8 py-12 animate-fade-in">
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
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div
                            onClick={() => setViewMode('CARD')}
                            className={`cursor-pointer border-2 p-6 w-48 hover:border-red-500 transition-all group ${viewMode === 'CARD' ? 'bg-red-900/20 border-red-500' : 'bg-[#111] border-[#333]'}`}
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💻</div>
                            <div className="text-sm font-bold uppercase mb-1 text-white">Modo Online</div>
                            <div className="text-[10px] text-gray-400 leading-tight">Padrão com Imagens<br />Sem limite de tempo</div>
                        </div>
                        <div
                            onClick={() => setViewMode('SHEET')}
                            className={`cursor-pointer border-2 p-6 w-48 hover:border-red-500 transition-all group ${viewMode === 'SHEET' ? 'bg-red-900/20 border-red-500' : 'bg-[#111] border-[#333]'}`}
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📝</div>
                            <div className="text-sm font-bold uppercase mb-1 text-white">Modo Sala</div>
                            <div className="text-[10px] text-gray-400 leading-tight">Folha de Resposta<br />Para projeção</div>
                        </div>
                        <div
                            onClick={() => setViewMode('SPEED')}
                            className={`cursor-pointer border-2 p-6 w-48 hover:border-lime-500 transition-all group ${viewMode === 'SPEED' ? 'bg-lime-900/20 border-lime-500' : 'bg-[#111] border-[#333]'}`}
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                            <div className="text-sm font-bold uppercase mb-1 text-white">Speed Drill</div>
                            <div className="text-[10px] text-gray-400 leading-tight">3s Visualização<br />12s Resposta</div>
                        </div>
                    </div>

                    <div className="gaming-card bg-[#0a0a0a] border border-[#333] p-8 text-left max-w-2xl mx-auto">
                        <h3 className="text-xl font-black italic text-white uppercase mb-4">Instruções</h3>
                        <ul className="space-y-3 text-gray-300 font-mono text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-red-600">▸</span>
                                <span>Você terá <strong>{questions.length} questões</strong> para responder</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-600">▸</span>
                                <span>Modo Selecionado:
                                    <strong className="ml-1 text-white uppercase">
                                        {viewMode === 'CARD' ? 'ONLINE (Padrão)' : viewMode === 'SHEET' ? 'SALA DE AULA (Folha)' : 'SPEED DRILL (Rápido)'}
                                    </strong>
                                </span>
                            </li>
                            {viewMode === 'SPEED' && (
                                <li className="flex items-start gap-3 text-lime-500">
                                    <span className="text-lime-500">⚠</span>
                                    <span>ATENÇÃO: A imagem ficará visível por apenas <strong>3 SEGUNDOS</strong>. Depois você terá <strong>12 SEGUNDOS</strong> para digitar a resposta antes da próxima questão.</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <AircraftButton
                        onClick={startTest}
                        label="INICIAR PROVA AGORA"
                        className="w-full max-w-2xl text-xl py-6 mx-auto"
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
                            <span className="text-gray-500 font-mono text-xs uppercase">MODO FOLHA DE RESPOSTA</span>
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

        // --- CARD & SPEED VIEW RENDER ---
        const currentQuestion = questions[currentQuestionIndex];
        const currentEquipment = equipmentData.get(currentQuestion.equipment_id);
        const currentAnswer = answers.get(currentQuestion.id) || '';
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const answeredCount = Array.from(answers.values()).filter(a => a.trim()).length;

        // Speed Mode Logic Vars
        const isSpeedMode = viewMode === 'SPEED';
        const inObservationPhase = isSpeedMode && timeLeft > 12; // First 3 seconds (15, 14, 13)
        const inAnswerPhase = isSpeedMode && timeLeft <= 12;

        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative">

                    {/* Speed Mode Timer Overlay/Header */}
                    {isSpeedMode && (
                        <div className="fixed top-0 left-0 w-full bg-black/90 z-50 p-2 flex justify-center items-center gap-4 border-b border-[#333]">
                            <div className="text-sm font-mono text-gray-400">QUESTÃO {currentQuestionIndex + 1}/{questions.length}</div>
                            <div className={`text-4xl font-black italic ${inObservationPhase ? 'text-lime-500' : 'text-red-500 animate-pulse'}`}>
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </div>
                            <div className="text-xs font-mono font-bold uppercase">
                                {inObservationPhase ? 'MEMORIZE O ALVO' : 'IDENTIFIQUE O ALVO'}
                            </div>
                        </div>
                    )}

                    {/* Standard Header (Hidden in Speed Mode to reduce clutter?) -> Kept minimal */}
                    {!isSpeedMode && (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-mono text-gray-500 uppercase">Questão</p>
                                <p className="text-3xl font-black italic text-white">
                                    {currentQuestionIndex + 1} / {questions.length}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-gray-500 uppercase">Respondidas</p>
                                <p className="text-3xl font-black italic text-white">{answeredCount}</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar (Standard) */}
                    {!isSpeedMode && (
                        <div className="h-2 bg-[#1a1a1a] border border-[#333]">
                            <div
                                className="h-full bg-red-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 md:mt-0">
                        {/* Image Section */}
                        <div className={`gaming-card bg-black border-2 border-[#333] aspect-video flex items-center justify-center p-8 relative overflow-hidden transition-all duration-300 ${inAnswerPhase ? 'blur-xl grayscale opacity-20' : ''}`}>
                            {currentEquipment?.imagePath ? (
                                <ZoomableImage
                                    src={currentEquipment.imagePath}
                                    alt="Equipment"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-600">Carregando imagem...</div>
                            )}

                            {/* Overlay message for Answer Phase */}
                            {inAnswerPhase && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="text-6xl mb-2">🔒</div>
                                        <div className="text-white font-black italic uppercase">IMAGEM OCULTA</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* In Speed Mode, hide input label instructions during observation to reduce distraction */}
                            <div className={`transition-all duration-300 ${inObservationPhase ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                                <label className="block text-sm font-mono uppercase text-gray-400 mb-2">
                                    IDENTIFICAÇÃO DO VETOR:
                                </label>
                                <input
                                    ref={answerInputRef}
                                    type="text"
                                    value={currentAnswer}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    className="w-full bg-[#111] border-2 border-[#333] text-white px-6 py-4 text-xl font-mono focus:border-red-600 focus:outline-none uppercase"
                                    placeholder={inObservationPhase ? "AGUARDE..." : "DIGITE O NOME..."}
                                    disabled={inObservationPhase}
                                    autoFocus={!isSpeedMode}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // Optional: Allow submit on enter
                                            if (isSpeedMode) {
                                                handleTimeUp(); // Force next
                                            } else {
                                                if (currentQuestionIndex < questions.length - 1) goToQuestion(currentQuestionIndex + 1);
                                            }
                                        }
                                    }}
                                />
                                {currentAnswer && (
                                    <p className="text-xs text-green-500 font-mono flex items-center gap-2 mt-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        RESPOSTA REGISTRADA
                                    </p>
                                )}
                            </div>

                            {!isSpeedMode && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                        disabled={currentQuestionIndex === 0}
                                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-1 py-4"
                                    >
                                        ← Anterior
                                    </button>
                                    <button
                                        onClick={() => goToQuestion(currentQuestionIndex + 1)}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="btn-gaming bg-[#1a1a1a] border-[#333] hover:border-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-1 py-4"
                                    >
                                        Próxima →
                                    </button>
                                </div>
                            )}

                            {isSpeedMode && (
                                <button
                                    onClick={handleTimeUp}
                                    className="w-full btn-gaming bg-[#1a1a1a] border border-[#333] hover:border-lime-500 hover:text-lime-500 py-4 text-xs font-mono uppercase"
                                >
                                    CONFIRMAR E PULAR (ENTER)
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Finish Button (Only standard mode) */}
                    {!isSpeedMode && (
                        <AircraftButton
                            onClick={finishTest}
                            label="FINALIZAR PROVA"
                            color="green"
                            className="w-full text-xl py-6 mt-12"
                        />
                    )}
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
