/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'satisfy': ['Satisfy', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'selection': ['Selection', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'rounded': ['M PLUS Rounded 1c', 'sans-serif'],
      },
      boxShadow: {
        'neumorph': '1px 1px 0px #838787, -1px -1px 0px #939999',
      },
      colors: {
        loginLeftColor: '#002779', // azul
        loginRightColor: '#C7EBF6',   // verde
        loginLeftTextColor: '#00012F',// azul mas fuerte
        loginRightTextColor: '#00012F', // verde mas fuerte
        loginErrorTextColor: '#37ffff',
      }
    },
  },
  plugins: [],
}