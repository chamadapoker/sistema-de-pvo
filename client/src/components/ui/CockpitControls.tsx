
import React from 'react';

interface CockpitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'warning' | 'default';
    label: string;
    subLabel?: string;
    isActive?: boolean;
}

export function MFDButton({ label, subLabel, isActive, className, ...props }: CockpitButtonProps) {
    return (
        <button
            className={`
                relative group flex flex-col items-center justify-center
                bg-[#2a2a2a] border-2 border-[#111] 
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_0_rgba(0,0,0,0.5)]
                active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] active:translate-y-[2px]
                transition-all duration-100 ease-out py-3 px-4 rounded-sm
                ${isActive ? 'bg-[#3a3a3a] border-l-4 border-l-green-500' : 'hover:bg-[#333]'}
                ${className}
            `}
            {...props}
        >
            {/* Screw heads for realism */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] opacity-50"></div>

            <span className={`text-sm font-mono font-bold uppercase tracking-widest ${isActive ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-gray-400 group-hover:text-white'}`}>
                {label}
            </span>
            {subLabel && (
                <span className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                    {subLabel}
                </span>
            )}
        </button>
    );
}

export function GuardedButton({ onClick, label, disabled, className }: { onClick?: () => void, label: string, disabled?: boolean, className?: string }) {
    return (
        <div className={`relative inline-block ${className}`}>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    relative z-10 w-full overflow-hidden
                    bg-gradient-to-b from-[#b91c1c] to-[#991b1b]
                    border-x-4 border-y-2 border-[#7f1d1d]
                    shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_4px_0_#450a0a,0_8px_10px_rgba(0,0,0,0.5)]
                    active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.4),0_0_0_#450a0a] active:translate-y-[4px] active:border-y-0
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
                    text-white font-black font-mono uppercase tracking-widest text-lg
                    py-4 px-8 rounded-sm transition-all
                    flex items-center justify-center gap-2
                    group
                `}
            >
                <div className="w-full h-[1px] bg-black/20 absolute top-1 left-0"></div>
                <div className="w-full h-[1px] bg-black/20 absolute top-2 left-0"></div>
                <div className="w-full h-[1px] bg-black/20 absolute bottom-1 left-0"></div>

                <span className="relative z-20 drop-shadow-md group-hover:text-yellow-200 transition-colors">
                    {label}
                </span>

                {/* Warning Stripes on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] transition-opacity"></div>
            </button>

            {/* Guard Cover Hint (Decorative) */}
            <div className="absolute -top-3 left-0 w-full h-4 border-t-2 border-l-2 border-r-2 border-yellow-600/50 rounded-t pointer-events-none"></div>
        </div>
    );
}

export function HUDPanel({ children, title, className }: { children: React.ReactNode, title?: string, className?: string }) {
    return (
        <div className={`relative bg-[#0a0f0a] border-2 border-[#1a1f1a] rounded-lg overflow-hidden ${className}`}>
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,0,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none z-0"></div>

            {/* Glare */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none z-10"></div>

            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-900/50"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-900/50"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-900/50"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-900/50"></div>

            {title && (
                <div className="absolute top-0 left-0 bg-[#1a1f1a] px-3 py-1 border-b border-r border-green-900/30 rounded-br">
                    <span className="text-[10px] font-mono font-bold text-green-700 uppercase tracking-widest">{title}</span>
                </div>
            )}

            <div className="relative z-20 p-6">
                {children}
            </div>
        </div>
    );
}
