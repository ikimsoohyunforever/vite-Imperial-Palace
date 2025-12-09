/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // 极简黑白灰配色
          black: '#1a1a1a',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
        },
        animation: {
          'spin-slow': 'spin 1.5s linear infinite',
        }
      },
    },
    plugins: [],
  }