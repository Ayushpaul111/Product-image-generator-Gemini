import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
    id: string;
    title: string;
    onImageUpload: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageUpload(file);
        } else {
            setPreview(null);
            onImageUpload(null);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
             <h3 className="text-sm font-semibold text-slate-400 mb-2">{title}</h3>
            <div className="relative w-full h-36 bg-slate-800 rounded-md flex items-center justify-center border border-dashed border-slate-700 hover:border-cyan-600 transition-colors">
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="object-contain h-full w-full rounded-md p-1" />
                        <button 
                            onClick={handleRemove}
                            className="absolute top-1 right-1 bg-slate-900/60 hover:bg-red-500/80 text-white rounded-full p-1 transition-colors"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </>
                ) : (
                    <label htmlFor={id} className="cursor-pointer text-center text-slate-500 hover:text-slate-400 transition-colors p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span className="mt-1 block text-xs font-medium">Click to upload</span>
                    </label>
                )}
                <input ref={fileInputRef} id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
            </div>
        </div>
    );
};

export default ImageUploader;
