import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:     '#EDE8DF',
        bg2:    '#E5DED0',
        bg3:    '#D8D0BE',
        dark:   '#141410',
        darkB:  '#2E2D26',
        dark3:  '#1A1A14',
        text:   '#1C1C17',
        mid:    '#6B6655',
        light:  '#9B9585',
        ghost:  '#C0BAA8',
        amber:  '#B87420',
        amberL: '#D4962E',
        green:  '#2A481A',
        greenM: '#3D6B28',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
