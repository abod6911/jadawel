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
        // Red Sea Night Obsidian & Hijazi Metallic Gold Palette
        obsidian: {
          DEFAULT: "#06090F", // Deepest Red Sea Night Base
          950: "#04060A",     // Deep Pitch
          900: "#06090F",     // Primary Red Sea Night Base
          850: "#0B111E",     // Elevated Oceanic Noir
          800: "#101726",     // Deep Marine Glass
          700: "#172238",     // Subdued Graphite Navy
          600: "#22314D",
        },
        surface: {
          DEFAULT: "#0B111E",
          card: "rgba(16, 23, 38, 0.65)",     // Ultra-Luxury Glassmorphism
          cardHover: "rgba(22, 32, 52, 0.85)",
        },
        champagne: {
          DEFAULT: "#D4AF37", // Hijazi Metallic Gold
          light: "#F5D07A",   // High-Specular Gold
          shimmer: "#FFF1CC", // Specular Core
          dark: "#AA7C11",    // Antique Deep Gold
          deep: "#8A6409",
        },
        platinum: {
          DEFAULT: "#E2E8F0", // Refined Light Platinum
          light: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        abyss: {
          DEFAULT: "#06090F",
          950: "#04060A",
          900: "#06090F",
          850: "#0B111E",
          800: "#101726",
          700: "#172238",
          600: "#22314D",
        },
        navy: {
          DEFAULT: "#0B111E",
          950: "#04060A",
          900: "#06090F",
          850: "#0B111E",
          800: "#101726",
          700: "#172238",
          600: "#22314D",
        },
        gold: {
          primary: "#D4AF37", // Hijazi Metallic Gold
          hover: "#AA7C11",   // Deep Gold
          300: "#FFF1CC",     // High-Specular Light
          400: "#F5D07A",     // Luminous Gold
          500: "#D4AF37",     // Primary Hijazi Gold
          600: "#AA7C11",     // Rich Warm Gold
          700: "#8A6409",
        },
        coral: {
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        teal: {
          mist: "#10B981",    // Red Sea Emerald Teal
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          light: "rgba(16, 185, 129, 0.15)",
        },
        pearl: {
          DEFAULT: "#FFFFFF", // Crisp Pure White
          muted: "#CBD5E1",   // Light Platinum Slate
        },
        sand: {
          warm: "#FBF8F2",
          DEFAULT: "#F1F5F9",
        },
        text: {
          pure: "#FFFFFF",
          subtle: "#CBD5E1",
          gold: "#F5D07A",
          pearl: "#FFFFFF",
          muted: "#94A3B8",
          dark: "#06090F",
          lightPrimary: "#FFFFFF",
          lightSecondary: "#E2E8F0",
          darkPrimary: "#06090F",
          darkSecondary: "#64748B",
        },
        status: {
          success: "#10B981",
          warning: "#D4AF37",
          error: "#EF4444",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "'Cairo'", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        arabic: ["var(--font-body)", "var(--font-heading)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D07A 0%, #D4AF37 50%, #AA7C11 100%)',
        'champagne-gradient': 'linear-gradient(135deg, #F5D07A 0%, #D4AF37 50%, #AA7C11 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FFF1CC 0%, #D4AF37 50%, #10B981 100%)',
        'teal-gradient': 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      boxShadow: {
        'glow-gold': '0 8px 30px -4px rgba(212, 175, 55, 0.35)',
        'glow-champagne': '0 8px 30px -4px rgba(212, 175, 55, 0.45)',
        'glow-teal': '0 0 25px -2px rgba(16, 185, 129, 0.35)',
        'glow-coral': '0 8px 30px -4px rgba(212, 175, 55, 0.35)',
        'cinematic': '0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(212, 175, 55, 0.20)',
        'card-dark': '0 16px 40px -10px rgba(0, 0, 0, 0.85)',
      },
      transitionDuration: {
        instant: '75ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        shimmer: '1600ms',
      },
      transitionTimingFunction: {
        // Easing Wizard (https://easingwizard.com/) CSS linear() Physics Curves
        spring: 'linear(0, 0.007, 0.029 2.2%, 0.118 4.7%, 0.625 14.4%, 0.826 19%, 0.902 21.4%, 0.96 24%, 1.001 26.8%, 1.027 29.8%, 1.041 33.1%, 1.044 36.6%, 1.037 40.7%, 1.012 50.1%, 0.997 60.5%, 0.999 71.8%, 1 100%)',
        'spring-snappy': 'linear(0, 0.009, 0.038 2.3%, 0.158 5.1%, 0.738 15.3%, 0.916 20%, 0.984 22.8%, 1.026 25.8%, 1.046 29%, 1.05 32.5%, 1.039 36.6%, 1.018 42.1%, 1.003 48.7%, 0.998 56.4%, 1 100%)',
        'spring-smooth': 'linear(0, 0.004, 0.016 1.5%, 0.064 3.4%, 0.25 7.5%, 0.5 13.5%, 0.707 20.2%, 0.854 28.5%, 0.943 38.6%, 0.985 51.5%, 0.998 68.2%, 1 100%)',
        'spring-bouncy': 'linear(0, 0.006, 0.025 1.5%, 0.101 3.2%, 0.523 9.4%, 0.812 13.5%, 0.978 16.4%, 1.082 19.5%, 1.135 22.6%, 1.147 25.8%, 1.127 29.2%, 1.05 37.1%, 1.002 42.7%, 0.983 48.4%, 0.985 54.7%, 1.003 67.5%, 1 100%)',
        'spring-overshoot': 'linear(0, 0.008, 0.034 2%, 0.138 4.3%, 0.612 12.5%, 0.828 16.8%, 0.943 20.3%, 1.01 23.6%, 1.045 27.1%, 1.056 30.7%, 1.05 34.6%, 1.032 39.4%, 1.005 48.2%, 0.998 57.8%, 1 100%)',
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
