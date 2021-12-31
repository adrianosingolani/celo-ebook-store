import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #121212 inset',
            WebkitTextFillColor: '#fff',
            transitionDelay: '999999s'
          }
        }
      }
    }
  }
});

export default theme;