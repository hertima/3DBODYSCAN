import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getStoredTheme, setStoredTheme } from "@/lib/theme";

export function ThemeToggleButton({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
    const handler = (e: Event) => setTheme((e as CustomEvent<"dark" | "light">).detail);
    window.addEventListener("zyrox-theme-change", handler);
    return () => window.removeEventListener("zyrox-theme-change", handler);
  }, []);

  const toggle = () => setStoredTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      className={
        className ??
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary/30 hover:bg-elevated hover:text-foreground"
      }
    >
      {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </button>
  );
}
