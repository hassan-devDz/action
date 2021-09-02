
import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  
  direction: 'rtl',
 
  palette: { 
    common:{
      main:"#2b50ed",
    },
    primary: {
       
      main: "#2b50ed",
      dark:"#3551c4",
      hover:"rgba(43, 80, 237, 0.21)",
      black:"#000",
      mainlight:'#babdf2',
      transparent:"#fff0",
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
      female:{
        _color:"#ca01ab",
        background_color:"rgba(202, 1, 171, 0.22)",}
    },
    default:{
        main:'#757ce8',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper:'#fff',
      default: '#ffffff',
      primary:"#2b50ed",
    },
  },
  spacing:8,
  typography: {
    fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", sans-serif',
  },
  transitions: {
    duration: {
      
      standard: 400,
      // this is to be used in complex animations
      complex: 1000,
     
    },
  }
});

export default theme;