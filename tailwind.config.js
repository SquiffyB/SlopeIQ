/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0b10',
        surface: '#12141c',
        'surface-2': '#181a24',
        coral: '#e8634a',
        'coral-dim': '#c75139',
        teal: '#4ecdc4',
        ink: '#f0f0ee',
        muted: '#8a8a9a',
        'muted-2': '#5d5d6b',
        line: 'rgba(255,255,255,0.07)'
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Outfit', 'system-ui', 'sans-serif']
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 99, 74, 0.0)' },
          '50%': { boxShadow: '0 0 0 12px rgba(232, 99, 74, 0.08)' }
        },
        'orb': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.55' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.05)', opacity: '0.7' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'orb': 'orb 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
