/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue"
  ],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      open: {
        50: "#D8FEF2",
        100: "#B0FCE4",
        200: "#08F7AB",
        300: "#07DE9A",
        400: "#06BC82",
        500: "#059669",
        600: "#04855C",
        700: "#047652",
        800: "#036344",
        900: "#024A33",
        950: "#012C1F"
      },

    },
  },
  plugins: [],
}
