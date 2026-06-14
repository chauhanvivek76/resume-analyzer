"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Sparkles, Target } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/badge";

interface ATSScoreResult {
  overall: number;
  formatting: number;
  keywords: number;
  readability: number;
  suggestions: string[];
  matched_keywords: string[];
  missing_keywords: string[];
}

export default function ATSScorePage() {
  const [scored, setScored] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<ATSScoreResult | null>(null);
  const [error, setError] = useState("");

  const handleScore = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/ats/score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_title: jobTitle,
            job_description: jobDescription,
            company: company || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate ATS score");
      }

      const data = await response.json();
      setResult(data);
      setScored(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate ATS score. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="ATS Score"
      description="Check how well your resume passes Applicant Tracking Systems."
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardContent>
              <CardTitle>Job Description</CardTitle>
              <CardDescription className="mb-6">
                Paste the job description to compare against your resume
              </CardDescription>

              <Input
                label="Job Title"
                placeholder="e.g. Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <div className="mt-4">
                <Input
                  label="Company"
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Job Description"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[240px]"
                />
              </div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                <CardTitle className="text-base">Your Resume</CardTitle>
                <Textarea
                  label="Resume Text"
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="mt-3 min-h-[200px]"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                className="mt-6 w-full"
                onClick={handleScore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Calculate ATS Score
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardContent>
              <CardTitle>ATS Compatibility Report</CardTitle>
              <CardDescription className="mb-6">
                How well your resume matches ATS requirements
              </CardDescription>

              {scored && result ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-around">
                    <ScoreRing score={result.overall} label="ATS Score" size={180} />
                    <div className="w-full max-w-sm space-y-4">
                      <ProgressBar
                        label="Formatting"
                        value={result.formatting}
                        color="emerald"
                      />
                      <ProgressBar
                        label="Keyword Match"
                        value={result.keywords}
                        color="violet"
                      />
                      <ProgressBar
                        label="Readability"
                        value={result.readability}
                        color="cyan"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="font-medium text-emerald-400">
                        {result.overall >= 80
                          ? "Good ATS Compatibility"
                          : result.overall >= 60
                            ? "Moderate ATS Compatibility"
                            : "Needs Improvement"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {result.overall >= 80
                        ? "Your resume has a strong chance of passing ATS filters for this role. Address the suggestions below to improve further."
                        : result.overall >= 60
                          ? "Your resume has a moderate chance of passing ATS filters. Implement the suggestions below to improve your score."
                          : "Your resume needs improvements to pass ATS filters. Implement the suggestions below to increase your chances."}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      Optimization Suggestions
                    </h4>
                    <ul className="space-y-3">
                      {result.suggestions.map((tip, i) => (
                        <li
                          key={tip}
                          className="flex gap-3 rounded-lg border border-slate-800 px-4 py-3 text-sm text-slate-300"
                        >
                          <Badge variant="info" className="shrink-0">
                            {i + 1}
                          </Badge>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(result.matched_keywords.length > 0 ||
                    result.missing_keywords.length > 0) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-3 text-sm font-medium text-emerald-400">
                          Matched Keywords ({result.matched_keywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.matched_keywords.slice(0, 10).map((kw) => (
                            <Badge key={kw} variant="success">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-3 text-sm font-medium text-red-400">
                          Missing Keywords ({result.missing_keywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.missing_keywords.slice(0, 10).map((kw) => (
                            <Badge key={kw} variant="danger">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Target className="h-16 w-16 text-slate-700" />
                  <p className="mt-4 text-lg font-medium text-slate-400">
                    No score yet
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Enter a job description and click calculate to see your ATS
                    compatibility score
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

