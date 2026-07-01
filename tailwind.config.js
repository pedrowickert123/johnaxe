/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F4F6F9",
          100: "#E6EBF2",
          200: "#C7D2E0",
          300: "#9CACC2",
          400: "#6A7E99",
          500: "#475A75",
          600: "#324259",
          700: "#1F2D42",
          800: "#142036",
          900: "#0A1628",
          950: "#050C19",
        },
        accent: {
          DEFAULT: "#C8102E",
          dark: "#9F0D24",
        },
        coal: {
          DEFAULT: "#1c1c1c",
          700: "#2b2b2b",
          800: "#222222",
          900: "#161616",
        },
        ink: "#0A1628",
        paper: "#FAFAFA",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.22em",
      },
      boxShadow: {
        sharp:
          "0 1px 0 rgba(10, 22, 40, 0.06), 0 0 0 1px rgba(10, 22, 40, 0.04)",
        edge: "0 1px 2px rgba(10, 22, 40, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
      },
    },
  },
  plugins: [],
};
