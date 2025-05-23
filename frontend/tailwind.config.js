/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Poppins', 'sans-serif'],
        },
        gridTemplateColumns: {
          '70/30': '70% 28%',
        },
        animation: {
          scroll: "scroll 60s linear infinite",
        },
        keyframes: {
          scroll: {
            "0%": { transform: "translateX(0%)" },
            "100%": { transform: "translateX(-50%)" },
          },
        },
      },
    },
    plugins: [],
  }
  