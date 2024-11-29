import type { Config } from "tailwindcss";

export const breakpoints = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica", "sans-serif"],
      },
    },
    screens: Object.fromEntries(
      Object.entries(breakpoints).map(([key, value]) => [
        key,
        value.toString() + "px",
      ])
    ),
  },
  plugins: [],
};

export default config;
