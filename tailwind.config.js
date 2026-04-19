/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#0a0a0a",
          white: "#f4f4f0",
          cream: "#e8e8e3",
          yellow: "#facc15",
          blue: "#3b82f6",
          pink: "#ec4899",
          green: "#84cc16",
          orange: "#f97316",
          red: "#ef4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-white': '4px 4px 0px 0px rgba(244,244,240,1)',
      }
    },
  },
  plugins: [],
}
