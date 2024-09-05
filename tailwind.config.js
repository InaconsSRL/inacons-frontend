/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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