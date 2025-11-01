/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zmigrowane z :root w flower.html
        'ui-bg': 'var(--ui-bg)',
        'ui-bg-2': 'var(--ui-bg-2)',
        'ui-ink': 'var(--ui-ink)',
        'ui-muted': 'var(--ui-muted)',
        'ui-border': 'var(--ui-border)',
        'ui-accent': 'var(--ui-accent)',
        'scene-bg': 'var(--scene-bg)',
        'hex-deep': 'var(--hex-deep)',
        'hex-cyan-1': 'var(--hex-cyan-1)',
        'hex-cyan-2': 'var(--hex-cyan-2)',
        'status-red': 'var(--status-red)',
        'status-orange': 'var(--status-orange)',
        'status-green': 'var(--status-green)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Ubuntu', 'Arial', 'sans-serif'],
      },
      // Dopasowanie do modala z flower.html
      boxShadow: {
        'modal': '0 24px 80px rgba(0,0,0,.6)',
      },
      borderColor: {
        'modal': 'var(--ui-accent)',
      }
    },
  },
  plugins: [],
}
