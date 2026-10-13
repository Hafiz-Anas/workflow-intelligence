import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1440px" } },
    extend: {
      screens: { "3xl": "1680px" },
      colors: {
        navy: { 900: token("navy-900"), 700: token("navy-700") },
        background: token("background"),
        card: { DEFAULT: token("card"), foreground: token("text") },
        popover: { DEFAULT: token("card"), foreground: token("text") },
        border: token("border"),
        input: token("border"),
        ring: token("accent"),
        foreground: token("text"),
        text: token("text"),
        muted: { DEFAULT: token("muted"), foreground: token("text-muted") },
        accent: { DEFAULT: token("accent"), foreground: token("accent-foreground") },
        primary: { DEFAULT: token("navy-900"), foreground: token("on-navy") },
        secondary: { DEFAULT: token("muted"), foreground: token("text") },
        success: { DEFAULT: token("success"), fg: token("success-fg") },
        warning: { DEFAULT: token("warning"), fg: token("warning-fg") },
        danger: token("danger"),
        destructive: { DEFAULT: token("danger"), foreground: token("on-navy") },
        sidebar: {
          DEFAULT: token("sidebar"),
          foreground: token("sidebar-foreground"),
          muted: token("sidebar-muted"),
          active: token("navy-700"),
        },
        heat: {
          1: token("heat-1"),
          2: token("heat-2"),
          3: token("heat-3"),
          4: token("heat-4"),
          5: token("heat-5"),
        },
        chart: {
          1: token("chart-1"),
          2: token("chart-2"),
          3: token("chart-3"),
        },
      },
      borderRadius: { lg: "8px", md: "6px", sm: "4px" },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        table: ["13px", { lineHeight: "18px" }],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
      },
      maxWidth: { content: "1440px" },
    },
  },
  plugins: [animate],
};

export default config;
