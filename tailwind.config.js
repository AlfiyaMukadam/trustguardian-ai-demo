/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#0052CC',
        critical: '#D32F2F',
        warning: '#F57C00',
        success: '#2E7D32',
        neutralBorder: '#E1E4E8',
        textPrimary: '#1F2933',
        textSecondary: '#6E7781',
        quantumAccent: '#6B5BFF',
        headerBlue: '#0174C3',
      },
      borderRadius: {
        enterprise: '8px',
      },
      spacing: {
        section: '24px',
        panel: '16px',
      },
      fontFamily: {
        sans: ['"Roboto Regular"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
