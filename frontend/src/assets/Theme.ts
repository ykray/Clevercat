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
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: 'white',
          fontSize: '1rem',
          fontFamily: 'GilroySemibold',
          letterSpacing: '-0.1px',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: styles.color_green_500,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: styles.radius,
            minWidth: '0',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          paddingBottom: 200,
          backgroundColor: 'rgba(183, 188, 196, 0.65)',
          backdropFilter: 'blur(7px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          boxShadow: `0px 10px 20px ${styles.color_surface_500}`,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          minWidth: 250,
          backgroundColor: styles.color_surface_400,
          boxShadow: 'none',
          borderRadius: 9,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontFamily: 'GilroyBold',
          fontSize: '1rem',
          letterSpacing: '-0.3px',
          color: styles.color_muted_300,
          backgroundColor: styles.color_surface_400,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            fontSize: '1.1rem',
            color: styles.color_primary_500,
            backgroundColor: 'white',
            boxShadow: `0px 7px 7px rgba(0, 0, 0, 0.05)`,
            zIndex: 9999,
          },
          '&:hover': {
            '&.Mui-selected': {
              color: styles.color_primary_500,
              backgroundColor: 'white',
              boxShadow: `0px 7px 7px ${styles.color_primary_400}`,
              zIndex: 9999,
            },
            // color: styles.color_primary_500,
            backgroundColor: 'rgba(34, 122, 254, 0.08)',
            boxShadow: `none`,
            transition: styles.transition_enter,
          },
          borderRadius: 5,
          marginLeft: 7,
          marginRight: 7,
          marginTop: 4,
          marginBottom: 4,
          paddingLeft: 20,
          paddingTop: 7,
          paddingBottom: 7,
          fontFamily: 'GilroySemibold',
          fontSize: '1rem',
          color: styles.color_muted_500,
          backgroundColor: styles.color_surface_400,
          transition: styles.transition_exit,
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            '@media only screen and (max-width: 600px)': {
              fontSize: '1.4rem',
              width: '100%',
              paddingTop: 12,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
            },
            '&:hover': {
              border: `1.3px solid ${styles.color_primary_500}`,
              boxShadow: 'none',
            },
            paddingTop: 8,
            paddingBottom: 7,
            paddingLeft: 17,
            paddingRight: 17,
            border: `1.3px solid ${styles.color_primary_400}`,
            fontSize: '1rem',
            fontFamily: 'GilroySemibold',
            textTransform: 'none',
            borderRadius: styles.radius,
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            '@media only screen and (max-width: 600px)': {
              fontSize: '1.4rem',
              width: '100%',
              paddingTop: 12,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
            },
            '&:hover': {
              backgroundColor: styles.color_primary_500,
              boxShadow: 'none',
              opacity: 0.9,
            },
            paddingTop: 8,
            paddingBottom: 7,
            paddingLeft: 17,
            paddingRight: 17,
            border: `none`,
            fontSize: '1rem',
            fontFamily: 'GilroySemibold',
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: styles.radius,
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .Mui-error': {
            color: 'red',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
          fontSize: '1rem',
          fontWeight: 'normal',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: styles.radius,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontFamily: 'Roboto',
          fontWeight: 'normal',
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
  },
});

export default Theme;
