import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "violet" | "emerald" | "amber" | "red" | "cyan";
  className?: string;
}

const colorStyles = {
  violet: "bg-gradient-to-r from-violet-600 to-indigo-500",
  emerald: "bg-gradient-to-r from-emerald-600 to-teal-500",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500",
  red: "bg-gradient-to-r from-red-500 to-rose-500",
  cyan: "bg-gradient-to-r from-cyan-500 to-blue-500",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = "violet",
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-400">{label}</span>}
          {showValue && (
            <span className="font-medium text-slate-200">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorStyles[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
