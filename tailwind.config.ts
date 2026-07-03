import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0d1015",
        panel: "#0b0e13",
        panel2: "#0f131a",
        line: "#232a33",
        line2: "#1c232d",
        ink: "#e8edf2",
        ink2: "#eef2f6",
        muted: "#8b95a1",
        faint: "#5c6672",
        steel: "#77818d",
        gold: "#f2c41d",
        green: "#39d353",
        red: "#e5484d",
        blue: "#3b9dff",
        purple: "#a86ee0",
        // rarity accents
        legendary: "#c9962a",
        epic: "#a86ee0",
        rare: "#4da3ff",
      },
      fontFamily: {
        display: ["var(--font-chakra)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      letterSpacing: {
        hud: "0.16em",
        wide2: "0.18em",
        wide3: "0.22em",
      },
      keyframes: {
        blinkdot: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        blinkdot: "blinkdot 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
