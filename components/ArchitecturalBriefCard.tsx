import React from 'react';
import { ArchitecturalBrief, KeyFeature } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import ShieldIcon from './icons/ShieldIcon';
import InterlockIcon from './icons/InterlockIcon';
import ChecklistIcon from './icons/ChecklistIcon';
import LayoutIcon from './icons/LayoutIcon';

interface ArchitecturalBriefCardProps {
  brief: ArchitecturalBrief;
  imageUrl: string;
  floorPlanUrl: string;
}

const InfoBlock: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-lg">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <div className="text-slate-600 mt-2">{children}</div>
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ feature: KeyFeature }> = ({ feature }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 transition-shadow hover:shadow-md">
    <h4 className="font-bold text-lg text-sky-700">{feature.feature_name}</h4>
    <div className="mt-3 space-y-3 text-sm">
      <p><strong className="font-semibold text-slate-600">Emotional Rationale:</strong> {feature.emotional_rationale}</p>
      <p><strong className="font-semibold text-slate-600">Resilience Rationale:</strong> {feature.resilience_rationale}</p>
      <div className="p-2.5 bg-sky-50 rounded-md border border-sky-100">
        <p><strong className="font-semibold text-sky-800">Synthesis:</strong> {feature.dual_purpose_synthesis}</p>
      </div>
    </div>
  </div>
);

const ArchitecturalBriefCard: React.FC<ArchitecturalBriefCardProps> = ({ brief, imageUrl, floorPlanUrl }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg w-full animate-fade-in-up overflow-hidden border border-slate-200">
      <div className="p-4 bg-slate-50/50">
        <img
          src={imageUrl}
          alt="AI generated architectural concept"
          className="w-full h-auto max-h-[480px] object-cover rounded-lg shadow-md"
        />
        <div className="mt-4 flex justify-end">
          <a
            href={imageUrl}
            download="emotispace-architecture.png"
            className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            aria-label="Download generated image"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Exterior
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 text-center tracking-tight">Architectural Concept</h2>
        <p className="text-center text-slate-600 mb-8 font-semibold">{brief.conceptual_headline}</p>

        <div className="space-y-8">
          <InfoBlock icon={<BrainCircuitIcon className="w-6 h-6" />} title="Emotion Deconstruction">
            <ul className="list-disc list-inside space-y-1">
              {brief.emotion_deconstruction.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </InfoBlock>

          <InfoBlock icon={<ShieldIcon className="w-6 h-6" />} title="Regional Hazards">
            <ul className="list-disc list-inside space-y-1">
              {brief.regional_hazards.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </InfoBlock>

          <InfoBlock icon={<InterlockIcon className="w-6 h-6" />} title="Design Synthesis">
            <p>{brief.design_synthesis_statement}</p>
          </InfoBlock>

          <div className="p-5 bg-sky-50/30 border border-sky-200 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-sky-100 text-sky-600 rounded-full">
                <ChecklistIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Key Features & Rationale</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brief.key_features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-lg">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full">
                    <LayoutIcon className="w-6 h-6" />
                </div>
                <div className="w-full">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Conceptual Floor Plan</h3>
                    <img
                        src={floorPlanUrl}
                        alt="AI generated conceptual floor plan"
                        className="w-full h-auto object-contain rounded-lg shadow-md bg-white p-2 border"
                    />
                    <div className="mt-4 flex justify-end">
                        <a
                            href={floorPlanUrl}
                            download="emotispace-floorplan.png"
                            className="inline-flex items-center gap-2 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                            aria-label="Download generated floor plan"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Download Floor Plan
                        </a>
                    </div>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ArchitecturalBriefCard;