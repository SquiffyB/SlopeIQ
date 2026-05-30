/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:           '#F8FAFF',
        surface:      '#FFFFFF',
        elevated:     '#EEF2FA',
        ink:          '#090C14',
        muted:        '#455069',
        'muted-2':    '#697080',
        accent:       '#0057FF',
        'accent-dim': '#0044CC',
        'accent-lt':  '#EBF0FF',
        line:         'rgba(9,12,20,0.08)',
        'line-mid':   'rgba(9,12,20,0.14)',
        coral:        '#0057FF',
        teal:         '#38BDF8',
      },
      fontFamily: {
        sans:  ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        mono:  ["'Space Mono'", 'monospace'],
        serif: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%':           { transform: 'translateY(-6px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':   'fade-up 0.6s ease-out both',
        'bounce-dot':'bounce-dot 1.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
};
