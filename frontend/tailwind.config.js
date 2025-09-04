/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#eefaff',100:'#d9f3ff',200:'#b6e9ff',300:'#83dcff',400:'#40c8ff',500:'#0baeea',600:'#0089c2',700:'#006d9b',800:'#055a80',900:'#094b6a',950:'#062f44'
        }
      }
    }
  },
  plugins: []
};
