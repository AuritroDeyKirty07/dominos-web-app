/** @type {import('tailwindcss').Config} */
export default {
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
      },
      boxShadow: {
        'dominos': '0 4px 20px -2px rgba(0, 100, 145, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'dominos-lg': '0 10px 25px -3px rgba(0, 100, 145, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dominos-red': '0 8px 20px -4px rgba(227, 24, 55, 0.3)',
        'dominos-blue': '0 8px 20px -4px rgba(0, 100, 145, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
