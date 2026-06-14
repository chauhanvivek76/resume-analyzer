import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  FileSearch,
  Map,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";

const QUICK_ACTIONS = [
  { href: "/resume-analyzer", label: "Analyze Resume", icon: FileSearch },
  { href: "/ats-score", label: "Check ATS Score", icon: Target },
  { href: "/interview-questions", label: "Practice Interview", icon: MessageSquare },
  { href: "/skill-gap", label: "Skill Gap Analysis", icon: BarChart3 },
  { href: "/career-roadmap", label: "View Roadmap", icon: Map },
];

const RECENT_ACTIVITY = [
  { action: "Resume analyzed", time: "2 hours ago", score: 78 },
  { action: "ATS score updated", time: "1 day ago", score: 85 },
  { action: "Interview prep completed", time: "2 days ago", score: 92 },
];

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Welcome back! Here's your placement preparation overview."
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Resume Score", value: "78", change: "+5%", icon: FileSearch },
            { label: "ATS Score", value: "85", change: "+12%", icon: Target },
            { label: "Skills Matched", value: "72%", change: "+8%", icon: BarChart3 },
            { label: "Roadmap Progress", value: "45%", change: "+15%", icon: TrendingUp },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                      <Badge variant="success" className="mt-2">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="rounded-lg bg-violet-500/10 p-2">
                      <Icon className="h-5 w-5 text-violet-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Overall readiness */}
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center py-8">
              <CardTitle className="mb-6">Placement Readiness</CardTitle>
              <ScoreRing score={78} label="Overall" />
              <p className="mt-6 text-center text-sm text-slate-400">
                You&apos;re on track! Focus on improving your ATS keywords and
                practicing behavioral questions.
              </p>
              <Button href="/career-roadmap" className="mt-6" size="sm">
                View Roadmap
              </Button>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="lg:col-span-2">
            <CardContent>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription className="mb-6">
                Jump into your most used tools
              </CardDescription>
              <div className="grid gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 transition-colors hover:border-violet-500/40 hover:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-violet-400" />
                        <span className="text-sm font-medium text-white">
                          {action.label}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-500" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Skill progress */}
          <Card>
            <CardContent>
              <CardTitle>Skill Progress</CardTitle>
              <CardDescription className="mb-6">
                Your top skills vs. target role requirements
              </CardDescription>
              <div className="space-y-5">
                <ProgressBar label="JavaScript / TypeScript" value={85} color="emerald" />
                <ProgressBar label="React / Next.js" value={78} color="violet" />
                <ProgressBar label="Data Structures" value={65} color="amber" />
                <ProgressBar label="System Design" value={45} color="red" />
              </div>
              <Button href="/skill-gap" variant="outline" className="mt-6" size="sm">
                Full Skill Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardContent>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription className="mb-6">
                Your latest analyses and improvements
              </CardDescription>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item) => (
                  <div
                    key={item.action}
                    className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                    <Badge variant="info">{item.score}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
