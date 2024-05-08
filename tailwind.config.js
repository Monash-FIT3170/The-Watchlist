/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./imports/ui/**/*.{js,jsx,ts,tsx}",
    "./client/*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Configure your color palette here
        'purplish-grey': "#B5A6AB",
        'magenta': "#7B1450",
        'dark-magenta': "#410227",
        'off-white': "#E2DCDE",
        'smoky-black': "14110F",
        'dark': "#191919",
        'darker': "#101010",
        'darkest': "#000000",
      },
      boxShadow: {
        'nav': '0 0px 2px rgba(255, 255, 255, 0.4)',
        'nav-inner': 'inset 0 0px 4px rgba(255, 255, 255, 0.4)'
      }
    },
    
  },
  plugins: [],
}

