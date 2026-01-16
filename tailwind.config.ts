import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      'neon-blue': '#00f3ff',
      'neon-green': '#00ff41',
      'neon-pink': '#ff00ff',
      'neon-purple': '#bc13fe',
      'cyber-black': '#050505',
      'cyber-dark': '#0a0a0a',
      'cyber-gray': '#1a1a1a',
      'dark-slate': '#0f172a',
    },
    fontFamily: {
      sans: ['Share Tech Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      mono: ['Share Tech Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      display: ['Orbitron', 'sans-serif'],
    },
    extend: {
      animation: {
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0 -100vh' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }, 
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
}
export default config
