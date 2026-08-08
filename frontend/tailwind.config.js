/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: {
          DEFAULT: "#111827",
          border: "#1e293b",
          hover: "#1f293d",
          muted: "#0f172a"
        },
        risk: {
          safe: "#10b981",     // Emerald green
          moderate: "#f59e0b", // Amber yellow
          high: "#f97316",     // Deep orange
          critical: "#ef4444"  // Vibrant rose/red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
