import React, { useEffect } from 'react';

interface LightboxProps {
    src: string;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
    currentIndex: number;
    totalItems: number;
}

const Lightbox: React.FC<LightboxProps> = ({ src, onClose, onNext, onPrevious, currentIndex, totalItems }) => {
    // Effect to handle Escape and Arrow key presses
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'ArrowRight' && currentIndex < totalItems - 1) {
                onNext();
            } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
                onPrevious();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onNext, onPrevious, currentIndex, totalItems]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `ai-generated-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Stop propagation to prevent closing when clicking on the image/buttons
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col gap-4 group" onClick={stopPropagation}>
                {/* Previous Button */}
                {totalItems > 1 && (
                    <button
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                        className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-slate-800/50 hover:bg-slate-700/80 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                )}
                
                <img 
                    src={src} 
                    alt="Generated result in lightbox" 
                    className="object-contain w-full h-full rounded-lg shadow-2xl"
                />

                {/* Next Button */}
                {totalItems > 1 && (
                    <button
                        onClick={onNext}
                        disabled={currentIndex >= totalItems - 1}
                        className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-slate-800/50 hover:bg-slate-700/80 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}

                 <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm"
                        aria-label="Close lightbox"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;