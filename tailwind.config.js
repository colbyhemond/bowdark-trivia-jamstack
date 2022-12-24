const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'typoslab': ['"TypoSlab"', 'serif']
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"), 
    require("daisyui"),
    plugin(function ({ addBase }) {
      addBase({
        '@font-face': {
            fontFamily: 'TypoSlab',
            src: 'url(../public/fonts/TypoSlab_Irregular.otf)'
        }
      })
    }),
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontFamily: 'TypoSlab' },
        'h2': { fontFamily: 'TypoSlab' },
        'h3': { fontFamily: 'TypoSlab' },
      })
    })
  ],
  daisyui: {
    themes: [
      {
        "bowdark": {
          "primary": "#FBD504",
          "secondary": "#9B9FA5",
          "accent": "#F2F2F3",
          "neutral": "#4D5661",
          "base-100": "#212121",
          "info": "#3395D4",
          "success": "#49A446",
          "warning": "#FBA91C",
          "error": "#cb0967",
        }
      },
      "corporate", 
      "business",
      
    ],
    darkTheme: "bowdark",
  },
}
