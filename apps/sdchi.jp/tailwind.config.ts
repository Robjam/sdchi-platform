/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./content/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7fdf0',
          100: '#eefbdc',
          200: '#dcf7b9',
          300: '#bfef84',
          400: '#a3e455',
          500: '#80b944',
          600: '#6ba037',
          700: '#568029',
          800: '#45661e',
          900: '#354d17',
        },
        secondary: {
          50: '#f2f8f1',
          100: '#e0f0dd',
          200: '#c1e1bc',
          300: '#8fc785',
          400: '#5da750',
          500: '#3b8236',
          600: '#2f6a2b',
          700: '#265422',
          800: '#1f431b',
          900: '#183616',
        },
        accent: {
          50: '#fffef0',
          100: '#fffcd1',
          200: '#fff8a3',
          300: '#fff165',
          400: '#ffe627',
          500: '#f5d400',
          600: '#d4b000',
          700: '#a88700',
          800: '#866a00',
          900: '#6d5600',
        },
        neutral: {
          50: '#fafaf8',
          100: '#f2f2ed',
          200: '#e8e8df',
          300: '#d4d4c5',
          400: '#b8b8a3',
          500: '#8f8f7a',
          600: '#6e6e5e',
          700: '#545449',
          800: '#3f3f38',
          900: '#2b2b25',
        },
        error: '#d84315',
        success: '#80b944',
        warning: '#f5d400',
        info: '#0288d1',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}