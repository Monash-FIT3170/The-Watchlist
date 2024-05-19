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
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-webkit" : {
          scrollbarWidth : "thin",
          scrollbarColor : "rgb(31 29 29) white"
        },
        ".scrollbar-webkit" :{
          "&::-webitkit-scrollbar":{
            width : "10px",
            height: "10px"
          },
          "&::-webkit-scrollbar-button":{
            width: "10px",
            height: "10px"
          },
          "&::-webkit-scrollbar-track":{
            background:"white",
            "border-radius" : "50px",
          },
          "&::-webkit-scrollbar-thumb" :{
            backgroundColor: "rgb(31 41 55)",
            borderRadius: "50px",
            border: "1px solid white"
          }
        }
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
}