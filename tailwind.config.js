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
          bg: '#FFFFFF',
          surface: '#F6F5F2',
          black: '#0A0A0A',
          muted: '#5F5F5A',
          border: '#E8E6E1',
          accent: '#C2410C',
          accentSoft: '#FFF7ED',
          dark: '#141418',
          cream: '#F6F5F2',
          offwhite: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
      },
      borderRadius: {
        'card': '20px',
        'portal': '28px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -4px rgba(10, 10, 10, 0.06)',
        'premium': '0 20px 40px -15px rgba(10, 10, 10, 0.08)',
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
