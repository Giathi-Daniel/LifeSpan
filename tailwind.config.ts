import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#061827",
        "midnight-soft": "#0a2236",
        emerald: {
          glow: "#34d399",
          bright: "#10b981",
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
        glow: "0 0 40px rgba(16, 185, 129, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
