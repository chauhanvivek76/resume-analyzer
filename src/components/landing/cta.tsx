import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Ace Your Placement?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Join thousands of students using AI to prepare smarter, not harder.
              Start your free analysis today.
            </p>
            <Button href="/dashboard" size="lg" className="mt-8">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
