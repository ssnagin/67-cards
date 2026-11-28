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
      // Токены дизайна из 01_Design.figcraft — см. assets/css/main.css.
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        raised: 'var(--color-raised)',
        divider: 'var(--color-divider)',
        content: 'var(--color-text)',
        muted: 'var(--color-muted)',
        link: 'var(--color-link)',
        focus: 'var(--color-focus)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        blue: 'var(--color-blue)',
        magenta: 'var(--color-magenta)',
        brand: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
        },
      },
      fontFamily: {
        sans: ['Onest', 'sans-serif'],       // основной интерфейсный шрифт
        display: ['Unbounded', 'sans-serif'], // акцидентный (логотип, код комнаты, таймер)
      },
      borderRadius: {
        control: 'var(--radius-control)',
      },
    },
  },
  plugins: [],
}
