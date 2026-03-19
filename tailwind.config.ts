import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        card: "#111827",
        "card-hover": "#1a2234",
        primary: "#f59e0b",
        "primary-hover": "#d97706",
        accent: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        "text-base": "#e5e7eb",
        muted: "#9ca3af",
        border: "#1e2d40",
        "border-subtle": "#1e293b",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(245, 158, 11, 0.15)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.15)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
