import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: ["presets/**/*.{js,vue,ts}"],
  theme: {
    extend: {
      colors: {
        "base-white": "#ffffff",
        "base-black": "#000000",
        "base-secondary": "#fafafa",
        "base-tertiary": "#f4f4f4",
        "base-blue": "#546fff",
        "base-blue-hover": "#2f4df5",
        "base-gray": "#d1d1d1",
        "base-active": "#000000",
        "base-inactive": "#aaadcd",

        "app-primary": "#0a1b99",
        "app-secondary": "#ffffff",
        "app-tertiary": "#6366f1",
        "app-gold": "#cd8324",

        "app-primary-focus": "#0c21bf",
        "app-tertiary-focus": "#4e50be",

        "app-severity-success": "#57f000",
        "app-severity-info": "#2cccff",
        "app-severity-warn": "#ffb302",
        "app-severity-error": "#fe3839",
        "app-severity-buy": "#57f000",

        /* PrimeVue preset colors */
        "primary-50": "rgb(var(--primary-50))",
        "primary-100": "rgb(var(--primary-100))",
        "primary-200": "rgb(var(--primary-200))",
        "primary-300": "rgb(var(--primary-300))",
        "primary-400": "rgb(var(--primary-400))",
        "primary-500": "rgb(var(--primary-500))",
        "primary-600": "rgb(var(--primary-600))",
        "primary-700": "rgb(var(--primary-700))",
        "primary-800": "rgb(var(--primary-800))",
        "primary-900": "rgb(var(--primary-900))",
        "primary-950": "rgb(var(--primary-950))",
        "surface-0": "rgb(var(--surface-0))",
        "surface-50": "rgb(var(--surface-50))",
        "surface-100": "rgb(var(--surface-100))",
        "surface-200": "rgb(var(--surface-200))",
        "surface-300": "rgb(var(--surface-300))",
        "surface-400": "rgb(var(--surface-400))",
        "surface-500": "rgb(var(--surface-500))",
        "surface-600": "rgb(var(--surface-600))",
        "surface-700": "rgb(var(--surface-700))",
        "surface-800": "rgb(var(--surface-800))",
        "surface-900": "rgb(var(--surface-900))",
        "surface-950": "rgb(var(--surface-950))",
      },
      aspectRatio: {
        thumbnail: "3 / 4",
        package: "5 / 6",
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        scaling: "scaling 1s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        scaling: {
          "0%": { scale: "1" },
          "50%": { scale: "1.05" },
        },
      },
    },
  },
};
