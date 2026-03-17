/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          darkest: '#0F5132',
          dark: '#116149',
          default: '#1B7A5C',
          light: '#2EA886',
        },
        background: {
          main: '#0B0B0B',
          secondary: '#111111',
          card: '#1A1A1A',
          input: '#1F1F1F',
        },
        accent: {
          primary: '#2EA886',
          light: '#5ED4AE',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#E5E5E5',
          medium: '#9CA3AF',
          dark: '#374151',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
