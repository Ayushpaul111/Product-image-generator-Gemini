import React from 'react';

interface HistoryProps {
    items: string[];
    onImageSelect: (index: number) => void;
    onImageDelete: (index: number) => void;
}

const History: React.FC<HistoryProps> = ({ items, onImageSelect, onImageDelete }) => {
    if (items.length === 0) {
        return null;
    }
    
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-full">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">
                History
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                {items.map((src, index) => (
                    <div 
                        key={index} 
                        className="relative aspect-square bg-slate-800 rounded-md overflow-hidden cursor-pointer group border-2 border-transparent hover:border-cyan-600 transition-colors"
                        onClick={() => onImageSelect(index)}
                    >
                        <img 
                            src={src} 
                            alt={`Generated history item ${index + 1}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageDelete(index);
                            }}
                            className="absolute top-1 right-1 bg-slate-900/60 hover:bg-red-500/80 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Delete image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;