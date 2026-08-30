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
        // Red Sea Abyss & Coastal Luxury Palette
        abyss: {
          DEFAULT: "#07151E", // Deep Red Sea Midnight
          950: "#040D13",
          900: "#07151E",
          850: "#0C202B",
          800: "#102934",
          700: "#13303D", // Elevated interactive
          600: "#1B4354",
        },
        navy: {
          950: "#040D13",
          900: "#07151E",
          850: "#0C202B",
          800: "#102934",
          700: "#13303D",
          600: "#1B4354",
        },
        coral: {
          300: "#FF9B85",
          400: "#FA856B",
          500: "#F46F52", // Jadawel Signature Sunset Coral
          600: "#E05537",
          700: "#C44124",
        },
        teal: {
          300: "#4ECDC4",
          400: "#2CB5AF",
          500: "#1D8C88", // Marine Coastal Teal
          600: "#15706D",
          light: "#E0F7F6",
        },
        gold: {
          300: "#FDF0D5",
          400: "#FAD899",
          500: "#F6C77A", // Hijazi Heritage Gold
          600: "#E5AE55",
        },
        pearl: {
          DEFAULT: "#F9F8F5",
          muted: "#9BB0B8",
        },
        sand: {
          warm: "#FBF8F2",
          DEFAULT: "#F1F5F9",
        },
        text: {
          pearl: "#F9F8F5",
          muted: "#9BB0B8",
          dark: "#0E1E26",
          lightPrimary: "#F9F8F5",
          lightSecondary: "#CBD5E1",
          darkPrimary: "#0E1E26",
          darkSecondary: "#64748B",
        },
        status: {
          success: "#10B981",
          warning: "#F6C77A",
          error: "#EF4444",
        },
      },
      fontFamily: {
        arabic: ["var(--font-readex-pro)", "var(--font-ibm-plex-sans-arabic)", "sans-serif"],
        sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        'coral-gradient': 'linear-gradient(135deg, #F46F52 0%, #E05537 50%, #C44124 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #F6C77A 0%, #F46F52 50%, #1D8C88 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FAD899 0%, #F6C77A 50%, #E5AE55 100%)',
        'teal-gradient': 'linear-gradient(135deg, #4ECDC4 0%, #1D8C88 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      boxShadow: {
        'glow-coral': '0 0 30px -2px rgba(244, 111, 82, 0.45)',
        'glow-teal': '0 0 30px -2px rgba(29, 140, 136, 0.4)',
        'glow-gold': '0 0 30px -2px rgba(246, 199, 122, 0.35)',
        'cinematic': '0 20px 50px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(29, 140, 136, 0.15)',
        'card-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

export default config;
