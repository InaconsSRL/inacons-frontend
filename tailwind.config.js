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
      },
      boxShadow: {
        'neumorph': '1px 1px 0px #838787, -1px -1px 0px #939999',
      },
      colors: {
        loginLeftColor: '#03aa46', // azul
        loginLeftTextColor: '#1D457E',// azul mas fuerte
        loginRightColor: '#114486',   // verde
        loginRightTextColor: '#167746', // verde mas fuerte
        loginErrorTextColor: '#37ffff',
      },
    },
  },
  plugins: [],
}