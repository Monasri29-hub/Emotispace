import React from 'react';
import Logo from './Logo';
import PaletteIcon from './icons/PaletteIcon';
import ShieldIcon from './icons/ShieldIcon';
import InterlockIcon from './icons/InterlockIcon';

interface AboutPageProps {
  onNavigateHome: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200/80">
        <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600">{children}</p>
    </div>
);


const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in-up">
      <header className="text-center mb-10">
        <Logo className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
          About EmotiSpace
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Our mission is to create a new paradigm for design where human emotion and environmental resilience are not just compatible, but deeply intertwined.
        </p>
      </header>

      <main className="w-full space-y-12">
        <section>
            <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">Our AI Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard icon={<PaletteIcon className="w-7 h-7" />} title="Psychology-Driven Interior Design">
                    Our AI goes beyond aesthetics. It uses the "Big Five" personality model to understand your unique psychological profile, crafting interior spaces that resonate with your core traits—whether you're a highly open and creative individual needing an inspiring studio, or a conscientious introvert seeking a calm, organized sanctuary.
                </FeatureCard>
                <FeatureCard icon={<ShieldIcon className="w-7 h-7" />} title="Resilient Architectural Concepts">
                    We generate visionary concepts for homes that are as strong as they are soulful. By taking a core human emotion and a specific geographic location, our AI designs structures engineered to withstand regional climate challenges—from hurricanes in Florida to heatwaves in Hyderabad—without compromising on emotional comfort.
                </FeatureCard>
            </div>
        </section>

        <section className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 border border-slate-200">
             <div className="text-center mb-6">
                 <div className="inline-block p-3 rounded-full bg-sky-100 text-sky-600">
                    <InterlockIcon className="w-8 h-8" />
                 </div>
                <h2 className="text-2xl font-bold text-slate-700 mt-3">Our Core Philosophy: Resilient Emotional Architecture</h2>
                <p className="mt-2 text-slate-600 max-w-3xl mx-auto">This is the synthesis at the heart of EmotiSpace. It’s a design approach where practical resilience and emotional well-being are one and the same.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                    <h4 className="font-bold text-slate-800">1. Emotion as the Blueprint</h4>
                    <p className="text-sm text-slate-600 mt-1">We start with feeling. A desire for "Safety" isn't just a feature; it's the core brief. This translates into architectural forms—enveloping rooflines, a protected courtyard, a solid plinth—that make you feel secure.
                    </p>
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-slate-800">2. Resilience as the Foundation</h4>
                    <p className="text-sm text-slate-600 mt-1">The environmental challenges of a location are not problems to be solved, but parameters to inform the design. Thick, insulating walls aren't just for heatwaves; they create a quiet, serene interior. A rainwater harvesting system isn't just for water scarcity; it becomes a calming water feature.</p>
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-slate-800">3. Synthesis in Action</h4>
                    <p className="text-sm text-slate-600 mt-1">The magic happens when a single design choice serves both purposes. A deep, shaded veranda offers refuge from the sun (resilience) while creating a perfect, tranquil space for contemplation (emotion). This dual-purpose design is our ultimate goal.</p>
                </div>
             </div>
        </section>

        <footer className="text-center mt-12">
            <button
                onClick={onNavigateHome}
                className="bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            >
                Return to Home
            </button>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;
