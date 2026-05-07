import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zyrox-logo.png";

export function Logo({ className, withText = true, size = 32 }: { className?: string; withText?: boolean; size?: number }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)}>
      <img src={logo} alt="ZYROX" width={size} height={size} className="rounded-lg shadow-glow-primary" style={{ width: size, height: size }} />
      {withText && (
        <span className="font-display text-lg font-bold tracking-[0.18em] text-gradient-primary">ZYROX</span>
      )}
    </Link>
  );
}
