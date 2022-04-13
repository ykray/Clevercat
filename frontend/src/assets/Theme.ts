import { createTheme } from '@mui/material';
import styles from './sass/_variables.scss';

const Theme = createTheme({
  palette: {
    primary: {
      500: styles.color_primary_500,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 20,
    body1: {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        icon: {
          padding: 0,
          paddingLeft: 5,
        },
        root: {
          fontSize: '0.85rem',
          fontFamily: 'Roboto',
          fontWeight: 500,
          color: styles.color_text,
          backgroundColor: 'transparent',
          borderColor: styles.color_surface_500,
          borderWidth: '1.4px',
          borderRadius: 50,
          padding: 0,
          '@media only screen and (max-width: 600px)': {
            paddingLeft: 7,
            paddingRight: 7,
            paddingTop: 20,
            paddingBottom: 20,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          paddingTop: 9,
          paddingBottom: 9,
          paddingLeft: 20,
          paddingRight: 20,
          border: `2px solid ${styles.color_primary_400}`,
          fontSize: '1.1rem',
          fontFamily: 'GilroySemibold',
          textTransform: 'none',
          borderRadius: styles.radius,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginRight: -10,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltipPlacementRight: {
          left: -12,
        },
        arrow: {
          color: styles.color_primary_500,
        },
        tooltip: {
          fontSize: '0.9rem',
          paddingTop: 6,
          paddingBottom: 6,
          color: 'white',
          backgroundColor: styles.color_primary_500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default Theme;
