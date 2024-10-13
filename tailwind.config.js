/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./imports/ui/**/*.{js,jsx,ts,tsx}",
    "./client/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'purplish-grey': "#B5A6AB",
        'magenta': "#7B1450",
        'dark-magenta': "#410227",
        'off-white': "#E2DCDE",
        'smoky-black': "#14110F",
        'less-dark': "#252525",
        'dark': "#1C1C1C",
        'darker': "#101010",
        'darkest': "#000000",
        'grey': "#808080"
      },
      boxShadow: {
        'nav': '0 0px 2px rgba(255, 255, 255, 0.4)',
        'nav-inner': 'inset 0 0px 4px rgba(255, 255, 255, 0.4)'
      },
      height: {
        'custom': 'calc(100vh - 2rem)',
        '35vh': '35vh',
      },
      width: {
        '1/24': '4.166666%',
        '1/18': '5.555555%',
        '1/12': '8.333333%',
        '2/3': '66.666667%',
        '1/9': '11.111111%',
        '1/10': '10%',
        '1/8': '12.5%',
        '1/26': '3.846153846%'

      },
      keyframes: {
        moveDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(50vh)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        jiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        moveDown: 'moveDown 1.2s linear forwards',
        fadeIn: 'fadeIn 1s ease-in 1.2s forwards',
        jiggle: 'jiggle 0.3s ease-in-out infinite',
        fadeInDelayed: 'fadeIn 1.2s ease-in 1.6s forwards',
      },
      textShadow: {
        'custom': '8px 8px 15px rgba(0, 0, 0, 0.5)',
        },
        fontFamily: {
          anton: ['Anton', 'sans-serif'],
        },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3F3F3F",
            borderRadius: "20px",
          },
        },
        ".scrollbar-hidden": {
          "scrollbar-width": "none", /* Firefox */
          "-ms-overflow-style": "none",  /* Internet Explorer 10+ */
        },
        ".scrollbar-hidden::-webkit-scrollbar": {
          display: "none", /* Safari and Chrome */
        },
          '.text-shadow-custom': {
            'text-shadow': '20px 20px 20px rgba(0, 0, 0, 0.5)',
          }
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}