import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-elevated", className)}>
      <div
        className="h-full rounded-full bg-gradient-primary shadow-glow-primary transition-all duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
