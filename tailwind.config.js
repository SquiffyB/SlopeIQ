/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:           '#F2F2F0',
        surface:      '#FFFFFF',
        elevated:     '#E8E8E6',
        dark:         '#08090D',
        'dark-2':     '#12131A',
        'dark-3':     '#1C1E28',
        ink:          '#0D0E14',
        'ink-light':  '#EFEFED',
        muted:        '#52546A',
        'muted-2':    '#78798E',
        accent:       '#0057FF',
        'accent-dim': '#0044CC',
        'accent-lt':  '#E8EFFF',
        line:         'rgba(13,14,20,0.08)',
        'line-dark':  'rgba(239,239,237,0.10)',
      },
      fontFamily: {
        display: ["'Barlow Condensed'", 'Arial Narrow', 'sans-serif'],
        sans:    ["'Barlow'", 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif:   ["'Barlow'", 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%':           { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.6s ease-out both',
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
