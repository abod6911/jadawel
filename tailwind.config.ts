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
        // Obsidian Noir & Champagne Gold VIP Concierge Palette
        obsidian: {
          DEFAULT: "#0B0D12", // Smoky Obsidian Noir Base
          950: "#06070A",     // Deepest Noir Pitch
          900: "#0B0D12",     // Primary Obsidian Noir
          850: "#12151C",     // Elevated Charcoal Noir
          800: "#171B24",     // Smoky Charcoal Glass
          700: "#222734",     // Subdued Graphite
          600: "#2D3445",
        },
        surface: {
          DEFAULT: "#12151C",
          card: "rgba(14, 17, 24, 0.72)",     // Smoky Glassmorphism 70-75%
          cardHover: "rgba(20, 24, 34, 0.88)",
        },
        champagne: {
          DEFAULT: "#E5C378", // Metallic Champagne Gold
          light: "#F5E2B3",   // Light Champagne
          shimmer: "#FFF1CC", // High-Luminance Specular
          dark: "#C8A452",    // Rich Bronze Gold
          deep: "#947328",    // Antique Deep Gold
        },
        platinum: {
          DEFAULT: "#E2E8F0", // Refined Light Platinum
          light: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        abyss: {
          DEFAULT: "#0B0D12",
          950: "#06070A",
          900: "#0B0D12",
          850: "#12151C",
          800: "#171B24",
          700: "#222734",
          600: "#2D3445",
        },
        navy: {
          DEFAULT: "#0E1118",
          950: "#06070A",
          900: "#0B0D12",
          850: "#12151C",
          800: "#171B24",
          700: "#222734",
          600: "#2D3445",
        },
        gold: {
          primary: "#E5C378", // Luminous Metallic Champagne Gold
          hover: "#C8A452",   // Deep Champagne Bronze
          300: "#FFF1CC",     // High-Specular Gold
          400: "#F5E2B3",     // Light Champagne
          500: "#E5C378",     // Primary Champagne Gold
          600: "#C8A452",     // Rich Warm Gold
          700: "#947328",
        },
        coral: {
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        teal: {
          mist: "#2DD4BF",    // Luminescent Marine Teal Accent
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          light: "rgba(20, 184, 166, 0.15)",
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
          gold: "#E5C378",
          pearl: "#FFFFFF",
          muted: "#94A3B8",
          dark: "#0B0D12",
          lightPrimary: "#FFFFFF",
          lightSecondary: "#E2E8F0",
          darkPrimary: "#0B0D12",
          darkSecondary: "#64748B",
        },
        status: {
          success: "#22C55E",
          warning: "#E5C378",
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
        'gold-gradient': 'linear-gradient(135deg, #E5C378 0%, #C8A452 100%)',
        'champagne-gradient': 'linear-gradient(135deg, #F5E2B3 0%, #E5C378 50%, #C8A452 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FFF1CC 0%, #E5C378 50%, #14B8A6 100%)',
        'teal-gradient': 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px -2px rgba(229, 195, 120, 0.45)',
        'glow-champagne': '0 0 30px -2px rgba(229, 195, 120, 0.50)',
        'glow-teal': '0 0 30px -2px rgba(20, 184, 166, 0.35)',
        'glow-coral': '0 0 30px -2px rgba(229, 195, 120, 0.45)',
        'cinematic': '0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(229, 195, 120, 0.18)',
        'card-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.8)',
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
