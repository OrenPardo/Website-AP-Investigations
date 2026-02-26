/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#d5d9e2',
        'surface-light': '#e4e7ed',
        'surface-dark': '#c0c5d0',
        card: '#ffffff',
        ink: '#1a1a1a',
        'ink-muted': '#4a4f5e',
        'ink-light': '#505664',
        'border-subtle': '#c0c5d0',
      },
      fontFamily: {
        sans: ['"Heebo"', 'sans-serif'],
      },
      fontWeight: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        600: '600',
        700: '700',
      },
    },
  },
  plugins: [],
}
