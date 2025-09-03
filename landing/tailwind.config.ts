import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for Mintellect
        mintellect: {
          primary: "#3b82f6", // Changed from #6366f1 (Indigo) to #3b82f6 (Blue)
          secondary: "#60a5fa", // Changed from #8b5cf6 (Purple) to #60a5fa (Light Blue)
          accent: "#0ea5e9", // Changed from #06b6d4 (Cyan) to #0ea5e9 (Sky Blue)
          dark: "#0f172a", // Slate 900
          "dark-accent": "#1e293b", // Slate 800
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px 5px rgba(59, 130, 246, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 25px 10px rgba(59, 130, 246, 0.4)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-background": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "border-flow": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            borderColor: "rgba(59, 130, 246, 0.5)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            borderColor: "rgba(96, 165, 250, 0.5)",
          },
        },
        shine: {
          from: {
            transform: "translateX(-100%) rotate(45deg)",
          },
          to: {
            transform: "translateX(200%) rotate(45deg)",
          },
        },
        "cell-ripple": {
          "0%": {
            opacity: "0.4",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "100%": {
            opacity: "0.4",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-background": "gradient-background 15s ease infinite",
        "border-flow": "border-flow 4s ease infinite",
        shine: "shine 2s linear infinite",
        "cell-ripple": "cell-ripple var(--duration, 1s) ease-out var(--delay, 0s)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

