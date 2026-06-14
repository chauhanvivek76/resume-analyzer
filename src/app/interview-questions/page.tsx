"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { InterviewQuestion } from "@/types";

const MOCK_QUESTIONS: InterviewQuestion[] = [
  {
    id: "1",
    category: "technical",
    question: "Explain the difference between let, const, and var in JavaScript.",
    difficulty: "easy",
    hint: "Focus on scope, hoisting, and reassignment rules.",
  },
  {
    id: "2",
    category: "technical",
    question:
      "How would you optimize the performance of a React application?",
    difficulty: "medium",
    hint: "Mention memoization, code splitting, lazy loading, and virtualization.",
  },
  {
    id: "3",
    category: "behavioral",
    question: "Tell me about a time you faced a conflict in a team project.",
    difficulty: "medium",
    hint: "Use the STAR method: Situation, Task, Action, Result.",
  },
  {
    id: "4",
    category: "technical",
    question: "Design a URL shortening service like bit.ly.",
    difficulty: "hard",
    hint: "Cover hashing, database schema, caching, and scalability.",
  },
  {
    id: "5",
    category: "hr",
    question: "Why do you want to join our company?",
    difficulty: "easy",
    hint: "Research the company and align your goals with their mission.",
  },
  {
    id: "6",
    category: "behavioral",
    question: "Describe a project where you had to learn a new technology quickly.",
    difficulty: "medium",
    hint: "Highlight your learning approach and the outcome achieved.",
  },
];

const CATEGORY_LABELS = {
  technical: "Technical",
  behavioral: "Behavioral",
  hr: "HR",
} as const;

const DIFFICULTY_VARIANT = {
  easy: "success" as const,
  medium: "warning" as const,
  hard: "danger" as const,
};

export default function InterviewQuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(MOCK_QUESTIONS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | InterviewQuestion["category"]>("all");
  const [loading, setLoading] = useState(false);

  const filtered =
    filter === "all" ? questions : questions.filter((q) => q.category === filter);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setQuestions([...MOCK_QUESTIONS].sort(() => Math.random() - 0.5));
      setLoading(false);
    }, 1200);
  };

  return (
    <DashboardShell
      title="Interview Questions"
      description="Practice with AI-generated questions tailored to your target role."
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Target Role" placeholder="Software Engineer" />
              <Input label="Company" placeholder="Google" />
              <Input label="Experience Level" placeholder="Fresher / 2 years" />
            </div>
            <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Generate Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {(["all", "technical", "behavioral", "hr"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((q, index) => (
            <Card key={q.id}>
              <CardContent className="p-0">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 p-6 text-left"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                >
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-400">
                      {index + 1}
                    </span>
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="info">{CATEGORY_LABELS[q.category]}</Badge>
                        <Badge variant={DIFFICULTY_VARIANT[q.difficulty]}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <p className="font-medium text-white">{q.question}</p>
                    </div>
                  </div>
                  {expandedId === q.id ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
                  )}
                </button>

                {expandedId === q.id && q.hint && (
                  <div className="border-t border-slate-800 px-6 py-4">
                    <div className="flex gap-3 rounded-lg bg-amber-500/5 border border-amber-500/20 p-4">
                      <Lightbulb className="h-5 w-5 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-amber-400">Hint</p>
                        <p className="mt-1 text-sm text-slate-300">{q.hint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-slate-700" />
            <p className="mt-4 text-slate-500">No questions in this category</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
