/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      // Сюда переносим токены из Figma
      colors: {
        brand: {
          dark: '#1E1E24',
          primary: '#6366F1', // Например, ваш главный фиолетовый из Figma
          accent: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Основной шрифт проекта
      }
    },
  },
  plugins: [],
}
