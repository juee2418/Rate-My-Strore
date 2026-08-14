/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe8ff',
          200: '#d9d4ff',
          300: '#bcb1ff',
          400: '#9a86ff',
          500: '#7c5cff',
          600: '#6a3bf5',
          700: '#5b2ce0',
          800: '#4a25b8',
          900: '#3e2296'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(76, 41, 196, 0.15)'
      }
    }
  },
  plugins: []
};
