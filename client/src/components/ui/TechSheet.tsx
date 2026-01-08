import { useMemo } from 'react';

interface TechSheetProps {
    markdown: string;
    className?: string;
}

export function TechSheet({ markdown, className = '' }: TechSheetProps) {
    const content = useMemo(() => {
        if (!markdown) return null;

        // Split by lines
        const lines = markdown.split('\n');
        const elements: React.ReactNode[] = [];

        let currentSection: 'header' | 'specs' | 'analysis' = 'header';

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Header (## )
            if (trimmed.startsWith('## ')) {
                elements.push(
                    <h2 key={`h2-${index}`} className="text-xl font-black italic text-red-500 uppercase mb-4 mt-2 border-b border-red-900/50 pb-2">
                        {trimmed.replace('## ', '')}
                    </h2>
                );
                currentSection = 'specs';
                return;
            }

            // Subheader / bold line (**TEXT:**)
            if (trimmed.startsWith('**') && trimmed.includes('**') && !trimmed.includes(':')) {
                // Section Title like **ANÁLISE PVO:**
                const text = trimmed.replace(/\*\*/g, '');
                elements.push(
                    <h3 key={`h3-${index}`} className="text-lime-500 font-bold uppercase text-xs tracking-widest mt-6 mb-2 flex items-center gap-2">
                        <div className="w-1 h-1 bg-lime-500 rounded-full"></div>
                        {text}
                    </h3>
                );
                currentSection = 'analysis';
                return;
            }

            // Key-Value (**Key:** Value)
            const keyValueMatch = trimmed.match(/^\*\*(.*?):\*\*(.*)/);
            if (keyValueMatch) {
                const [, key, value] = keyValueMatch;
                elements.push(
                    <div key={`kv-${index}`} className="flex justify-between items-baseline text-sm mb-1 border-b border-[#222] pb-1 border-dashed">
                        <span className="text-gray-500 font-mono uppercase text-xs">{key}</span>
                        <span className="text-white font-bold ml-2 text-right">{value.trim()}</span>
                    </div>
                );
                return;
            }

            // Regular paragraph
            elements.push(
                <p key={`p-${index}`} className="text-gray-300 text-sm leading-relaxed mb-2 font-light text-justify">
                    {trimmed}
                </p>
            );
        });

        return elements;
    }, [markdown]);

    if (!markdown) {
        return (
            <div className={`text-center p-8 border border-dashed border-[#333] rounded ${className}`}>
                <p className="text-gray-600 font-mono text-xs uppercase">
                    {'>>'} DADOS TÉCNICOS INDISPONÍVEIS
                </p>
                <p className="text-gray-700 text-[10px] mt-2 max-w-[200px] mx-auto">
                    Solicite ao comando a atualização do banco de dados (Run SQL Script).
                </p>
            </div>
        );
    }

    return (
        <div className={`animate-fade-in ${className}`}>
            {content}
        </div>
    );
}
