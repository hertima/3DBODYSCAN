import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "md" | "lg";
};

export function PrimaryButton({ children, className, variant = "primary", size = "md", ...rest }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-95",
    ghost: "text-muted-foreground hover:text-foreground",
    outline: "border border-border bg-surface text-foreground hover:bg-elevated",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(base, sizes[size], variants[variant], className)}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
