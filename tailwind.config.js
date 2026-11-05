/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        capo: {
          black: '#0A0A0C',
          dark: '#141418',
          card: '#18181D',
          graphite: '#27272E',
          silver: '#8E8E93',
          border: '#E2E2E6',
          borderDark: '#2C2C35',
          cream: '#F7F7F8',
          offwhite: '#FDFDFD',
          accent: '#D4AF37', // subtle antique gold highlight for high-end touch if needed
          accentHover: '#C59F2A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest: '0.2em',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'drawer': '-10px 0 30px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
