import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        muted: "#64748b",
        line: "#d7dee8",
        panel: "#f7f9fc"
      }
    }
  },
  plugins: []
};

export default config;
