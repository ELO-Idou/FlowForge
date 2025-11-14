export const designTokens = {
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
  typography: {
    fontFamily: {
      display: "'Inter', -apple-system, system-ui, sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSize: {
      hero: '3.75rem',
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
      tiny: '0.75rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
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
} as const;
