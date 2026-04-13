import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        paper: "#F8FAFC",
        coral: "#F97316",
        cyan: "#06B6D4",
        gold: "#FBBF24",
        mist: "#D9E6F2"
      },
      boxShadow: {
        premium: "0 25px 60px -25px rgba(15, 23, 42, 0.4)"
      },
      backgroundImage: {
        "mesh-radial":
          "radial-gradient(circle at top left, rgba(6, 182, 212, 0.26), transparent 34%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.22), transparent 28%), linear-gradient(135deg, #020617 0%, #0F172A 48%, #111827 100%)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        rise: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0px)" }
        },
        shine: {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(150%)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        rise: "rise 0.7s ease-out forwards",
        shine: "shine 2.8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
