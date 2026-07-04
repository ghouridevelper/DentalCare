/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F5",
        ink: "#12211F",
        teal: {
          DEFAULT: "#0F5257",
          dark: "#0A3B3F",
          light: "#E4EFEE",
        },
        sage: "#9FC4BE",
        coral: {
          DEFAULT: "#FF6B54",
          dark: "#E8523C",
        },
        muted: "#5C6E6B",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      keyframes: {
        pulseLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        pulseLine: "pulseLine 2.4s ease-out forwards",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
