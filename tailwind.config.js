module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'glitch': 'glitch 3s infinite',
        'scan': 'scan 10s linear infinite',
        'pulse': 'pulse 2s infinite',
      },
      keyframes: {
        glitch: {
          '0%': {
            textShadow: '0.05em 0 0 #00ff9d, -0.05em -0.025em 0 #ff00ff, -0.025em 0.025em 0 #00ffff'
          },
          '14%': {
            textShadow: '0.05em 0 0 #00ff9d, -0.05em -0.025em 0 #ff00ff, -0.025em 0.025em 0 #00ffff'
          },
          '15%': {
            textShadow: '-0.05em -0.025em 0 #00ff9d, 0.025em 0.025em 0 #ff00ff, -0.05em -0.05em 0 #00ffff'
          },
          '49%': {
            textShadow: '-0.05em -0.025em 0 #00ff9d, 0.025em 0.025em 0 #ff00ff, -0.05em -0.05em 0 #00ffff'
          },
          '50%': {
            textShadow: '0.025em 0.05em 0 #00ff9d, 0.05em 0 0 #ff00ff, 0 -0.05em 0 #00ffff'
          },
          '99%': {
            textShadow: '0.025em 0.05em 0 #00ff9d, 0.05em 0 0 #ff00ff, 0 -0.05em 0 #00ffff'
          },
          '100%': {
            textShadow: '-0.025em 0 0 #00ff9d, -0.025em -0.025em 0 #ff00ff, -0.025em -0.05em 0 #00ffff'
          }
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' }
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace']
      }
    },
  },
  plugins: [],
} 