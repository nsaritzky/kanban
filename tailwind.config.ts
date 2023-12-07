import headlessUi from "@headlessui/tailwindcss"
import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      "main-purple": "#635FC7",
      "main-purple-hover": "#ABA4FF",
      black: "#000112",
      "very-dark-gray": "#20212C",
      "dark-gray": "#2B2C37",
      "lines-dark": "#3E3F4E",
      "medium-gray": "#828FA3",
      "lines-light": "#E4EBFA",
      "light-gray-light-bg": "#F4F7FD",
      white: "#FFFFFF",
      red: "#EA5555",
      "red-hover": "FF9898",
    },
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "6px",
      lg: "8px",
      full: "9999px",
    },
    extend: {},
  },
  plugins: [headlessUi],
} satisfies Config
