export interface BigFiveTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export type Mood = 'Calm' | 'Energetic' | 'Focused' | 'Creative';
export type Room = 'Bedroom' | 'Study Room' | 'Living Room' | 'Kitchen' | 'Dining Room' | 'Bathroom' | 'Balcony';
export type Style = 'Modern' | 'Indian' | 'Western';
export type Budget = 'Economical' | 'Mid-Range' | 'Premium' | 'Luxury';

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
  estimated_budget: string;
}

// Types for Architectural Concept
export interface KeyFeature {
  feature_name: string;
  emotional_rationale: string;
  resilience_rationale: string;
  dual_purpose_synthesis: string;
}

export interface ArchitecturalBrief {
  conceptual_headline: string;
  emotion_deconstruction: string[];
  regional_hazards: string[];
  design_synthesis_statement: string;
  key_features: KeyFeature[];
  visual_prompt: string;
  floor_plan_prompt: string;
}