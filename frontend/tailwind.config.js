/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dominos-blue': '#006491',
        'dominos-blue-dark': '#004c6d',
        'dominos-blue-light': '#0078ae',
        'dominos-red': '#E31837',
        'dominos-red-dark': '#b8122c',
        'dominos-red-light': '#ff2a4b',
        'dominos-dark': '#0C1E28',
        'dominos-gray': '#F4F6F8',
        'dominos-gray-light': '#FAFCFD',
        'dominos-green': '#00873D',
        // Admin panel colors
        primary: {
          DEFAULT: '#E4002B',
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E4002B',
          600: '#C80025',
          700: '#9F001D',
          800: '#7F0017',
          900: '#600011',
        },
        secondary: {
          DEFAULT: '#FFB400',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FFB400',
          600: '#D97706',
        },
        surface: {
          light: '#F8FAFC',
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
          darker: '#0F172A',
        },
      },
      boxShadow: {
        'dominos': '0 4px 20px -2px rgba(0, 100, 145, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'dominos-lg': '0 10px 25px -3px rgba(0, 100, 145, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dominos-red': '0 8px 20px -4px rgba(227, 24, 55, 0.3)',
        'dominos-blue': '0 8px 20px -4px rgba(0, 100, 145, 0.3)',
        // Admin panel shadows
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
        glow: '0 0 15px rgba(228, 0, 43, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
