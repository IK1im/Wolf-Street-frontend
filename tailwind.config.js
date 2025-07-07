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
      keyframes: {
        'profile-menu-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'portfolio-fade': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'leftmenu-fade-in': {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'profile-menu': 'profile-menu-fade-in 0.22s cubic-bezier(.4,0,.2,1)',
        'portfolio-fade': 'portfolio-fade 0.5s cubic-bezier(.4,0,.2,1)',
        'leftmenu-fade-in': 'leftmenu-fade-in 0.5s cubic-bezier(.4,0,.2,1)',
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
