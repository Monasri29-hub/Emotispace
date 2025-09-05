import React, { useState, useCallback } from 'react';
import { BigFiveTraits, Mood, Room, DesignReport, Style, Budget, ArchitecturalBrief } from './types';
import { getDesignIdeas, generateImage, getArchitecturalConcept } from './services/geminiService';
import Selector from './components/Selector';
import ResultCard from './components/ResultCard';
import SparklesIcon from './components/icons/SparklesIcon';
import PersonalitySlider from './components/PersonalitySlider';
import ArchitecturalBriefCard from './components/ArchitecturalBriefCard';
import LandingPage from './components/LandingPage';
import Logo from './components/Logo';
import AboutPage from './components/AboutPage';
import InfoIcon from './components/icons/InfoIcon';

const moodOptions: Mood[] = ['Calm', 'Energetic', 'Focused', 'Creative'];
const roomOptions: Room[] = ['Bedroom', 'Study Room', 'Living Room', 'Kitchen', 'Dining Room', 'Bathroom', 'Balcony'];
const styleOptions: Style[] = ['Modern', 'Indian', 'Western'];
const budgetOptions: Budget[] = ['Economical', 'Mid-Range', 'Premium', 'Luxury'];
const emotionOptions: string[] = ['Creativity', 'Serenity', 'Joy', 'Safety', 'Connection'];

export type AppMode = 'interior' | 'architecture';
type AppView = 'landing' | 'app' | 'about';

interface InteriorResult {
    report: DesignReport;
    imageUrl: string;
}

interface ArchitectureResult {
    brief: ArchitecturalBrief;
    imageUrl: string;
    floorPlanUrl: string;
}

