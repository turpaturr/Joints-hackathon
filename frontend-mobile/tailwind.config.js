/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  safelist: [
    'border-border',
    'border-primary',
    'border-[1.5px]',
  ],
  theme: {
    extend: {
      colors: {
        // Token Warna dari DESIGN.md
        primaryDark: '#074173',
        primary: '#1679AB',
        accentTeal: '#5DEBD7',
        accentLime: '#C5FF95',
        bgBase: '#F7FAFC',
        surface: '#FFFFFF',
        textPrimary: '#0B2436',
        textSecondary: '#5C7A91',
        border: '#DCE8F0',
        disabled: '#B8C5CE',
        danger: '#D64545',
      },
      fontFamily: {
        // Token Tipografi Poppins
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'full': '999px',
      }
    },
  },
  plugins: [],
};