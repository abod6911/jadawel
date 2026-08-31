import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,css}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Jeddah Twilight & Gold Luxury Palette
        obsidian: {
          DEFAULT: "#090B0E",
          950: "#060709",
          900: "#090B0E",
          850: "#0F141C",
          800: "#161C24",
          700: "#1E2630",
        },
        surface: {
          DEFAULT: "#0F141C",
          card: "rgba(22, 28, 36, 0.75)",
          cardHover: "rgba(30, 38, 48, 0.85)",
        },
        abyss: {
          DEFAULT: "#090B0E", // Deep Obsidian Black
          950: "#060709",
          900: "#0F141C",     // Red Sea Twilight
          850: "#131922",
          800: "#161C24",     // Smoked Frosted Glass Base
          700: "#1E2630",     // Elevated Surface
          600: "#28323F",
        },
        navy: {
          950: "#060709",
          900: "#0F141C",
          850: "#131922",
          800: "#161C24",
          700: "#1E2630",
          600: "#28323F",
        },
        gold: {
          primary: "#E5A962", // Champagne Gold
          hover: "#D48B38",   // Saffron Amber
          300: "#FBF0DF",
          400: "#F3CA95",
          500: "#E5A962",
          600: "#D48B38",
          700: "#B87326",
        },
        coral: {
          300: "#FAD8B5",
          400: "#F3CA95",
          500: "#E5A962",
          600: "#D48B38",
          700: "#B87326",
        },
        teal: {
          mist: "#4E9F96",    // Muted Marine Teal
          300: "#86C7BF",
          400: "#68B2A9",
          500: "#4E9F96",
          600: "#3D827A",
          light: "rgba(78, 159, 150, 0.12)",
        },
        pearl: {
          DEFAULT: "#FBFBFA", // Crisp Luminescent White
          muted: "#9EA8B3",   // Soft Slate
        },
        sand: {
          warm: "#FBF8F2",
          DEFAULT: "#F1F5F9",
        },
        text: {
          pure: "#FBFBFA",
          subtle: "#9EA8B3",
          gold: "#F3CA95",
          pearl: "#FBFBFA",
          muted: "#9EA8B3",
          dark: "#090B0E",
          lightPrimary: "#FBFBFA",
          lightSecondary: "#9EA8B3",
          darkPrimary: "#090B0E",
          darkSecondary: "#64748B",
        },
        status: {
          success: "#22C55E",
          warning: "#E5A962",
          error: "#EF4444",
        },
      },
      fontFamily: {
        arabic: ["var(--font-readex-pro)", "var(--font-ibm-plex-sans-arabic)", "sans-serif"],
        sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E5A962 0%, #D48B38 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #F3CA95 0%, #E5A962 50%, #4E9F96 100%)',
        'teal-gradient': 'linear-gradient(135deg, #68B2A9 0%, #4E9F96 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px -2px rgba(229, 169, 98, 0.35)',
        'glow-teal': '0 0 30px -2px rgba(78, 159, 150, 0.30)',
        'glow-coral': '0 0 30px -2px rgba(229, 169, 98, 0.35)',
        'cinematic': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(229, 169, 98, 0.12)',
        'card-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
