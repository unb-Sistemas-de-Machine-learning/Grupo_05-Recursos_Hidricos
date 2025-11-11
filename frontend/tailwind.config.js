/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './login.html',
    './signup.html',
    './dashboard.html',
    './register.html',
    './series.html',
    './maps.html',
    './compare.html',
    './alerts.html',
    './reports.html',
    './tutorial.html',
    './profile.html',
    './src/**/*.{html,js,ts,tsx}',     // cobre parciais e scripts
    './src/partials/**/*.html',        // garante todas as parciais
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
  safelist: [
    // rings/bordas de validação
    'ring-2',
    'ring-emerald-400',
    'ring-rose-400',
    'border-emerald-400/70',
    'border-red-400/70',
    // barra de força da senha
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-lime-500',
    'bg-emerald-500',
    // textos condicionais (dark)
    'text-emerald-600',
    'text-rose-600',
    'dark:text-emerald-400',
    'dark:text-rose-400',
    // utilidades usadas em layout de dashboard/sidebar
    'has-sidebar',
    'sb-collapsed',
    'sr-only',
    'hidden',
  ],
  plugins: [],
};
