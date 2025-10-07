import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import Spinner from './components/Spinner';
import Lightbox from './components/Lightbox';
import History from './components/History';
import { generateDetailedPrompt, editImage } from './services/geminiService';
import { fileToBase64, formatImageToAspectRatio } from './utils';
import { ASPECT_RATIO_OPTIONS, LIGHTING_STYLE_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS } from './constants';
import type { AspectRatio, LightingStyle, CameraPerspective } from './types';

const App: React.FC = () => {
    const [productImage, setProductImage] = useState<File | null>(null);
    const [styleReferenceImage, setStyleReferenceImage] = useState<File | null>(null);
    
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [lightingStyle, setLightingStyle] = useState<LightingStyle>('Soft light');
    const [cameraPerspective, setCameraPerspective] = useState<CameraPerspective>('Eye-level');
    
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [refinePrompt, setRefinePrompt] = useState<string>('');

    const [history, setHistory] = useState<string[]>([]);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefining, setIsRefining] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        if (!productImage) {
            setError('Please upload a product image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            // Step 1: Format both images to the correct aspect ratio
            const { base64: productImageBase64, mimeType: productImageMimeType } = await formatImageToAspectRatio(productImage, aspectRatio);
            
            let styleImageBase64: string | undefined;
            let styleImageMimeType: string | undefined;
            if (styleReferenceImage) {
                const { base64, mimeType } = await formatImageToAspectRatio(styleReferenceImage, aspectRatio);
                styleImageBase64 = base64;
                styleImageMimeType = mimeType;
            }

            // Step 2: Generate the detailed prompt based on settings
            const prompt = await generateDetailedPrompt({
                aspectRatio,
                lightingStyle,
                cameraPerspective,
                styleImageBase64,
                styleImageMimeType,
            });
            setGeneratedPrompt(prompt);

            // Step 3: Generate the image using the new prompt and formatted images
            const imageB64 = await editImage({
                productImageBase64,
                productImageMimeType,
                prompt,
                styleImageBase64,
                styleImageMimeType,
            });
            const newImageSrc = `data:image/jpeg;base64,${imageB64}`;
            setGeneratedImage(newImageSrc);
            setHistory(prevHistory => [newImageSrc, ...prevHistory]);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during image generation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefineImage = async () => {
        if (!generatedImage || !refinePrompt) {
            setError('Cannot refine without a generated image and a refinement prompt.');
            return;
        }

        setIsRefining(true);
        setError(null);

        try {
            const lastImageBase64 = generatedImage.split(',')[1];
            
            const imageB64 = await editImage({
                productImageBase64: lastImageBase64,
                productImageMimeType: 'image/jpeg', // Assume previous generation was jpeg
                prompt: refinePrompt,
            });
            
            const newImageSrc = `data:image/jpeg;base64,${imageB64}`;
            setGeneratedImage(newImageSrc);
            setHistory(prevHistory => [newImageSrc, ...prevHistory]);
            setRefinePrompt(''); // Clear input after successful refinement
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during image refinement.');
        } finally {
            setIsRefining(false);
        }
    };
    
    const handleHistoryImageSelect = (src: string) => {
        setLightboxImage(src);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
            <header className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur-sm border-b border-slate-800">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <h1 className="text-xl font-semibold text-slate-100">
                        Huge <span className="text-cyan-400">Banana</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls Column */}
                    <aside className="lg:col-span-3 flex flex-col gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
                           <ImageUploader id="product-image" title="1. Product Photo" onImageUpload={setProductImage} />
                           <ImageUploader id="style-image" title="2. Style Reference" onImageUpload={setStyleReferenceImage} />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
                             <h3 className="text-sm font-semibold text-slate-400">3. Customization</h3>
                            <OptionSelector<AspectRatio> label="Aspect Ratio" value={aspectRatio} options={ASPECT_RATIO_OPTIONS} onChange={setAspectRatio} />
                            <OptionSelector<LightingStyle> label="Lighting Style" value={lightingStyle} options={LIGHTING_STYLE_OPTIONS} onChange={setLightingStyle} />
                            <OptionSelector<CameraPerspective> label="Camera Perspective" value={cameraPerspective} options={CAMERA_PERSPECTIVE_OPTIONS} onChange={setCameraPerspective} />
                        </div>
                         <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-400">4. Prompt</h3>
                            <textarea
                                value={generatedPrompt}
                                onChange={(e) => setGeneratedPrompt(e.target.value)}
                                placeholder="A detailed prompt will be generated here..."
                                className="w-full h-28 p-2 bg-slate-800 border border-slate-700 rounded-md focus:ring-1 focus:ring-cyan-500 focus:outline-none transition text-sm text-slate-300 resize-none"
                            />
                        </div>
                        <button
                            onClick={handleGenerateImage}
                            disabled={isLoading || !productImage}
                            className="w-full flex items-center justify-center gap-2 text-base font-semibold bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? ( <><Spinner className="w-5 h-5" /> Generating...</> ) 
                            : ( <> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> Generate Image </>)}
                        </button>
                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    </aside>

                    {/* Output Column */}
                    <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-4 min-h-[50vh] lg:min-h-0">
                        {isLoading && (
                            <div className="text-center text-slate-400">
                                <Spinner className="w-10 h-10 mx-auto mb-3 text-cyan-500"/>
                                <p className="text-base font-semibold">Generating your image...</p>
                                <p className="text-xs text-slate-500">This may take a moment.</p>
                            </div>
                        )}
                        {!isLoading && generatedImage && (
                             <div className="w-full h-full flex flex-col gap-4">
                                <div className="flex-grow relative flex items-center justify-center">
                                    <img 
                                        src={generatedImage} 
                                        alt="Generated result" 
                                        className="max-w-full max-h-full object-contain rounded-md cursor-pointer" 
                                        onClick={() => setLightboxImage(generatedImage)}
                                    />
                                </div>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={refinePrompt}
                                        onChange={(e) => setRefinePrompt(e.target.value)}
                                        placeholder="Refine the image (e.g., 'add a shadow')"
                                        className="w-full p-2 pr-20 bg-slate-800 border border-slate-700 rounded-md focus:ring-1 focus:ring-cyan-500 focus:outline-none transition text-sm"
                                    />
                                    <button 
                                        onClick={handleRefineImage}
                                        disabled={isRefining || !refinePrompt}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRefining ? <Spinner className="w-4 h-4" /> : 'Refine'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {!isLoading && !generatedImage && (
                            <div className="text-center text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                                <p className="mt-2 text-sm">Your generated image will appear here</p>
                            </div>
                        )}
                    </section>
                    
                    {/* History Column */}
                     <aside className="lg:col-span-3">
                         <History items={history} onImageSelect={handleHistoryImageSelect} />
                     </aside>
                </div>
            </main>

            {lightboxImage && (
                <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </div>
    );
};

export default App;
