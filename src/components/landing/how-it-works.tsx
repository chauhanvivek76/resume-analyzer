import { FileUp, Sparkles, Trophy } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Upload Your Resume",
    description: "Upload your resume or paste your profile details to get started.",
    icon: FileUp,
  },
  {
    step: "02",
    title: "AI Analysis",
    description: "Our AI analyzes your profile against job requirements and industry standards.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Get Actionable Insights",
    description: "Receive scores, feedback, interview prep, and a personalized career roadmap.",
    icon: Trophy,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Three simple steps to transform your placement preparation.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
                  <Icon className="h-8 w-8 text-violet-400" />
                </div>
                <span className="mt-4 block text-sm font-medium text-violet-400">
                  Step {item.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
