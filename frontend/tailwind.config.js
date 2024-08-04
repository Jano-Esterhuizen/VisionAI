module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false,
    theme: {
      extend: {
        colors: {
            primary: {
                light: '#7FFFD4', // A lighter shade of your green
                DEFAULT: '#40E0B0', // The green color from your logo
                dark: '#2EA98E', // A darker shade of your green
            },
          secondary: {
            light: '#ff8533',
            DEFAULT: '#ff6600',
            dark: '#cc5200',
          },
          background: '#f0f4f8',
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
        },
        fontFamily: {
          sans: ['Roboto', 'Arial', 'sans-serif'],
          heading: ['Poppins', 'Roboto', 'Arial', 'sans-serif'],
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  };