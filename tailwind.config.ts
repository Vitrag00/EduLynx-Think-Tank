import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B3C5D",
        "navy-light": "#0e4a73",
        "navy-dark": "#072c45",
        "navy-deeper": "#041e2e",
        "navy-bar": "#1e2a3a",
        gold: "#C9A24D",
        "gold-light": "#dbb96a",
        charcoal: "#2E2E2E",
        warm: "#F5F7FA",
        band5: "#d97706",
        band6: "#2563eb",
        band7: "#16a34a",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: ['"Georgia"', '"Times New Roman"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
