/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "about-values-img": "url('https://static.tastykitchen.vn/images/pc/bg-about.jpg')",
      },
      screens: {
        bmd: "567px",
        md: "770px",
        screen_1084: "1084px",
      },
      boxShadow: {
        1: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        "img-food-detail": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        orderItem: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
      },
      colors: {
        "pink-red": "rgb(245, 245, 220)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      fontFamily: {
        yummy: ["YummyFoodies", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
