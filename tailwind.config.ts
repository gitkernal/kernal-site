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
        bg:     '#EAF4EF',
        bg2:    '#FFFFFF',
        bg3:    '#DCEBE4',
        dark:   '#14201C',
        darkB:  '#243530',
        dark3:  '#1B2723',
        text:   '#16241F',
        mid:    '#5A6B64',
        light:  '#8A9A93',
        ghost:  '#B5C4BC',
        amber:  '#E2901E',
        amberL: '#F0A838',
        amberD: '#C97D12',
        sky:    '#4FB3CC',
        mint:   '#4A9E6B',
        green:  '#3C7E55',
        greenM: '#4A9E6B',
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
