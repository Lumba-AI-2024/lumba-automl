const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter", ...fontFamily.sans],
      },
      colors: {
        // blue: "#45aff6",
        // lightblue: "#19d7e4",
        blue: "#0e81a0",
        lightblue: "#0e81a0",
        darkblue: "#0079cf",
        // pink: "#ff758d",
        lighterpink: "#ff7eb2",
        lightpink: "#c72c41",
        pink: "#c72c41",
        darkgray: "#54595e",
        gray: "#abb5be",
        lightgray: "#f8f9fa",
        cancelgray: "#e9ecef",
        greencyan: "#37ecba",
        seagull: "#72afd3",
        redpink: "#FF7DAF",
        pinkpink: "#FF7EB3",
        lightpurple: "#667EEA",
        darkpurple: "#764BA2",
      },
      fontSize: {
        xs: "0.8rem",
      },
    },
  },
  plugins: [],
};
