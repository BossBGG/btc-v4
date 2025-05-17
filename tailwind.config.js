/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],  daisyui: {
    themes: ["light", "dark", "purple-white"], // เพิ่มธีมที่ต้องการใช้
  },
};