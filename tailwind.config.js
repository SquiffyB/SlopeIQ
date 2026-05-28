/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F6F7',
        surface: '#FFFFFF',
        elevated: '#E8ECEE',
        coral: '#3898EC',
        'coral-dim': '#2270C7',
        teal: '#60A5FA',
        'score-gold': '#F5C842',
        ink: '#1F2025',
        muted: '#4B5A6A',
        'muted-2': '#64748B',
        line: 'rgba(31,32,37,0.10)',
      },
      fontFamily: {
        serif: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
