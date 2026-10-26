/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          500: '#0878c9',
          700: '#00528f',
          900: '#003366'
        }
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(0, 51, 102, 0.35)'
      }
    }
  },
  plugins: []
};
