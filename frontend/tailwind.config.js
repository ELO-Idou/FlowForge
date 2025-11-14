/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          yellow: '#F5C842',
          yellowHover: '#E6B831',
          yellowLight: '#FFF4D6',
        },
        neutral: {
          darkest: '#0A0A0A',
          dark: '#1A1A1A',
          gray800: '#2A2A2A',
          gray700: '#404040',
          gray500: '#808080',
          gray300: '#B0B0B0',
          gray100: '#E0E0E0',
          white: '#FFFFFF',
        },
        accent: {
          steel: '#8A8D91',
          chrome: '#C0C3C7',
        },
        semantic: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
