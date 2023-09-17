/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html"],
  theme: {
    screens: {
      lg: {'max':'1199.99px'},
      md: {'max':'991.99px'},
      sm: {'max':'767.99px'},
      xs: {'max':'479.99px'},
},
    extend: {
      backgroundImage: {
        gradient_linear: 'linear-gradient(94.59deg, #4923b4 2.39%, #e878cf 97.66%)',
      },
      fontFamily: {
        poppins:['Poppins', 'sans-serif'],
        montserrat:['Montserrat', 'sans-serif'],
      },
      colors:{
        livegrey: '#666768',
      },
    },
  },
  plugins: [],
}

