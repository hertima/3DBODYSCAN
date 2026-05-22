import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AIInsightCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-cyan/40 bg-surface/60 p-4", className)}>
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-ai" />
      <div className="flex items-start gap-2 pl-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
        <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}
