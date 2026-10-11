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
        // Deep Midnight Sapphire & Oceanic Navy Luxury Palette
        obsidian: {
          DEFAULT: "#070B14", // Deep Midnight Sapphire
          950: "#04070D",
          900: "#070B14",
          850: "#0A1124",     // Oceanic Navy Base
          800: "#0F1A36",     // Smoked Sapphire Glass
          700: "#17254D",     // Elevated Surface
        },
        surface: {
          DEFAULT: "#0B132B",
          card: "rgba(12, 22, 45, 0.82)",
          cardHover: "rgba(18, 32, 66, 0.92)",
        },
        abyss: {
          DEFAULT: "#070B14",
          950: "#04070D",
          900: "#0A1124",
          850: "#0F1A36",
          800: "#142247",
          700: "#1C3063",
          600: "#264287",
        },
        navy: {
          DEFAULT: "#0A1124",
          950: "#04070D",
          900: "#0A1124",
          850: "#0F1A36",
          800: "#142247",
          700: "#1C3063",
          600: "#264287",
        },
        sapphire: {
          DEFAULT: "#070E22",
          950: "#03060F",
          900: "#070E22",
          850: "#0B1736",
          800: "#0F204C",
          700: "#162E6B",
        },
        gold: {
          primary: "#F59E0B", // Radiant Amber Gold
          hover: "#D97706",   // Deep Saffron Amber
          300: "#FEF3C7",     // Luminescent Cream Gold
          400: "#FDE68A",     // 24K Accent Gold
          500: "#F59E0B",     // Primary Luxury Gold
          600: "#D97706",     // Amber Ochre
          700: "#B45309",
        },
        coral: {
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        teal: {
          mist: "#2DD4BF",    // Luminescent Marine Teal
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          light: "rgba(20, 184, 166, 0.15)",
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
      transitionDuration: {
        instant: '75ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        shimmer: '1600ms',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
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
        shimmer: {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(100%, 0, 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 6px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale3d(0.96, 0.96, 1) translate3d(0, 8px, 0)' },
          '100%': { opacity: '1', transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' },
        },
        focusGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1.5px #E5A962, 0 0 14px -2px rgba(229, 169, 98, 0.4)' },
          '50%': { boxShadow: '0 0 0 1.5px #E5A962, 0 0 20px 2px rgba(229, 169, 98, 0.6)' },
        },
        pop: {
          '0%': { transform: 'scale3d(0.7, 0.7, 1)' },
          '60%': { transform: 'scale3d(1.15, 1.15, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        fadeInUp: 'fadeInUp 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        focusGlow: 'focusGlow 2s ease-in-out infinite',
        pop: 'pop 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
