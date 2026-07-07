import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// DESIGN SYSTEM — "Night Navigator"
// A career platform is fundamentally about orientation: where you are, where
// you're headed, and the path between the two. The palette borrows from
// night navigation (stars, compass bearings, a single guiding signal) rather
// than the generic "SaaS cream + terracotta" or "dark + neon" defaults.
// ---------------------------------------------------------------------------
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1224", // deep indigo-black — dark mode canvas
          50: "#F4F4F7",
          100: "#E6E7EE",
          200: "#C6C8D9",
          300: "#9A9DB8",
          400: "#6A6E90",
          500: "#474B6B",
          600: "#2F3350",
          700: "#1E2138",
          800: "#141729",
          900: "#0E1224",
          950: "#080A16",
        },
        paper: {
          DEFAULT: "#F6F5F1", // warm-cool off white — light mode canvas
          dim: "#EFEEE8",
        },
        signal: {
          DEFAULT: "#E8A33D", // beacon amber — primary accent
          50: "#FDF5E9",
          100: "#FAE7C7",
          200: "#F3CE8C",
          300: "#EDB863",
          400: "#E8A33D",
          500: "#D68B1F",
          600: "#B06E14",
          700: "#875211",
        },
        trail: {
          DEFAULT: "#2F9E8F", // progress teal — secondary accent
          50: "#EAF7F5",
          100: "#CDECE7",
          200: "#9BD9D0",
          300: "#67C2B4",
          400: "#2F9E8F",
          500: "#237E72",
          600: "#1B6058",
        },
        danger: "#D95D5D",
      },
      fontFamily: {
        // Real Fraunces / Inter / IBM Plex Mono are loaded via next/font/google
        // when the app has internet access (see src/app/layout.tsx comment).
        // Fallback stacks keep the same *character* offline: a warm serif for
        // display, a neutral grotesque for body, a monospace for data.
        display: ["Fraunces", "Georgia", "ui-serif", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "trajectory-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(14, 18, 36, 0.24)",
        "glass-sm": "0 4px 16px 0 rgba(14, 18, 36, 0.16)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        rise: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "trace-line": {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "trace-line": "trace-line 1.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
