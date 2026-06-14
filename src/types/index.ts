export interface ResumeAnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: { found: string[]; missing: string[] };
}

export interface ATSScoreResult {
  overall: number;
  formatting: number;
  keywords: number;
  readability: number;
  suggestions: string[];
}

export interface InterviewQuestion {
  id: string;
  category: "technical" | "behavioral" | "hr";
  question: string;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
}

export interface SkillGapItem {
  skill: string;
  required: boolean;
  currentLevel: number;
  targetLevel: number;
  priority: "high" | "medium" | "low";
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "in-progress" | "upcoming";
  tasks: string[];
}
