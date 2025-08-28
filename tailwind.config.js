/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "beige-100": "#f5f1e9",
        "teal-800": "#1e3a5f",
        "green-900": "#1a3c34",
        "yellow-500": "#d4a017",
        "yellow-600": "#b38b14",
        "gold-300": "#b38b14",
        "emerald-700": "#2f5d4e",
        "cream-100": "#f9f5f0",
      },
    },
  },
  plugins: [],
};
