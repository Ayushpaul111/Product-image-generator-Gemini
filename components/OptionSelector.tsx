import React from 'react';
import type { Option } from '../types';

interface OptionSelectorProps<T extends string> {
    label: string;
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
}

const OptionSelector = <T extends string,>({
    label,
    value,
    options,
    onChange,
}: OptionSelectorProps<T>): React.ReactElement => {
    return (
        <div>
            <label htmlFor={label} className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            <select
                id={label}
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md pl-2 pr-8 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OptionSelector;
