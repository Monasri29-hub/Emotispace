import React from 'react';

interface PersonalitySliderProps {
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
}

const PersonalitySlider: React.FC<PersonalitySliderProps> = ({ label, description, lowLabel, highLabel, value, onChange }) => {
  const percentage = `${value}%`;

  return (
    <div className="flex flex-col">
        <div className="flex justify-between items-baseline">
            <label className="font-semibold text-slate-700">{label}</label>
            <span className="font-bold text-sky-600 text-sm">{value}</span>
        </div>
      <p className="text-xs text-slate-500 mb-2">{description}</p>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider"
        style={{ '--percentage': percentage } as React.CSSProperties}
        aria-label={`${label} slider`}
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span className="w-1/2 text-left pr-2">{lowLabel}</span>
        <span className="w-1/2 text-right pl-2">{highLabel}</span>
      </div>
    </div>
  );
};

export default PersonalitySlider;
