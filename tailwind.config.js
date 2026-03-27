/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'bebas': ['"Nunito"', 'sans-serif'],
      },
      colors: {
        'bg-app':         '#FFFDF5',
        'bg-card':        '#FFFFFF',
        'accent-green':   '#4CAF50',
        'accent-yellow':  '#FFD600',
        'accent-orange':  '#FF8C00',
        'accent-red':     '#FF4444',
        'text-primary':   '#2D3A1A',
        'text-secondary': '#6B8050',
        'text-muted':     '#A0B080',
        'success':        '#4CAF50',
        'warning':        '#FFD600',
        'danger':         '#FF4444',
      },
    },
  },
  plugins: [],
}
