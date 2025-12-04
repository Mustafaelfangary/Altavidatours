'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0B2E4F', // Nile blue
      dark: '#061A2A',
      light: '#0B4871',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#D4AF37', // pharaonic gold accent
      dark: '#B8922E',
      light: '#F3D472',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: 'rgba(255,255,255,0.9)',
    },
    text: {
      primary: '#0a2833',
      secondary: '#42515a',
    },
    error: {
      main: '#c62828',
    },
    success: {
      main: '#1bae70',
    },
    info: {
      main: '#1baee1',
    },
  },
  components: {
    // Fix Material-UI TextField labels and text
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000 !important',
            fontWeight: 600,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1BAE70 !important',
          },
          '& .MuiOutlinedInput-root': {
            '& input': {
              color: '#000000 !important',
              fontWeight: 500,
            },
            '& textarea': {
              color: '#000000 !important',
              fontWeight: 500,
            },
          },
        },
      },
    },
    // Fix Material-UI FormControl labels
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000 !important',
            fontWeight: 600,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1BAE70 !important',
          },
        },
      },
    },
    // Fix Material-UI Select components
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
      },
    },
    // Fix Material-UI MenuItem text
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
      },
    },
    // Fix Material-UI Typography
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
        h1: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h2: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h3: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h4: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h5: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h6: {
          color: '#000000 !important',
          fontWeight: 700,
        },
      },
    },
    // Fix Material-UI FormControlLabel
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#000000 !important',
          fontWeight: 600,
        },
      },
    },
    // Fix Material-UI TableCell
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
        head: {
          color: '#000000 !important',
          fontWeight: 700,
        },
      },
    },
    // Fix Material-UI Button text
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '1.25rem',
          fontWeight: 700,
          padding: '14px 32px',
          background: 'linear-gradient(90deg, #0B2E4F 0%, #D4AF37 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 24px 0 rgba(11,46,79,0.15)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            background: 'linear-gradient(90deg, #D4AF37 0%, #0B2E4F 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 32px 0 rgba(11,46,79,0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0B2E4F 0%, #D4AF37 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #D4AF37 0%, #0B2E4F 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
          },
        },
      },
    },
    // Fix Material-UI Chip text
    MuiChip: {
      styleOverrides: {
        label: {
          color: '#000000 !important',
          fontWeight: 600,
        },
      },
    },
    // Fix Material-UI Dialog components
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff !important',
          backgroundImage: 'none !important',
          opacity: '1 !important',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#1BAE70 !important',
          color: '#ffffff !important',
          opacity: '1 !important',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff !important',
          opacity: '1 !important',
        },
      },
    },
    // Fix Material-UI Tab components
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#1BAE70 !important',
            fontWeight: 700,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '2rem',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px 0 rgba(10,35,66,0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '2rem',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px 0 rgba(10,35,66,0.25)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          overflow: 'hidden',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9) !important',
          backdropFilter: 'blur(8px) !important',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Inter',
      'Playfair Display',
      'serif',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 800,
      color: '#d4af37',
      letterSpacing: '0.04em',
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      color: '#ffe082',
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
      color: '#ffe082',
    },
    h4: {
      fontWeight: 600,
      color: '#ffe082',
    },
    h5: {
      fontWeight: 600,
      color: '#ffe082',
    },
    h6: {
      fontWeight: 600,
      color: '#ffe082',
    },
    body1: {
      color: '#ffffff',
    },
    body2: {
      color: '#ffe082',
    },
    button: {
      fontWeight: 700,
      color: '#0a2342',
    },
  },
});
