"use client";

import { useState } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import type { SkillGapItem } from "@/types";

const MOCK_SKILLS: SkillGapItem[] = [
  { skill: "JavaScript / TypeScript", required: true, currentLevel: 85, targetLevel: 90, priority: "medium" },
  { skill: "React / Next.js", required: true, currentLevel: 78, targetLevel: 85, priority: "high" },
  { skill: "Data Structures & Algorithms", required: true, currentLevel: 65, targetLevel: 80, priority: "high" },
  { skill: "System Design", required: true, currentLevel: 45, targetLevel: 70, priority: "high" },
  { skill: "Node.js / Express", required: true, currentLevel: 72, targetLevel: 80, priority: "medium" },
  { skill: "Docker / Kubernetes", required: false, currentLevel: 30, targetLevel: 60, priority: "medium" },
  { skill: "SQL / Database Design", required: true, currentLevel: 70, targetLevel: 75, priority: "low" },
  { skill: "Git / CI-CD", required: true, currentLevel: 80, targetLevel: 85, priority: "low" },
];

const PRIORITY_VARIANT = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "info" as const,
};

export default function SkillGapPage() {
  const [analyzed, setAnalyzed] = useState(true);
  const [loading, setLoading] = useState(false);

  const matched = MOCK_SKILLS.filter((s) => s.currentLevel >= s.targetLevel).length;
  const gaps = MOCK_SKILLS.filter((s) => s.currentLevel < s.targetLevel);
  const matchPercent = Math.round((matched / MOCK_SKILLS.length) * 100);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <DashboardShell
      title="Skill Gap Analysis"
      description="Compare your skills against job requirements and identify gaps."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Target Role" placeholder="Full Stack Developer" defaultValue="Full Stack Developer" />
              <Input label="Company Type" placeholder="Product / Service" defaultValue="Product Company" />
              <Input label="Experience" placeholder="Fresher" defaultValue="Fresher" />
            </div>
            <Button className="mt-4" onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Analyze Skill Gap
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analyzed && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="text-center">
                  <p className="text-sm text-slate-400">Overall Match</p>
                  <p className="mt-1 text-3xl font-bold text-white">{matchPercent}%</p>
                  <Badge variant="warning" className="mt-2">
                    {gaps.length} gaps found
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <p className="text-sm text-slate-400">Skills Matched</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-400">{matched}</p>
                  <p className="mt-2 text-xs text-slate-500">of {MOCK_SKILLS.length} required</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <p className="text-sm text-slate-400">High Priority Gaps</p>
                  <p className="mt-1 text-3xl font-bold text-red-400">
                    {gaps.filter((s) => s.priority === "high").length}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">need immediate focus</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent>
                <CardTitle>Skill Breakdown</CardTitle>
                <CardDescription className="mb-6">
                  Your current level vs. target for each skill
                </CardDescription>
                <div className="space-y-6">
                  {MOCK_SKILLS.map((skill) => {
                    const gap = skill.currentLevel < skill.targetLevel;
                    const color = skill.currentLevel >= skill.targetLevel
                      ? "emerald"
                      : skill.priority === "high"
                        ? "red"
                        : skill.priority === "medium"
                          ? "amber"
                          : "violet";

                    return (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {gap ? (
                              <AlertTriangle className="h-4 w-4 text-amber-400" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}
                            <span className="text-sm font-medium text-white">
                              {skill.skill}
                            </span>
                            {skill.required && (
                              <Badge variant="default">Required</Badge>
                            )}
                          </div>
                          <Badge variant={PRIORITY_VARIANT[skill.priority]}>
                            {skill.priority} priority
                          </Badge>
                        </div>
                        <ProgressBar
                          value={skill.currentLevel}
                          label={`Current: ${skill.currentLevel}% → Target: ${skill.targetLevel}%`}
                          color={color}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <CardTitle>Recommended Learning Path</CardTitle>
                <CardDescription className="mb-6">
                  Focus on these skills to close the biggest gaps
                </CardDescription>
                <div className="space-y-3">
                  {gaps
                    .sort((a, b) => {
                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .slice(0, 4)
                    .map((skill) => (
                      <div
                        key={skill.skill}
                        className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-white">{skill.skill}</p>
                          <p className="text-sm text-slate-500">
                            Gap: {skill.targetLevel - skill.currentLevel}% to reach target
                          </p>
                        </div>
                        <Button href="/career-roadmap" variant="outline" size="sm">
                          View in Roadmap
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
