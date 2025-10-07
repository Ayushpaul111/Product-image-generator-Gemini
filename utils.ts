import type { AspectRatio } from './types';

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove "data:*/*;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const formatImageToAspectRatio = (
    file: File,
    targetAspectRatio: AspectRatio
): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (readerEvent) => {
            if (!readerEvent.target?.result) {
                return reject(new Error("Could not read file."));
            }

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                // 1. Determine canvas dimensions from target aspect ratio
                const [widthRatio, heightRatio] = targetAspectRatio.split(':').map(Number);
                const numericTargetAspectRatio = widthRatio / heightRatio;

                const MAX_DIMENSION = 1024;
                let canvasWidth, canvasHeight;

                if (numericTargetAspectRatio >= 1) { // Landscape or square
                    canvasWidth = MAX_DIMENSION;
                    canvasHeight = Math.round(MAX_DIMENSION / numericTargetAspectRatio);
                } else { // Portrait
                    canvasHeight = MAX_DIMENSION;
                    canvasWidth = Math.round(MAX_DIMENSION * numericTargetAspectRatio);
                }

                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                // 2. Calculate the optimal dimensions to draw the image without cropping
                // This is the "contain" logic for fitting an image within a box.
                const scaleX = canvasWidth / img.width;
                const scaleY = canvasHeight / img.height;
                const scale = Math.min(scaleX, scaleY);

                const drawWidth = img.width * scale;
                const drawHeight = img.height * scale;

                // 3. Calculate the position to center the image on the canvas
                const x = (canvasWidth - drawWidth) / 2;
                const y = (canvasHeight - drawHeight) / 2;

                // 4. Draw the scaled and centered image onto the canvas
                ctx.drawImage(img, x, y, drawWidth, drawHeight);

                // 5. Export the final canvas to a base64 string
                const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(mimeType, 0.95);
                const base64 = dataUrl.split(',')[1];
                
                resolve({ base64, mimeType });
            };
            img.onerror = (error) => reject(error);
            img.src = readerEvent.target.result as string;
        };
        reader.onerror = (error) => reject(error);
    });
};
