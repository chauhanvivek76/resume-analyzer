import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
            <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
