import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0a0a0f",
        "midnight-soft": "#0e0e15",
        emerald: {
          glow: "#34d399",
          bright: "#10b981",
        },
        indigo: {
          500: "#6366f1",
          400: "#818cf8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;