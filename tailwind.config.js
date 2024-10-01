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
        }
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}