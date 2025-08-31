
import React from 'react';

interface SelectorProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}

const Selector = <T extends string,>({ id, label, value, options, onChange }: SelectorProps<T>) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-2 text-sm font-medium text-slate-600">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
