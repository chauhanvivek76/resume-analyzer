import {
  BarChart3,
  Brain,
  FileSearch,
  LayoutDashboard,
  Map,
  MessageSquare,
  Target,
} from "lucide-react";

export const APP_NAME = "PlacementAI";

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
] as const;

export const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & insights",
  },
  {
    href: "/resume-analyzer",
    label: "Resume Analyzer",
    icon: FileSearch,
    description: "Parse & improve resume",
  },
  {
    href: "/ats-score",
    label: "ATS Score",
    icon: Target,
    description: "Applicant tracking fit",
  },
  {
    href: "/interview-questions",
    label: "Interview Prep",
    icon: MessageSquare,
    description: "Role-specific Q&A",
  },
  {
    href: "/skill-gap",
    label: "Skill Gap",
    icon: BarChart3,
    description: "Identify missing skills",
  },
  {
    href: "/career-roadmap",
    label: "Career Roadmap",
    icon: Map,
    description: "AI learning path",
  },
] as const;

export const FEATURES = [
  {
    title: "Resume Analyzer",
    description:
      "Upload your resume and get instant AI-powered feedback on structure, keywords, and impact.",
    icon: FileSearch,
    href: "/resume-analyzer",
  },
  {
    title: "ATS Score Checker",
    description:
      "See how well your resume passes Applicant Tracking Systems for your target role.",
    icon: Target,
    href: "/ats-score",
  },
  {
    title: "Interview Questions",
    description:
      "Practice with AI-generated technical and behavioral questions tailored to your role.",
    icon: MessageSquare,
    href: "/interview-questions",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Compare your skills against job requirements and discover what to learn next.",
    icon: BarChart3,
    href: "/skill-gap",
  },
  {
    title: "Career Roadmap",
    description:
      "Get a personalized step-by-step roadmap to land your dream placement.",
    icon: Map,
    href: "/career-roadmap",
  },
  {
    title: "AI Career Coach",
    description:
      "Smart recommendations powered by AI to accelerate your placement journey.",
    icon: Brain,
    href: "/dashboard",
  },
] as const;

export const STATS = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "92%", label: "Interview Success Rate" },
  { value: "200+", label: "Companies Covered" },
  { value: "4.9/5", label: "User Rating" },
] as const;