const moodColors: Record<Mood, { shape1: string; shape2: string; shape3: string }> = {
    Calm: { shape1: '#6dd5ed', shape2: '#2193b0', shape3: '#f0f9ff' },
    Energetic: { shape1: '#ff9a9e', shape2: '#fecfef', shape3: '#ffdde1' },
    Focused: { shape1: '#ccdbfd', shape2: '#a1c4fd', shape3: '#e2ebf0' },
    Creative: { shape1: '#c3aed6', shape2: '#a8edea', shape3: '#fed6e3' },
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [mode, setMode] = useState<AppMode>('interior');

  // Interior Design State
  const [bigFive, setBigFive] = useState<BigFiveTraits>({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  });
  const [mood, setMood] = useState<Mood>('Calm');
  const [room, setRoom] = useState<Room>('Bedroom');
  const [style, setStyle] = useState<Style>('Modern');
  const [budget, setBudget] = useState<Budget>('Mid-Range');
  const [architecturalFeatures, setArchitecturalFeatures] = useState<string>('');
  
  // Architectural Concept State
  const [coreEmotion, setCoreEmotion] = useState<string>('Creativity');
  const [location, setLocation] = useState<string>('Hyderabad, Telangana, India');

  // General State
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [interiorResult, setInteriorResult] = useState<InteriorResult | null>(null);
  const [architectureResult, setArchitectureResult] = useState<ArchitectureResult | null>(null);

  const handleSelectMode = (selectedMode: AppMode) => {
    setMode(selectedMode);
    setView('app');
    setError(null);
    setInteriorResult(null);
    setArchitectureResult(null);
  };

  const handleBigFiveChange = (trait: keyof BigFiveTraits, value: number) => {
    setBigFive(prev => ({ ...prev, [trait]: value }));
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInteriorResult(null);
    setArchitectureResult(null);

    try {
        if (mode === 'interior') {
            setLoadingMessage('Analyzing your personality...');
            const designReport = await getDesignIdeas(bigFive, mood, room, style, architecturalFeatures, budget);
            
            setLoadingMessage('Rendering your visualization...');
            const imageUrl = await generateImage(designReport.visual_prompt, '16:9');

            setInteriorResult({ report: designReport, imageUrl });
        } else { // Architecture mode
            setLoadingMessage('Conceptualizing resilient architecture...');
            const brief = await getArchitecturalConcept(coreEmotion, location);
            
            setLoadingMessage('Visualizing the exterior...');
            const imageUrl = await generateImage(brief.visual_prompt, '16:9');

            setLoadingMessage('Generating the floor plan...');
            const floorPlanUrl = await generateImage(brief.floor_plan_prompt, '1:1');
            
            setArchitectureResult({ brief, imageUrl, floorPlanUrl });
        }

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
  }, [mode, bigFive, mood, room, style, architecturalFeatures, budget, coreEmotion, location]);

  const currentColors = moodColors[mood];

  const renderMainApp = () => (
    <>
      <header className="text-center mb-8 animate-fade-in-up relative z-10 w-full flex items-center justify-center">
         <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-2">
            <button onClick={() => setView('landing')} className="bg-white/60 hover:bg-white/90 p-2 rounded-full transition-all shadow-sm border border-slate-200/50" aria-label="Back to Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
             <button onClick={() => setView('about')} className="bg-white/60 hover:bg-white/90 p-2 rounded-full transition-all shadow-sm border border-slate-200/50" aria-label="About EmotiSpace">
                <InfoIcon className="w-5 h-5 text-slate-600" />
            </button>
         </div>
        <div className="flex flex-col items-center justify-center gap-3">
            <Logo className="w-16 h-16" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">EmotiSpace</h1>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center mb-6">
            <div className="bg-slate-200/80 backdrop-blur-sm p-1 rounded-lg flex gap-1 border border-slate-300/50">
                <button onClick={() => handleSelectMode('interior')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${mode === 'interior' ? 'bg-white shadow text-sky-600' : 'text-slate-600 hover:bg-slate-100/50'}`}>
                    Interior Design
                </button>
                <button onClick={() => handleSelectMode('architecture')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${mode === 'architecture' ? 'bg-white shadow text-sky-600' : 'text-slate-600 hover:bg-slate-100/50'}`}>
                    Architectural Concept
                </button>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-md border border-slate-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {mode === 'interior' ? (
            <div className="space-y-8">
                <div>
                <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Step 1: Describe Your Personality</h3>
                <p className="text-sm text-slate-600 mb-6">Adjust the sliders to reflect your traits on the "Big Five" personality model. This helps us create a space that truly feels like you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <PersonalitySlider label="Openness" description="Imagination, creativity, and curiosity." lowLabel="Practical, conventional" highLabel="Inventive, curious" value={bigFive.openness} onChange={(value) => handleBigFiveChange('openness', value)} />
                    <PersonalitySlider label="Conscientiousness" description="Organization, efficiency, and discipline." lowLabel="Spontaneous, flexible" highLabel="Organized, disciplined" value={bigFive.conscientiousness} onChange={(value) => handleBigFiveChange('conscientiousness', value)} />
                    <PersonalitySlider label="Extraversion" description="Sociability, energy, and assertiveness." lowLabel="Solitary, reserved" highLabel="Outgoing, energetic" value={bigFive.extraversion} onChange={(value) => handleBigFiveChange('extraversion', value)} />
                    <PersonalitySlider label="Agreeableness" description="Friendliness, compassion, and cooperation." lowLabel="Analytical, detached" highLabel="Friendly, compassionate" value={bigFive.agreeableness} onChange={(value) => handleBigFiveChange('agreeableness', value)} />
                    <PersonalitySlider label="Neuroticism" description="Tendency toward anxiety and stress." lowLabel="Calm, secure" highLabel="Sensitive, nervous" value={bigFive.neuroticism} onChange={(value) => handleBigFiveChange('neuroticism', value)} />
                </div>
                </div>
                <div>
                <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Step 2: Define Your Space</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <Selector id="mood" label="Desired Mood" value={mood} options={moodOptions} onChange={(value) => setMood(value)} />
                    <Selector id="room" label="Room Type" value={room} options={roomOptions} onChange={(value) => setRoom(value)} />
                    <Selector id="style" label="Design Style" value={style} options={styleOptions} onChange={(value) => setStyle(value)} />
                    <Selector id="budget" label="Budget Level" value={budget} options={budgetOptions} onChange={(value) => setBudget(value)} />
                </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Step 3: Add Details (Optional)</h3>
                    <div className="mt-6">
                        <label htmlFor="architectural-features" className="block mb-2 text-sm font-medium text-slate-600">Architectural Features & Dimensions</label>
                        <textarea id="architectural-features" value={architecturalFeatures} onChange={(e) => setArchitecturalFeatures(e.target.value)} placeholder="e.g., high ceilings, bay windows, 12x15 ft room, open-plan..." className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200" rows={2} aria-label="Architectural Features and Dimensions"/>
                    </div>
                </div>
            </div>
          ) : (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Define Your Concept</h3>
                    <p className="text-sm text-slate-600 mb-6">Provide a core emotion and a location to generate a resilient architectural concept that synthesizes feeling with function.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                         <Selector id="core-emotion" label="Core Emotion" value={coreEmotion} options={emotionOptions} onChange={(value) => setCoreEmotion(value)} />
                         <div>
                            <label htmlFor="location" className="block mb-2 text-sm font-medium text-slate-600">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Coastal Florida, USA"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                            />
                         </div>
                    </div>
                </div>
            </div>
          )}
          
          <div className="mt-8">
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
          </div>
        </form>

        <div className="mt-10 w-full">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fade-in-up" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {interiorResult && <ResultCard suggestion={interiorResult.report} imageUrl={interiorResult.imageUrl} />}
            {architectureResult && <ArchitecturalBriefCard brief={architectureResult.brief} imageUrl={architectureResult.imageUrl} floorPlanUrl={architectureResult.floorPlanUrl} />}
            
            {!loading && !interiorResult && !architectureResult && !error && (
                <div className="text-center text-slate-500 p-8 bg-white/50 rounded-lg animate-fade-in-up">
                    <p>Your personalized design visualization will appear here.</p>
                </div>
            )}
        </div>
      </main>
    </>
  );

  const renderContent = () => {
    switch (view) {
        case 'landing':
            return <LandingPage onSelectMode={handleSelectMode} onNavigateAbout={() => setView('about')} />;
        case 'about':
            return <AboutPage onNavigateHome={() => setView('landing')} />;
        case 'app':
        default:
            return renderMainApp();
    }
  };

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
        .background-visuals { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .shape { position: absolute; border-radius: 9999px; opacity: 0.3; filter: blur(120px); transition: background-color 1.5s ease-in-out; }
        .shape-1 { width: 45rem; height: 45rem; top: -10rem; left: -20rem; background-color: var(--shape-1-color); animation: animate-shape-1 25s infinite alternate ease-in-out; }
        .shape-2 { width: 40rem; height: 40rem; bottom: -5rem; right: -15rem; background-color: var(--shape-2-color); animation: animate-shape-2 30s infinite alternate ease-in-out; }
        .shape-3 { width: 30rem; height: 30rem; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: var(--shape-3-color); animation: animate-shape-3 20s infinite alternate ease-in-out; }
        @keyframes animate-shape-1 { from { transform: translate(0, 0) rotate(0deg) scale(1); } to { transform: translate(10rem, 5rem) rotate(45deg) scale(1.1); } }
        @keyframes animate-shape-2 { from { transform: translate(0, 0) rotate(0deg) scale(1); } to { transform: translate(-10rem, -5rem) rotate(-30deg) scale(1.2); } }
        @keyframes animate-shape-3 { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-40%, -60%) scale(1.3); } }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .range-slider { background: linear-gradient(to right, #0ea5e9 0%, #0ea5e9 var(--percentage), #d1d5db var(--percentage), #d1d5db 100%); transition: background 0.3s ease-in-out; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: white; border: 3px solid #0284c7; border-radius: 50%; cursor: pointer; margin-top: -7px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .range-slider::-moz-range-thumb { width: 16px; height: 16px; background: white; border: 3px solid #0284c7; border-radius: 50%; cursor: pointer; }
      `}</style>
      
      {renderContent()}
    </div>
  );
};

export default App;