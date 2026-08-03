export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        csir: {
          navy: '#1B3A7A',
          'navy-dark': '#0F2455',
          'navy-light': '#2A4F9F',
          'blue-light': '#93B8F5',
          'blue-bg': '#E8EFFE',
        }
      }
    },
  },
  plugins: [],
}