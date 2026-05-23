const THEME_KEY = "zyrox.theme";

export type AppTheme = "dark" | "light";

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_KEY) as AppTheme) ?? "dark";
}

export function setStoredTheme(theme: AppTheme): void {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("zyrox-theme-change", { detail: theme }));
}

export function applyTheme(theme: AppTheme): void {
  const html = document.documentElement;
  if (theme === "light") {
    html.classList.add("light");
  } else {
    html.classList.remove("light");
  }
}
