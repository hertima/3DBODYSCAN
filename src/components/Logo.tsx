import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zyrox-logo.png";

export function Logo({ className, withText = true, size = 40 }: { className?: string; withText?: boolean; size?: number }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-xl blur-md" style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.5),rgba(251,146,60,0.5))", transform: "scale(1.2)" }} />
        <img
          src={logo}
          alt="3D Body Scan"
          width={size}
          height={size}
          className="relative rounded-xl"
          style={{ width: size, height: size, boxShadow: "0 0 0 1px rgba(34,211,238,0.2), 0 4px 12px rgba(0,0,0,0.5)" }}
        />
      </div>
      {withText && (
        <span
          className="font-display font-black tracking-tight"
          style={{ fontSize: size * 0.38, background: "linear-gradient(90deg,#22d3ee,#ffffff,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          3D Body Scan
        </span>
      )}
    </Link>
  );
}
