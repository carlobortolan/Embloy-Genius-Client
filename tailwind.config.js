/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'embloy-green': '#99F7CB',
        'embloy-blue': '#99FFFF',
        'embloy-purple': '#3F3356',
        'embloy-purple-light': '#987ACF',
        'embloy-purple-lighter': '#C9B3FF'
      }
    },
  },
  plugins: [],
}
