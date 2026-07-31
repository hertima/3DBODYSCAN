import { ChevronDown, Check, Sparkles } from "lucide-react";
import type { AppLocale } from "@/lib/training-i18n";
import { SUPPORTED_LOCALES, detectBrowserLocale } from "@/lib/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  compact?: boolean;
  tiny?: boolean;
  flagOnly?: boolean;
  align?: "start" | "center" | "end";
};

function FlagBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex h-4 w-6 overflow-hidden rounded-[4px] border border-white/10 shadow-sm sm:h-5 sm:w-7">
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </span>
  );
}

export function LocaleSwitcher({ value, onChange, compact = false, tiny = false, flagOnly = false, align = "end" }: LocaleSwitcherProps) {
  const activeLocale = SUPPORTED_LOCALES.find((item) => item.code === value) ?? SUPPORTED_LOCALES[0];
  const detectedLocale = detectBrowserLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {flagOnly ? (
          <button
            type="button"
            aria-label="Trocar idioma"
            className="absolute -bottom-1 -right-1 inline-flex h-[18px] w-6 overflow-hidden rounded-[4px] border-2 border-background shadow-md transition hover:scale-110"
          >
            <img src={activeLocale.flagSrc} alt={activeLocale.nativeLabel} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface text-left text-foreground transition hover:border-primary/30 hover:bg-elevated",
              tiny
                ? "px-2 py-1.5"
                : compact
                  ? "min-w-[142px] px-2.5 py-1.5 text-[11px] sm:min-w-[176px] sm:px-3 sm:py-2 sm:text-xs"
                  : "min-w-[220px] px-3 py-2 sm:min-w-[240px]"
            )}
            aria-label="Trocar idioma"
          >
            <FlagBadge src={activeLocale.flagSrc} alt={activeLocale.nativeLabel} />
            {!tiny && (
              <span className="min-w-0 flex-1">
                <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">Idioma</span>
                <span className="block truncate text-[12px] font-semibold text-foreground sm:text-sm">{activeLocale.nativeLabel}</span>
              </span>
            )}
            {tiny && (
              <span className="text-[11px] font-bold uppercase text-foreground">{activeLocale.code.toUpperCase()}</span>
            )}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[300px] rounded-2xl border-border bg-surface p-2 text-foreground shadow-2xl">
        {SUPPORTED_LOCALES.map((item) => {
          const selected = item.code === value;
          const detected = item.code === detectedLocale;
          return (
            <DropdownMenuItem
              key={item.code}
              onSelect={() => onChange(item.code)}
              className={cn("rounded-xl px-3 py-3 focus:bg-elevated focus:text-foreground", selected && "bg-elevated")}
            >
              <FlagBadge src={item.flagSrc} alt={item.nativeLabel} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{item.nativeLabel}</span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.countryLabel}</span>
              </span>
              {detected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
                  <Sparkles className="h-3 w-3" /> Auto
                </span>
              ) : null}
              {selected ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
