/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors - темно-синяя палитра
        dark: {
          bg: '#0a0e27',     // Темно-синий фон
          surface: '#141b3d', // Темно-синий для карточек
          border: 'rgba(100,150,255,0.15)',
          text: '#e0e5ff',
          'text-secondary': '#8891aa',
        },
        // Light theme colors  
        light: {
          bg: '#e0e0e0',      // Светло-серый фон
          surface: '#f5f5f5', // Еще светлее для карточек
          border: '#cbd5e0',  // Четкий серый бордер
          text: '#1a202c',    // Темно-серый, почти черный
          'text-secondary': '#4a5568', // Темнее для лучшей читаемости
        },
        // Accent colors
        primary: {
          DEFAULT: '#00d4ff',
          dark: '#0099ff',
          light: '#00b8e6',   // Немного темнее для светлой темы
        },
        success: '#10b981',   // Более приятный зеленый
        danger: '#ef4444',    // Более насыщенный красный
        warning: '#f59e0b',   // Янтарный желтый
        // TON colors
        ton: {
          blue: '#0088cc',
          dark: '#005580',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      backgroundColor: {
        'light-bg': '#e0e0e0',      // Светло-серый
        'light-surface': '#f5f5f5',  // Еще светлее
        'dark-bg': '#0a0e27',       // Темно-синий фон
        'dark-surface': '#141b3d',  // Темно-синий для элементов
      },
      textColor: {
        'light-text': '#1a202c',        // Темно-серый, почти черный
        'light-text-secondary': '#4a5568', // Средне-серый
        'dark-text': '#ffffff',
        'dark-text-secondary': '#8891aa',
      },
      borderColor: {
        'light-border': '#cbd5e0',  // Четкий серый
        'dark-border': 'rgba(255,255,255,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.6)' },
        },
        slideIn: {
          'from': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
