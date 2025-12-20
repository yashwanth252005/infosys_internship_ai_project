/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",     // soft blue
        secondary: "#16A34A",   // green
        accent: "#F59E0B",      // warm yellow
        background: "#F9FAFB",
        card: "#FFFFFF",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.08)",
        card: "0 6px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};