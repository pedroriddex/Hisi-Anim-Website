import { heroui } from "@heroui/react";

/**
 * Tailwind config is intentionally not annotated with `Config` from
 * "tailwindcss": HeroUI bundles its own copy of tailwindcss types, and the
 * `heroui()` plugin return type does not match this project's `Config["plugins"]`
 * type. Letting TypeScript infer the object avoids that structural clash while
 * keeping full type safety everywhere it is consumed.
 */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Scan ALL HeroUI packages, including the ones npm hoisted into nested
    // node_modules (e.g. @heroui/react/node_modules/@heroui/snippet/dist).
    // The Snippet's copy/check icon toggle classes (opacity-0, scale-50,
    // group-data-[copied=true]:*) live in that nested package — without this
    // glob Tailwind never generates them and both icons render at once.
    "./node_modules/@heroui/**/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  darkMode: "class" as const,
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0a",
            foreground: "#ededed",
            content1: "#141414",
            content2: "#1c1c1c",
            default: {
              50: "#0d0d0d",
              100: "#161616",
              200: "#222222",
              300: "#2e2e2e",
              400: "#4d4d4d",
              500: "#6b6b6b",
              600: "#8f8f8f",
              700: "#b3b3b3",
              800: "#d6d6d6",
              900: "#f5f5f5",
              foreground: "#ededed",
              DEFAULT: "#222222",
            },
            primary: {
              DEFAULT: "#ededed",
              foreground: "#0a0a0a",
            },
            focus: "#a3a3a3",
          },
        },
      },
    }),
  ],
};

export default config;
