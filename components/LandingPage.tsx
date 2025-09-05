import React from 'react';
import { AppMode } from '../App';
import Logo from './Logo';
import ShieldIcon from './icons/ShieldIcon';
import PaletteIcon from './icons/PaletteIcon';

interface LandingPageProps {
  onSelectMode: (mode: AppMode) => void;
  onNavigateAbout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode, onNavigateAbout }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center w-full animate-fade-in-up">
      <div className="mb-6">
        <Logo className="w-24 h-24 text-sky-500" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 tracking-tight">
        Welcome to EmotiSpace
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl">
        Design with Emotion. Build with Resilience.
        <br />
        Create spaces that feel right and stand strong.
      </p>

      <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interior Design Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-slate-200 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 text-sky-600 mb-4">
                <PaletteIcon className="w-8 h-8"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Interior Design</h2>
            <p className="mt-2 text-slate-600 flex-grow">
                Craft personalized room designs based on your unique personality traits and desired mood. Get a complete report with visuals, insights, and actionable steps.
            </p>
            <button
                onClick={() => onSelectMode('interior')}
                className="mt-6 w-full bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            >
                Design Your Space
            </button>
        </div>

        {/* Architectural Concept Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-slate-200 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mb-4">
                <ShieldIcon className="w-8 h-8"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Architectural Concept</h2>
            <p className="mt-2 text-slate-600 flex-grow">
                Generate visionary architectural concepts for resilient homes. Synthesize a core human emotion with climate-aware design for a specific location.
            </p>
            <button
                onClick={() => onSelectMode('architecture')}
                className="mt-6 w-full bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
            >
                Create a Concept
            </button>
        </div>
      </div>
      <div className="mt-12">
        <button onClick={onNavigateAbout} className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
            Learn more about EmotiSpace &rarr;
        </button>
      </div>
    </div>
  );
};

export default LandingPage;