module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme colors (синхронизированы с ThemeContext)
        'light-bg': '#f4f6fb',
        'light-card': '#f9fafb',
        'light-border': '#e0e6ed',
        'light-fg': '#3a3a4d',
        'light-fg-secondary': '#6e7287',
        'light-accent': '#6c63ff',
        'light-success': '#3ecf8e',
        'light-error': '#ff5c8a',
        'light-brown': '#e9eafc',
        'light-shadow': '#e0e6ed55',
        'light-nav-active': '#6c63ff',
        'light-nav-text': '#3a3a4d',
        'light-nav-inactive': '#6e7287',
        'light-chart-stroke': '#6c63ff',
        'light-chart-fill': '#e9eafc',
        // Dark theme colors (синхронизированы с ThemeContext)
        "dark-bg": "#1c1b1b",
        "dark-fg": "#f0f4f0",
        "dark-accent": "#81c784",
        "dark-card": "#1a1918",
        "dark-border": "#3e3c3a",
        "dark-brown": "#a0a4ac ",
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
