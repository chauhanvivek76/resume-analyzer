import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-4 w-4" />
          AI-Powered Placement Assistant
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Land Your Dream Job with{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            AI Guidance
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Analyze resumes, check ATS scores, prepare for interviews, identify skill
          gaps, and get a personalized career roadmap — all powered by AI.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/dashboard" size="lg">
            Start Free Analysis
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button href="/resume-analyzer" variant="outline" size="lg">
            Upload Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
