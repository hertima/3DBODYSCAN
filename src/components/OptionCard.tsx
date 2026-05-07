import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  multi?: boolean;
  className?: string;
};

export function OptionCard({ active, onClick, icon, title, subtitle, multi, className }: Props) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-primary/60 bg-elevated shadow-glow-primary"
          : "border-border bg-surface hover:border-primary/30 hover:bg-elevated/60",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-xl transition",
            active ? "bg-gradient-primary text-primary-foreground" : "bg-elevated text-cyan",
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-semibold text-foreground">{title}</div>
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      </div>
      <div
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
          multi ? "rounded-md" : "",
          active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
        )}
      >
        {active && (multi ? <Check className="h-4 w-4" /> : <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />)}
      </div>
    </motion.button>
  );
}
