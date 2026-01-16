/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        glass: "var(--color-glass)",
        glassBorder: "var(--color-glass-border)",
        accent: "var(--color-accent)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        glow: "var(--shadow-glow)",
      },
      backdropBlur: {
        glass: "18px",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.1s linear infinite",
      },
    },
  },
  plugins: [],
};
