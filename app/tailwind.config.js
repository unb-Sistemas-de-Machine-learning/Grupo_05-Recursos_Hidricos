/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './login.html',
    './dashboard.html',
    './register.html',
    './src/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#094559',
          50: '#E0EEF3',
          100: '#CEE6F2',
          600: '#094559',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
