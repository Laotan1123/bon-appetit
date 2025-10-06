/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#7A5B46',      // warm earthy brown (background)
          brownDark: '#644836',  // darker shade for gradients
          ivory: '#F5EFE6',      // off-white text
          beige: '#D4C2A6',      // muted beige accent
          gold: '#B8945E'        // muted gold accent
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};