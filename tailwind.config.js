/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0b10',
        surface: '#12141c',
        elevated: '#1a1d28',
        coral: '#e8634a',
        'coral-dim': '#d4522e',
        teal: '#4ecdc4',
        'score-gold': '#f5c842',
        ink: '#f0f0ee',
        muted: '#8a8a9a',
        'muted-2': '#4a4a5a',
        line: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'orb': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.55' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.06)', opacity: '0.7' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'orb': 'orb 8s ease-in-out infinite',
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
