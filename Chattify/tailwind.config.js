/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightOrange: "#ffa500", // Custom light orange color
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
        },
        ".scrollbar-thin::-webkit-scrollbar-track": {
          "background-color": "#f5f5f5", // Light background
        },
        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          "background-color": "#ffa500", // Light orange thumb
          "border-radius": "10px",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
