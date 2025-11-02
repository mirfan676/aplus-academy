// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#198754' }, // Bootstrap’s green
    secondary: { main: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
