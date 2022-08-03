import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  typography: {
    // fontFamily: [
    //   'EB Garamond',
    //   'eb-garamond',
    //   'Garamond',
    //   'serif'
    // ].join(','),
    fontFamily: [
      'Jost',
      'futura-pt',
      'futura',
      'sans-serif'
    ].join(',')
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#35D07F'
    },
    secondary: {
      main: '#FBCC5C'
    }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #121212 inset',
            WebkitTextFillColor: '#000',
            transitionDelay: '999999s'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          borderRadius: '3px',
          // fontFamily: [
          //   'Jost',
          //   'futura-pt',
          //   'futura',
          //   'sans-serif'
          // ].join(','),
          color: '#FFF',
          fontWeight: '500',

        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF',
          boxShadow: 'none'
          // fontFamily: [
          //   'Jost',
          //   'futura-pt',
          //   'futura',
          //   'sans-serif'
          // ]
        }
      }
    },
    MuiToolBar: {
      styleOverrides: {
        root: {
          // backgroundColor: '#FFF'
          // fontFamily: [
          //   'Jost',
          //   'futura-pt',
          //   'futura',
          //   'sans-serif'
          // ].join(',')
        }
      }
    }
  }
});

export default theme;