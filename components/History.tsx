import React from 'react';

interface HistoryProps {
    items: string[];
    onImageSelect: (src: string) => void;
}

const History: React.FC<HistoryProps> = ({ items, onImageSelect }) => {
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
                        className="aspect-square bg-slate-800 rounded-md overflow-hidden cursor-pointer group border-2 border-transparent hover:border-cyan-600 transition-colors"
                        onClick={() => onImageSelect(src)}
                    >
                        <img 
                            src={src} 
                            alt={`Generated history item ${index + 1}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
