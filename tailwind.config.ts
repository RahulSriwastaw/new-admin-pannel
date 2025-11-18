import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D221A',
        panel: '#112C23',
        card: '#15362B',
        highlight: '#4EFF9B',
        text: '#E9F5EE',
        icon: '#A0C4B5'
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px'
      }
    },
  },
  plugins: [],
}

export default config