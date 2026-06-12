import { createTheme } from '@mui/material/styles';

export const makeTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#1565C0',
        light: '#5E92F3',
        dark: '#003c8f',
        contrastText: '#fff',
      },
      secondary: {
        main: '#F57C00',
        light: '#FFB74D',
        dark: '#E65100',
        contrastText: '#fff',
      },
      background: isDark
        ? { default: '#0d1117', paper: '#161b22' }
        : { default: '#f0f2f5', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              backgroundColor: isDark ? '#1e2a3a' : '#f5f5f5',
              color: isDark ? '#5E92F3' : '#1565C0',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.5)'
              : '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });

export default makeTheme(false);
