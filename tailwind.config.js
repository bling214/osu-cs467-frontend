/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#D73F09',
        'primary-fg': '#ffffff',
        background: 'var(--color-bg)',
        foreground: 'var(--color-fg)',
        secondary: 'var(--color-secondary)',
        'secondary-fg': 'var(--color-secondary-fg)',
        muted: 'var(--color-muted)',
        'muted-fg': 'var(--color-muted-fg)',
        card: 'var(--color-card)',
        'tag-bg': 'var(--color-tag-bg)',
        'tag-fg': 'var(--color-tag-fg)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        heading: ['Georgia', "'Times New Roman'", 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
