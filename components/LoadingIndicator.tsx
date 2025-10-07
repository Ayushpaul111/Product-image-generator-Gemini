import React, { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
    hasStyleImage: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ hasStyleImage }) => {
    const baseSteps = [
        'Formatting images',
        'Generating prompt',
        'Creating image...'
    ];

    const allSteps = hasStyleImage ? ['Formatting images', 'Analyzing style', 'Generating prompt', 'Creating image...'] : baseSteps;
    
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < allSteps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [currentStep, allSteps.length]);

    const getStepStatus = (index: number) => {
        if (index < currentStep) return 'completed';
        if (index === currentStep) return 'active';
        return 'pending';
    };

    const StatusIndicator: React.FC<{ status: 'completed' | 'active' | 'pending' }> = ({ status }) => {
        const baseClasses = 'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 relative';

        switch (status) {
            case 'completed':
                return (
                    <div className={`${baseClasses} bg-cyan-600`}>
                        <svg className="w-3.5 h-3.5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'active':
                return (
                    <div className={`${baseClasses} bg-slate-800`}>
                        <div className="absolute w-full h-full rounded-full bg-cyan-500 animate-ping-slow opacity-60"></div>
                        <div className="relative w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                    </div>
                );
            case 'pending':
            default:
                return <div className={`${baseClasses} bg-slate-700`}></div>;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-slate-400 p-4 w-full">
            <div className="relative">
                {/* Vertical line connecting the steps */}
                <div 
                    className="absolute left-3 top-0 w-0.5 h-full bg-slate-800"
                    aria-hidden="true"
                />

                <div className="relative flex flex-col items-start gap-8">
                    {allSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm z-10">
                            <StatusIndicator status={getStepStatus(index)} />
                            <span className={`transition-colors duration-500 font-medium ${getStepStatus(index) === 'pending' ? 'text-slate-500' : 'text-slate-300'}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
             <p className="text-xs text-slate-500 mt-10">This may take a moment, please wait.</p>
        </div>
    );
};

export default LoadingIndicator;