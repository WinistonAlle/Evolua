import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createGlobalStyle } from "styled-components";
import {
  ResolvedTheme,
  ThemeContext,
  ThemeContextValue,
  ThemePreference,
} from "./theme-context";

const STORAGE_KEY = "evolua-theme-preference";

const ThemeGlobalStyles = createGlobalStyle`
  :root {
    --font-sans: "Manrope", "Segoe UI Variable", "Avenir Next", "Helvetica Neue", sans-serif;
    --font-display: "Sora", "Manrope", "Segoe UI Variable", sans-serif;

    --accent-rgb: 34 183 167;
    --brand-rgb: 16 79 99;
    --info-rgb: 59 130 246;
    --success-rgb: 16 185 129;
    --danger-rgb: 239 68 68;
    --surface-rgb: 255 255 255;

    --app-body-bg: #edf3f7;
    --app-body-glow:
      radial-gradient(1200px 680px at 12% 0%, rgba(34, 183, 167, 0.18), transparent 60%),
      radial-gradient(900px 520px at 84% 8%, rgba(59, 130, 246, 0.12), transparent 55%),
      linear-gradient(180deg, #eef4f7 0%, #f7fafc 100%);
    --shell-background:
      radial-gradient(1000px 540px at 18% 6%, rgba(34, 183, 167, 0.18), transparent 58%),
      radial-gradient(1000px 540px at 88% 0%, rgba(59, 130, 246, 0.12), transparent 52%),
      transparent;

    --text-primary: #112031;
    --text-secondary: rgba(17, 32, 49, 0.74);
    --text-tertiary: rgba(17, 32, 49, 0.56);
    --text-inverse: #f8fbff;
    --text-on-accent: #f8fbff;

    --line-soft: rgba(17, 32, 49, 0.10);
    --line-strong: rgba(17, 32, 49, 0.18);
    --line-contrast: rgba(255, 255, 255, 0.56);

    --panel-background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(245, 249, 252, 0.72));
    --panel-solid: rgba(255, 255, 255, 0.92);
    --panel-muted: rgba(248, 251, 253, 0.82);
    --panel-contrast: rgba(241, 247, 250, 0.88);
    --sidebar-background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(244, 248, 251, 0.78));
    --field-muted: rgba(17, 32, 49, 0.04);
    --field-background: rgba(255, 255, 255, 0.94);
    --button-soft: rgba(17, 32, 49, 0.05);
    --button-soft-hover: rgba(17, 32, 49, 0.09);
    --button-primary: linear-gradient(135deg, #0f4f63 0%, #22b7a7 100%);
    --button-primary-shadow: 0 18px 40px rgba(16, 79, 99, 0.22);
    --focus-ring: rgba(34, 183, 167, 0.34);
    --link-color: #1d5ed8;
    --shadow-soft: 0 18px 46px rgba(15, 23, 42, 0.10);
    --shadow-strong: 0 28px 80px rgba(15, 23, 42, 0.16);
    --card-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
    --preview-dashed: rgba(17, 32, 49, 0.18);

    --success-bg: rgba(16, 185, 129, 0.10);
    --success-border: rgba(16, 185, 129, 0.26);
    --success-text: #065f46;
    --danger-bg: rgba(239, 68, 68, 0.10);
    --danger-border: rgba(239, 68, 68, 0.26);
    --danger-text: #991b1b;

    --landing-background: linear-gradient(180deg, rgba(239, 245, 247, 0.92), rgba(255, 255, 255, 0.96));
    --landing-header-bg: rgba(240, 246, 248, 0.76);
    --landing-hero-overlay:
      radial-gradient(1600px 680px at 18% 18%, rgba(34, 183, 167, 0.24), transparent 65%),
      radial-gradient(1600px 680px at 82% 22%, rgba(16, 79, 99, 0.18), transparent 60%),
      linear-gradient(180deg, rgba(239, 245, 247, 0.96), rgba(255, 255, 255, 0.62));
    --landing-section-alt: rgba(255, 255, 255, 0.56);
    --landing-card-bg: rgba(255, 255, 255, 0.68);
    --landing-footer-bg: rgba(255, 255, 255, 0.74);

    --auth-left-surface:
      radial-gradient(900px 700px at 20% 10%, rgba(34, 183, 167, 0.20), transparent 55%),
      radial-gradient(1000px 800px at 70% 60%, rgba(255, 255, 255, 0.08), transparent 60%),
      linear-gradient(180deg, #0b1c2c, #10283a);
    --auth-pattern-line: rgba(255, 255, 255, 0.08);
    --auth-right-glow: radial-gradient(600px 400px at 50% 60%, rgba(15, 23, 42, 0.08), transparent 60%);
    --auth-card-bg: rgba(255, 255, 255, 0.84);
    --auth-card-border: rgba(255, 255, 255, 0.72);
    --auth-modal-overlay:
      radial-gradient(420px 260px at 50% 20%, rgba(255, 255, 255, 0.18), transparent 70%),
      rgba(8, 15, 28, 0.28);
  }

  html[data-theme="dark"] {
    --accent-rgb: 49 212 190;
    --brand-rgb: 110 168 255;
    --info-rgb: 96 165 250;
    --success-rgb: 52 211 153;
    --danger-rgb: 248 113 113;
    --surface-rgb: 13 23 36;

    --app-body-bg: #08121d;
    --app-body-glow:
      radial-gradient(1200px 680px at 14% 0%, rgba(49, 212, 190, 0.16), transparent 60%),
      radial-gradient(900px 520px at 86% 10%, rgba(96, 165, 250, 0.14), transparent 55%),
      linear-gradient(180deg, #07111b 0%, #081520 100%);
    --shell-background:
      radial-gradient(1000px 540px at 18% 6%, rgba(49, 212, 190, 0.12), transparent 58%),
      radial-gradient(1000px 540px at 88% 0%, rgba(96, 165, 250, 0.12), transparent 52%),
      transparent;

    --text-primary: #eef5fb;
    --text-secondary: rgba(238, 245, 251, 0.74);
    --text-tertiary: rgba(238, 245, 251, 0.54);
    --text-inverse: #08121d;
    --text-on-accent: #04111a;

    --line-soft: rgba(148, 163, 184, 0.18);
    --line-strong: rgba(148, 163, 184, 0.30);
    --line-contrast: rgba(255, 255, 255, 0.12);

    --panel-background: linear-gradient(180deg, rgba(15, 25, 38, 0.84), rgba(8, 17, 29, 0.78));
    --panel-solid: rgba(11, 19, 31, 0.92);
    --panel-muted: rgba(14, 25, 38, 0.88);
    --panel-contrast: rgba(8, 17, 29, 0.92);
    --sidebar-background: linear-gradient(180deg, rgba(11, 20, 32, 0.90), rgba(8, 17, 29, 0.84));
    --field-muted: rgba(238, 245, 251, 0.05);
    --field-background: rgba(8, 17, 29, 0.90);
    --button-soft: rgba(238, 245, 251, 0.06);
    --button-soft-hover: rgba(238, 245, 251, 0.11);
    --button-primary: linear-gradient(135deg, #6ea8ff 0%, #31d4be 100%);
    --button-primary-shadow: 0 18px 40px rgba(49, 212, 190, 0.20);
    --focus-ring: rgba(49, 212, 190, 0.34);
    --link-color: #8fbaff;
    --shadow-soft: 0 22px 52px rgba(0, 0, 0, 0.24);
    --shadow-strong: 0 30px 88px rgba(0, 0, 0, 0.36);
    --card-shadow: 0 18px 38px rgba(0, 0, 0, 0.24);
    --preview-dashed: rgba(148, 163, 184, 0.28);

    --success-bg: rgba(52, 211, 153, 0.12);
    --success-border: rgba(52, 211, 153, 0.28);
    --success-text: #8df0c5;
    --danger-bg: rgba(248, 113, 113, 0.12);
    --danger-border: rgba(248, 113, 113, 0.28);
    --danger-text: #fecaca;

    --landing-background: linear-gradient(180deg, rgba(7, 18, 30, 0.94), rgba(8, 17, 29, 0.98));
    --landing-header-bg: rgba(8, 17, 29, 0.68);
    --landing-hero-overlay:
      radial-gradient(1600px 680px at 18% 18%, rgba(49, 212, 190, 0.18), transparent 65%),
      radial-gradient(1600px 680px at 82% 22%, rgba(110, 168, 255, 0.16), transparent 60%),
      linear-gradient(180deg, rgba(8, 17, 29, 0.96), rgba(8, 17, 29, 0.74));
    --landing-section-alt: rgba(9, 18, 30, 0.72);
    --landing-card-bg: rgba(12, 22, 35, 0.70);
    --landing-footer-bg: rgba(8, 17, 29, 0.78);

    --auth-left-surface:
      radial-gradient(900px 700px at 20% 10%, rgba(49, 212, 190, 0.18), transparent 55%),
      radial-gradient(1000px 800px at 70% 60%, rgba(110, 168, 255, 0.10), transparent 60%),
      linear-gradient(180deg, #07111a, #0d1d2e);
    --auth-pattern-line: rgba(255, 255, 255, 0.06);
    --auth-right-glow: radial-gradient(600px 400px at 50% 60%, rgba(49, 212, 190, 0.08), transparent 60%);
    --auth-card-bg: rgba(9, 17, 29, 0.84);
    --auth-card-border: rgba(148, 163, 184, 0.18);
    --auth-modal-overlay:
      radial-gradient(420px 260px at 50% 20%, rgba(255, 255, 255, 0.08), transparent 70%),
      rgba(3, 8, 16, 0.52);
  }

  html {
    width: 100%;
    min-height: 100%;
    color-scheme: light;
  }

  html[data-theme="dark"] {
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    min-height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    min-width: 0;
    overflow-x: hidden;
    font-family: var(--font-sans);
    color: var(--text-primary);
    background-color: var(--app-body-bg);
    background-image: var(--app-body-glow);
    text-rendering: optimizeLegibility;
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition:
      background-color 220ms ease,
      color 220ms ease,
      background-image 220ms ease;
  }

  #root {
    max-width: none !important;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    color: inherit;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  ::selection {
    background: rgba(var(--accent-rgb), 0.24);
  }
`;

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(getStoredPreference);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  const resolvedTheme = themePreference === "system" ? systemTheme : themePreference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      setThemePreference,
      toggleTheme: () =>
        setThemePreference((current) => {
          const baseTheme = current === "system" ? systemTheme : current;
          return baseTheme === "dark" ? "light" : "dark";
        }),
    }),
    [resolvedTheme, systemTheme, themePreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeGlobalStyles />
      {children}
    </ThemeContext.Provider>
  );
}
