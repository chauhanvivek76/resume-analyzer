"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Map,
  Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { RoadmapPhase } from "@/types";

const MOCK_ROADMAP: RoadmapPhase[] = [
  {
    id: "1",
    title: "Foundation & DSA",
    duration: "4 weeks",
    status: "completed",
    tasks: [
      "Complete arrays, strings, and linked lists",
      "Practice 50 easy LeetCode problems",
      "Learn time & space complexity analysis",
    ],
  },
  {
    id: "2",
    title: "Frontend Mastery",
    duration: "3 weeks",
    status: "in-progress",
    tasks: [
      "Build 2 projects with React & Next.js",
      "Learn state management (Redux/Zustand)",
      "Master CSS Grid, Flexbox, and Tailwind",
    ],
  },
  {
    id: "3",
    title: "Backend & Databases",
    duration: "3 weeks",
    status: "upcoming",
    tasks: [
      "Build REST APIs with Node.js & Express",
      "Learn SQL queries and database design",
      "Implement authentication with JWT",
    ],
  },
  {
    id: "4",
    title: "System Design Basics",
    duration: "2 weeks",
    status: "upcoming",
    tasks: [
      "Study scalability concepts (load balancing, caching)",
      "Design 3 classic system design problems",
      "Learn about microservices architecture",
    ],
  },
  {
    id: "5",
    title: "Interview Preparation",
    duration: "2 weeks",
    status: "upcoming",
    tasks: [
      "Mock interviews (technical + behavioral)",
      "Revise all projects for resume discussion",
      "Company-specific preparation",
    ],
  },
];

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    badge: "success" as const,
    label: "Completed",
    line: "bg-emerald-500",
  },
  "in-progress": {
    icon: Clock,
    badge: "warning" as const,
    label: "In Progress",
    line: "bg-violet-500",
  },
  upcoming: {
    icon: Circle,
    badge: "default" as const,
    label: "Upcoming",
    line: "bg-slate-700",
  },
};

export default function CareerRoadmapPage() {
  const [generated, setGenerated] = useState(true);
  const [loading, setLoading] = useState(false);

  const completed = MOCK_ROADMAP.filter((p) => p.status === "completed").length;
  const progress = Math.round((completed / MOCK_ROADMAP.length) * 100);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <DashboardShell
      title="AI Career Roadmap"
      description="Get a personalized step-by-step plan to land your dream placement."
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Target Role"
                placeholder="Software Engineer"
                defaultValue="Full Stack Developer"
              />
              <Input
                label="Timeline"
                placeholder="3 months"
                defaultValue="3 months"
              />
              <Input
                label="Current Level"
                placeholder="Beginner / Intermediate"
                defaultValue="Intermediate"
              />
            </div>
            <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Map className="h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {generated && (
          <>
            <Card>
              <CardContent>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Your Career Roadmap</CardTitle>
                    <CardDescription>
                      Full Stack Developer · 3 month plan · {MOCK_ROADMAP.length} phases
                    </CardDescription>
                  </div>
                  <div className="w-full sm:w-64">
                    <ProgressBar
                      label="Overall Progress"
                      value={progress}
                      color="violet"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative space-y-0">
              {MOCK_ROADMAP.map((phase, index) => {
                const config = STATUS_CONFIG[phase.status];
                const Icon = config.icon;
                const isLast = index === MOCK_ROADMAP.length - 1;

                return (
                  <div key={phase.id} className="relative flex gap-6 pb-8">
                    {!isLast && (
                      <div
                        className={`absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5 ${config.line}`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                        phase.status === "completed"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : phase.status === "in-progress"
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-slate-700 bg-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          phase.status === "completed"
                            ? "text-emerald-400"
                            : phase.status === "in-progress"
                              ? "text-violet-400"
                              : "text-slate-500"
                        }`}
                      />
                    </div>

                    <Card className="flex-1">
                      <CardContent>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white">{phase.title}</h3>
                              <Badge variant={config.badge}>{config.label}</Badge>
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {phase.duration}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-slate-500">
                            Phase {index + 1}
                          </span>
                        </div>

                        <ul className="mt-4 space-y-2">
                          {phase.tasks.map((task) => (
                            <li
                              key={task}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
