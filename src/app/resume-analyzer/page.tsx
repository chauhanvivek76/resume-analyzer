"use client";

import { useState } from "react";
import { CheckCircle2, FileUp, Sparkles, Upload, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

export default function ResumeAnalyzerPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter a target role");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/resume/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            target_role: targetRole,
            job_description: null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setResult(data);
      setAnalyzed(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Resume Analyzer"
      description="Upload or paste your resume for AI-powered analysis and feedback."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input section */}
          <Card>
            <CardContent>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription className="mb-6">
                Supported formats: PDF, DOCX, TXT
              </CardDescription>

              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 px-6 py-12 transition-colors hover:border-violet-500/50">
                <Upload className="h-10 w-10 text-slate-500" />
                <p className="mt-4 text-sm font-medium text-white">
                  Drag & drop your resume here
                </p>
                <p className="mt-1 text-xs text-slate-500">or click to browse</p>
                <Button variant="secondary" size="sm" className="mt-4">
                  <FileUp className="h-4 w-4" />
                  Choose File
                </Button>
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-500">OR</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <Input
                label="Target Role"
                placeholder="e.g. Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <div className="mt-4">
                <Textarea
                  label="Paste Resume Text"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                className="mt-6 w-full"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results section */}
          <Card>
            <CardContent>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription className="mb-6">
                {analyzed
                  ? "AI-powered insights for your resume"
                  : "Upload a resume to see analysis results"}
              </CardDescription>

              {analyzed && result ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <ScoreRing score={result.score} label="Resume Score" />
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.strengths.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-slate-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-400">
                      <XCircle className="h-4 w-4" />
                      Improvements
                    </h4>
                    <ul className="space-y-2">
                      {result.improvements.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-slate-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles className="h-12 w-12 text-slate-700" />
                  <p className="mt-4 text-sm text-slate-500">
                    Your analysis results will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {analyzed && result && (
          <Card>
            <CardContent>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription className="mb-6">
                Keywords found and missing for your target role
              </CardDescription>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-emerald-400">
                    Found Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.found.map((kw) => (
                      <Badge key={kw} variant="success">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-medium text-red-400">
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map((kw) => (
                      <Badge key={kw} variant="danger">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

