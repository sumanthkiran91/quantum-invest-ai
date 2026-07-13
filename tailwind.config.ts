import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          ink: "#050814",
          night: "#080D1C",
          panel: "#10182B",
          card: "#131C33",
          border: "rgba(148, 163, 184, 0.18)",
          blue: "#38BDF8",
          purple: "#A78BFA",
          premium: "#7C3AED",
          positive: "#22C55E",
          negative: "#EF4444"
        }
      },
      boxShadow: {
        premium: "0 18px 60px rgba(2, 6, 23, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
