/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/{components,layouts,pages,plugins}/**/*.{js,vue,ts}",
    "./app/app.vue",
    "./app/error.vue",
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
        surface: 'var(--color-surface)',
        content: 'var(--color-text)',
        muted: 'var(--color-muted)',
        error: 'var(--color-error)',
        control: 'var(--color-control)',
        divider: 'var(--color-divider)',
        focus: 'var(--color-focus)',
        link: 'var(--color-link)',
        brand: {
          dark: 'var(--color-bg)',
          primary: 'var(--color-primary)', // Например, ваш главный фиолетовый из Figma
          accent: 'var(--color-accent)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Основной шрифт проекта
      }
    },
  },
  plugins: [],
}
