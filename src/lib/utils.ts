export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
