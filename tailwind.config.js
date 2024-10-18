/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*",
  ],
  theme: {
    extend: {
      colors:{
        Blue:"#489fb5",
      }
    },
  },
  plugins: [],
}

