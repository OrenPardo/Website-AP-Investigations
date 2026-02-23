/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#1a2e44',
        'primary-dark': '#0f1d2e',
        'primary-light': '#2a4a6b',
        accent: '#b8960c',
        'accent-hover': '#a07e08',
        'section-gray': '#f5f6f8',
        'text-main': '#1a2e44',
        'text-muted': '#5a6a7a',
        'border-light': '#e2e6ea',
      },
      fontFamily: {
        sans: ['"Heebo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
