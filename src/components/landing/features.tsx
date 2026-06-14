import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything You Need to Get Placed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Comprehensive AI tools designed for students and professionals preparing
            for campus placements and job interviews.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                      <Icon className="h-6 w-6 text-violet-400" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {feature.description}
                    </CardDescription>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-violet-400">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
