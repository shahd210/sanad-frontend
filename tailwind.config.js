/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FA',
          100: '#E1F3F5',
          200: '#B6E2E6',
          300: '#8ACCD4',
          400: '#4FAEB9',
          500: '#1F93A0',
          600: '#0E7C86', // SANAD Brand Teal
          700: '#0A5C63',
          800: '#073F44',
          900: '#05292C',
          DEFAULT: '#0E7C86',
        },
        emergency: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: [
          'Cairo',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(14, 124, 134, 0.08), 0 4px 16px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 8px 24px -4px rgba(14, 124, 134, 0.12), 0 6px 18px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
