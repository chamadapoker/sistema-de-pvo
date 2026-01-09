import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AircraftButtonProps {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
    color?: 'red' | 'blue' | 'green' | 'yellow';
    className?: string;
    disabled?: boolean;
}

export function AircraftButton({ onClick, label, icon, color = 'red', className = '', disabled = false }: AircraftButtonProps) {
    const [isFlying, setIsFlying] = useState(false);

    const colors = {
        red: 'from-red-600 to-red-800 border-red-500 shadow-red-900/50',
        blue: 'from-blue-600 to-blue-800 border-blue-500 shadow-blue-900/50',
        green: 'from-green-600 to-green-800 border-green-500 shadow-green-900/50',
        yellow: 'from-yellow-500 to-yellow-700 border-yellow-400 shadow-yellow-900/50',
    };

    const handleClick = () => {
        if (disabled) return;
        setIsFlying(true);
        onClick();
        setTimeout(() => setIsFlying(false), 1000); // Reset after animation
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                relative group overflow-hidden px-8 py-3 rounded-sm border-2 
                bg-gradient-to-r ${colors[color]} 
                shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                transition-all duration-200 uppercase font-black italic tracking-widest text-white
                flex items-center justify-center gap-3
                disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
                ${className}
            `}
        >
            {/* Jet Icon Animation */}
            <AnimatePresence>
                {isFlying && (
                    <motion.div
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: 200, y: -50, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.8, ease: "easeIn" }}
                        className="absolute left-4 z-20 text-white"
                    >
                        <svg className="w-6 h-6 rotate-45" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Static Icon (if enabled and not flying) */}
            {!isFlying && (
                <div className="relative z-10">
                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                </div>
            )}

            <span className="relative z-10">{label}</span>

            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
        </button>
    );
}
