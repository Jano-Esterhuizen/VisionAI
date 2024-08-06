module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#48E0B7',
          DEFAULT: '#4FBDAE',
          dark: '#33b38e',
        },
        secondary: {
          light: '#ff8533',
          DEFAULT: '#ff6600',
          dark: '#cc5200',
        },
        other: {
          light: '#ff8533',
          DEFAULT: '#2A6D6C',
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

