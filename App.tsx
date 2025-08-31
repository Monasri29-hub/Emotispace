
import React, { useState, useCallback } from 'react';
import { Personality, Mood, Room, DesignReport } from './types';
import { getDesignIdeas, generateImage } from './services/geminiService';
import Selector from './components/Selector';
import ResultCard from './components/ResultCard';
import SparklesIcon from './components/icons/SparklesIcon';

const personalityOptions: Personality[] = ['Introvert', 'Extrovert', 'Balanced'];
const moodOptions: Mood[] = ['Calm', 'Energetic', 'Focused', 'Creative'];
const roomOptions: Room[] = ['Bedroom', 'Study Room', 'Living Room'];

interface AppResult {
    report: DesignReport;
    imageUrl: string;
}

const moodColors: Record<Mood, { shape1: string; shape2: string; shape3: string }> = {
    Calm: { shape1: '#6dd5ed', shape2: '#2193b0', shape3: '#f0f9ff' },
    Energetic: { shape1: '#ff9a9e', shape2: '#fecfef', shape3: '#ffdde1' },
    Focused: { shape1: '#ccdbfd', shape2: '#a1c4fd', shape3: '#e2ebf0' },
    Creative: { shape1: '#c3aed6', shape2: '#a8edea', shape3: '#fed6e3' },
};

const App: React.FC = () => {
  const [personality, setPersonality] = useState<Personality>('Introvert');
  const [mood, setMood] = useState<Mood>('Calm');
  const [room, setRoom] = useState<Room>('Bedroom');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AppResult | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setLoadingMessage('Analyzing your style...');
      const designReport = await getDesignIdeas(personality, mood, room);
      
      setLoadingMessage('Rendering your visualization...');
      const imageUrl = await generateImage(designReport.visual_prompt);

      setResult({ report: designReport, imageUrl });

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [personality, mood, room]);

  const currentColors = moodColors[mood];

  return (
    <div 
        className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
        style={{
            '--shape-1-color': currentColors.shape1,
            '--shape-2-color': currentColors.shape2,
            '--shape-3-color': currentColors.shape3,
        } as React.CSSProperties}
    >
      <div aria-hidden="true" className="background-visuals">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
      </div>
      <style>{`
        .background-visuals {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 9999px;
          opacity: 0.3;
          filter: blur(120px);
          transition: background-color 1.5s ease-in-out;
        }

        .shape-1 {
          width: 45rem;
          height: 45rem;
          top: -10rem;
          left: -20rem;
          background-color: var(--shape-1-color);
          animation: animate-shape-1 25s infinite alternate ease-in-out;
        }

        .shape-2 {
          width: 40rem;
          height: 40rem;
          bottom: -5rem;
          right: -15rem;
          background-color: var(--shape-2-color);
          animation: animate-shape-2 30s infinite alternate ease-in-out;
        }
        
        .shape-3 {
          width: 30rem;
          height: 30rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: var(--shape-3-color);
          animation: animate-shape-3 20s infinite alternate ease-in-out;
        }
        
        @keyframes animate-shape-1 {
          from { transform: translate(0, 0) rotate(0deg) scale(1); }
          to { transform: translate(10rem, 5rem) rotate(45deg) scale(1.1); }
        }

        @keyframes animate-shape-2 {
          from { transform: translate(0, 0) rotate(0deg) scale(1); }
          to { transform: translate(-10rem, -5rem) rotate(-30deg) scale(1.2); }
        }

        @keyframes animate-shape-3 {
            from { transform: translate(-50%, -50%) scale(1); }
            to { transform: translate(-40%, -60%) scale(1.3); }
        }
      
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>

      <header className="text-center mb-8 animate-fade-in-up relative z-10">
        <div className="flex items-center justify-center gap-2">
            <SparklesIcon className="w-8 h-8 text-sky-500"/>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">EmotiSpace</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600 max-w-2xl">
          Design and visualize your perfect room based on your personality and mood.
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-md border border-slate-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Selector id="personality" label="Your Personality" value={personality} options={personalityOptions} onChange={(value) => setPersonality(value)} />
            <Selector id="mood" label="Desired Mood" value={mood} options={moodOptions} onChange={(value) => setMood(value)} />
            <Selector id="room" label="Room Type" value={room} options={roomOptions} onChange={(value) => setRoom(value)} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingMessage || 'Generating...'}
              </>
            ) : (
                <>
                    <SparklesIcon className="w-5 h-5" />
                    Generate & Visualize
                </>
            )}
          </button>
        </form>

        <div className="mt-10 w-full">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fade-in-up" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {result && <ResultCard suggestion={result.report} imageUrl={result.imageUrl} />}
            
            {!loading && !result && !error && (
                <div className="text-center text-slate-500 p-8 bg-white/50 rounded-lg animate-fade-in-up">
                    <p>Your personalized design visualization will appear here.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;