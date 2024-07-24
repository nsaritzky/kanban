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
      "red-hover": "#FF9898",
    },
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "6px",
      lg: "8px",
      full: "9999px",
    },
    extend: {
      google: {
        "text-gray": "#3c4043",
        "button-blue": "#1a73e8",
        "button-blue-hover": "#5195ee",
        "button-dark": "#202124",
        "button-dark-hover": "#555658",
        "button-border-light": "#dadce0",
        "logo-blue": "#4285f4",
        "logo-green": "#34a853",
        "logo-yellow": "#fbbc05",
        "logo-red": "#ea4335",
      },
    },
  },
  plugins: [headlessUi],
} satisfies Config
