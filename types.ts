export type Personality = 'Introvert' | 'Extrovert' | 'Balanced' | 'Ambivert';
export type Mood = 'Calm' | 'Energetic' | 'Focused' | 'Creative';
export type Room = 'Bedroom' | 'Study Room' | 'Living Room' | 'Kitchen' | 'Dining Room' | 'Bathroom' | 'Balcony';

export interface InsightReport {
  headline: string;
  analysis: string[];
}

export interface ImplementationStep {
  step: string;
  effort: 'Low' | 'Medium' | 'High';
  estimated_days: number;
}

export interface DesignReport {
  insight_report: InsightReport;
  emotional_story: string;
  implementation_steps: ImplementationStep[];
  visual_prompt: string;
}