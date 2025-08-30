/** @type {import('tailwindcss').Config} */

const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections("all"),
    }),
  ],
};
