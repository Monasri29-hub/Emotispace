
import React from 'react';
import { DesignReport } from '../types';
import DescriptionIcon from './icons/DescriptionIcon';
import InsightIcon from './icons/InsightIcon';
import ChecklistIcon from './icons/ChecklistIcon';
import DownloadIcon from './icons/DownloadIcon';
import DollarSignIcon from './icons/DollarSignIcon';

interface ResultCardProps {
  suggestion: DesignReport;
  imageUrl: string;
}

const getEffortClass = (effort: 'Low' | 'Medium' | 'High') => {
    switch (effort) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const ResultCard: React.FC<ResultCardProps> = ({ suggestion, imageUrl }) => {

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg w-full animate-fade-in-up overflow-hidden border border-slate-200">
      
      <div className="p-4 bg-slate-50/50">
        <img 
            src={imageUrl} 
            alt="AI generated room design" 
            className="w-full h-auto max-h-[480px] object-cover rounded-lg shadow-md"
        />
        <div className="mt-4 flex justify-end">
          <a
            href={imageUrl}
            download="emotispace-design.png"
            className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200"
            aria-label="Download generated image"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Image
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center tracking-tight">Your EmotiSpace Design Report</h2>
        
        <div className="space-y-8">

          {/* Insight Report */}
          <div className="p-5 bg-sky-50/50 border border-sky-200 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-sky-100 text-sky-600 rounded-full">
                <InsightIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Insight Report</h3>
                <p className="text-slate-600 mt-2 font-semibold">{suggestion.insight_report.headline}</p>
                <ul className="mt-3 list-disc list-inside space-y-1 text-slate-600">
                    {suggestion.insight_report.analysis.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Estimated Budget */}
          <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full">
                <DollarSignIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Estimated Budget</h3>
                <p className="text-slate-600 mt-2 text-lg font-semibold">{suggestion.estimated_budget}</p>
              </div>
            </div>
          </div>

          {/* Emotional Design Story */}
          <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full">
                <DescriptionIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Emotional Design Story</h3>
                <p className="text-slate-600 mt-2">{suggestion.emotional_story}</p>
              </div>
            </div>
          </div>

          {/* Implementation Checklist */}
          <div className="p-5 bg-green-50/30 border border-green-200 rounded-lg">
             <div className="flex items-start space-x-4">
               <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                <ChecklistIcon className="w-6 h-6" />
              </div>
               <div>
                <h3 className="text-xl font-bold text-slate-800">Implementation Checklist</h3>
                <div className="mt-4 space-y-3">
                    {suggestion.implementation_steps.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-md border">
                            <p className="text-slate-700 flex-1">{item.step}</p>
                            <div className="flex items-center gap-3 mt-2 sm:mt-0">
                               <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getEffortClass(item.effort)}`}>
                                   {item.effort} Effort
                                </span>
                                <span className="text-xs font-medium text-slate-500">
                                    ~{item.estimated_days} day{item.estimated_days !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultCard;