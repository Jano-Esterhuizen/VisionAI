module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#40E0B0',
          dark: '#33b38e',
        },
        secondary: {
          light: '#ff8533',
          DEFAULT: '#ff6600',
          dark: '#cc5200',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};