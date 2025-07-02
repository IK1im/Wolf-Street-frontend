module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme colors (синхронизированы с ThemeContext)
        "light-bg": "#F0DAD5",
        "light-fg": "#424658",
        "light-accent": "#C56B62",
        "light-card": "#D9A69F",
        "light-border": "#6C739C",
        "light-brown": "#DEA785",
        "light-shadow": "#BABBB155",
        "light-nav-active": "#C56B62",
        "light-nav-text": "#424658",
        "light-nav-inactive": "#6C739C",
        "light-chart-stroke": "#C56B62",
        "light-chart-fill": "#D9A69F",

        // Dark theme colors (синхронизированы с ThemeContext)
        "dark-bg": "#1c1b1b",
        "dark-fg": "#f0f4f0",
        "dark-accent": "#81c784",
        "dark-card": "#1a1918",
        "dark-border": "#3e3c3a",
        "dark-brown": "#558b2f",
        "dark-shadow": "#00000080",
        "dark-nav-active": "#81c784",
        "dark-nav-text": "#f0f4f0",
        "dark-nav-inactive": "#848280",
        "dark-chart-stroke": "#81c784",
        "dark-chart-fill": "#1a1918",

        // Дополнительные цвета для специальных случаев
        warning: "#FFD600",
        error: "#ef4444",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
