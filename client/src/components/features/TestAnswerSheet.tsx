import { useState, useEffect } from 'react';
import type { TestQuestion } from '../../services/testService';

interface TestAnswerSheetProps {
    questions: TestQuestion[];
    answers: Map<string, string>;
    onAnswerChange: (questionId: string, value: string) => void;
    onFinish: () => void;
    answeredCount: number;
}

export function TestAnswerSheet({ questions, answers, onAnswerChange, onFinish, answeredCount }: TestAnswerSheetProps) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-[#e0e0e0] p-4 text-black font-sans shadow-2xl border-4 border-gray-600 rounded-lg relative">
            {/* Header / Top Panel */}
            <div className="flex gap-4 mb-4 items-stretch">
                {/* Keypad Mock (Decorative) */}
                <div className="hidden md:flex flex-col gap-1 p-2 bg-gradient-to-b from-gray-200 to-gray-400 border-2 border-gray-500 shadow-inner rounded w-32">
                    <div className="bg-gray-100 border border-gray-400 text-[10px] text-center p-1 mb-1 font-bold shadow-sm">
                        Salvar Prova Padrão
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        {[1, 5, 2, 6, 3, 7, 4, 8].map(n => (
                            <div key={n} className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-center py-1 text-xs shadow hover:bg-white cursor-pointer active:bg-gray-400">
                                {n}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Header Display */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-white border-2 border-black p-2 flex items-center justify-between shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                        <h1 className="text-4xl font-black italic tracking-tighter ml-2">PVO</h1>

                        <div className="flex bg-white gap-4 border-l-2 border-black pl-4">
                            <div className="flex flex-col text-xs font-bold border-r border-black pr-4">
                                <div className="flex justify-between w-24">
                                    <span>Respondidas:</span>
                                    <span>{answeredCount}</span>
                                </div>
                                <div className="flex justify-between w-24">
                                    <span>Total:</span>
                                    <span>{questions.length}</span>
                                </div>
                            </div>
                            <div className="flex items-center px-4">
                                <span className="text-2xl font-black font-mono">STATUS: EM PROVA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timers Panel */}
                <div className="bg-black text-white p-2 border-2 border-gray-500 w-40 flex flex-col justify-between shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                    <div className="text-center border-b border-gray-700 pb-1">
                        <div className="text-[10px] uppercase text-gray-400">Tempo de Prova</div>
                        <div className="text-xl font-mono text-green-400 font-bold">{formatTime(elapsedTime)}</div>
                    </div>
                    <div className="text-center pt-1">
                        <div className="text-[10px] uppercase text-gray-400">Tempo Ideal</div>
                        <div className="text-xl font-mono text-yellow-400 font-bold">--' --"</div>
                    </div>
                </div>
            </div>

            {/* Answer Grid */}
            <div className="bg-gray-300 border-2 border-gray-500 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-0 bg-gray-400/50 p-1 h-[60vh] overflow-y-auto content-start">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="flex items-center bg-gray-200 border-b border-gray-400 h-8 hover:bg-white transition-colors">
                            <div className="w-10 bg-gray-300 border-r border-gray-400 h-full flex items-center justify-center font-mono font-bold text-sm text-gray-700">
                                {(idx + 1).toString().padStart(2, '0')}
                            </div>
                            <div className="w-10 bg-white border-r border-gray-400 h-full flex items-center justify-center font-mono text-xs text-blue-800">
                                {String.fromCharCode(65 + (idx % 26))}{Math.floor(idx / 26) || ''}
                            </div>
                            <div className="flex-1 px-2">
                                <input
                                    type="text"
                                    value={answers.get(q.id) || ''}
                                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                                    className="w-full bg-transparent border-none outline-none font-mono text-sm uppercase text-black placeholder-gray-400"
                                    placeholder="DIGITE AQUI..."
                                    autoComplete="off"
                                />
                            </div>
                            <div className="w-10 h-full border-l border-gray-400 bg-gray-300"></div>
                        </div>
                    ))}
                    {/* Fill empy slots to look like the grid */}
                    {Array.from({ length: Math.max(0, 40 - questions.length) }).map((_, i) => (
                        <div key={`dummy-${i}`} className="flex items-center bg-gray-200 border-b border-gray-400 h-8 opacity-50">
                            <div className="w-10 bg-gray-300 border-r border-gray-400 h-full flex items-center justify-center font-mono text-sm text-gray-500">
                                {(questions.length + i + 1).toString().padStart(2, '0')}
                            </div>
                            <div className="flex-1 bg-gray-200"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Controls */}
            <div className="flex justify-between items-end mt-4">
                {/* Big Red Button */}
                <div className="relative group cursor-pointer w-20 h-28 bg-gradient-to-br from-yellow-300 to-yellow-600 border-2 border-black flex flex-col items-center p-2 shadow-xl" onClick={onFinish}>
                    <div className="text-red-600 font-black text-2xl mb-1 group-hover:scale-110 transition-transform">A</div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-4 border-gray-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center group-active:scale-95 transition-transform">
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-yellow-400 animate-[spin_10s_linear_infinite]"></div>
                    </div>
                </div>

                {/* OK Button with Lion */}
                <div className="flex items-end gap-2">
                    <button
                        onClick={onFinish}
                        className="h-10 px-6 bg-gray-200 border-2 border-gray-400 shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none font-black text-sm hover:bg-white"
                    >
                        OK
                    </button>
                    <div className="text-red-700 opacity-80">
                        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono w-32 text-right">
                MODO: FOLHA DE RESPOSTA DIGITAL
            </div>
        </div>
    );
}
