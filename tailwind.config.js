/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      colors: {
        // 复古工业风配色
        industrial: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2d2d2d',
          600: '#242424',
          500: '#3a3a3a',
          400: '#666666',
          300: '#888888',
        },
        neon: {
          green: '#00ff88',
          orange: '#ff6b35',
          red: '#ff3366',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 0.2s ease-in-out',
        'glow': 'glow 1s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88' },
          '100%': { boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88' },
        },
      },
    },
  },
  plugins: [],
}
