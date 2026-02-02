/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: { 50: '#f0f9ff', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' }, // 科技蓝
          secondary: { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }, // 商务灰
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          surface: '#ffffff',
          background: '#f1f5f9',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }