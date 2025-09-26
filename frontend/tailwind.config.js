/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: '#FF9900',
        azure: '#0089D6',
        gcp: '#4285F4',
        gray: {
          850: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}