/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        onyx: {
          950: '#0a0a0f',
          900: '#12121a',
          800: '#1a1a24',
          700: '#22222e',
        },
        'neon-blue': '#00d4ff',
        'neon-red': '#ff3366',
        'neon-white': '#ffffff',
      },
      animation: {
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-red': '0 0 20px rgba(255, 51, 102, 0.3)',
      },
    },
  },
  plugins: [],
}
