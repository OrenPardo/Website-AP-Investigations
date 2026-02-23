/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html'],
  theme: {
    extend: {
      colors: {
        surface: '#d5d9e2',
        'surface-light': '#e4e7ed',
        'surface-dark': '#c0c5d0',
        card: '#ffffff',
        ink: '#1a1a1a',
        'ink-muted': '#6b7080',
        'ink-light': '#9499a8',
        'border-subtle': '#c0c5d0',
      },
      fontFamily: {
        sans: ['"Heebo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
