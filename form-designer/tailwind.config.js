// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: Array.from({ length: 12 }, (_, i) => `col-span-${i + 1}`),
  theme: { extend: {} },
  plugins: [],
};
