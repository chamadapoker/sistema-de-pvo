import { useState, useRef, useEffect } from 'react';

interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleZoom = (delta: number) => {
        setScale(prev => Math.min(Math.max(1, prev + delta), 4));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const close = () => {
        setIsOpen(false);
        resetZoom();
    };

    return (
        <>
            {/* Thumbnail with Overlay Trigger */}
            <div
                className={`relative group cursor-zoom-in ${className}`}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card flip if inside a card
                    setIsOpen(true);
                }}
            >
                <img src={src} alt={alt} className="w-full h-full object-contain" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden animate-fade-in"
                    onClick={close}
                >
                    {/* Controls */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
                        <div className="pointer-events-auto bg-black/50 backdrop-blur px-4 py-2 rounded border border-gray-800 text-gray-400 font-mono text-xs">
                            {Math.round(scale * 100)}% ZOOM | ARRASTE PARA MOVER
                        </div>

                        <div className="pointer-events-auto flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleZoom(-0.5); }}
                                className="p-3 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full border border-gray-700"
                                title="Diminuir Zoom"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleZoom(0.5); }}
                                className="p-3 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full border border-gray-700"
                                title="Aumentar Zoom"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); close(); }}
                                className="p-3 bg-red-900/80 hover:bg-red-800 text-white rounded-full border border-red-700 ml-4"
                                title="Fechar"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div
                        ref={containerRef}
                        className="w-full h-full flex items-center justify-center cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={(e) => {
                            e.stopPropagation();
                            handleZoom(e.deltaY > 0 ? -0.2 : 0.2);
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent clicking background from closing if clicking image
                    >
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-100 ease-out select-none"
                            style={{
                                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                            }}
                            draggable={false}
                        />
                    </div>

                    {/* Guidelines Overlay (Tactical look) */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500"></div>
                        <div className="absolute top-[25%] left-0 right-0 h-px bg-red-500/30 border-t border-dashed border-red-500"></div>
                        <div className="absolute top-[75%] left-0 right-0 h-px bg-red-500/30 border-t border-dashed border-red-500"></div>
                        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-red-500/30 border-l border-dashed border-red-500"></div>
                        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-red-500/30 border-l border-dashed border-red-500"></div>
                    </div>
                </div>
            )}
        </>
    );
}
