import React from 'react';
import { Button } from '@material-ui/core';

import Paper from '@material-ui/core/Paper'
import useStyles from '../StyleForm'
import { red } from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
const themebutton = createTheme({
  direction: "rtl",
  palette: {
    secondary: {
      main: red.A700,
    },
  },

  typography: {
    fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif"',
    h6: {
      fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif""',
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    body1: {
      fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif""',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
  },
});

export const ButtonWrapper = ({
  children,
  ...otherProps
}) => {
  
 const classes = useStyles()
  const configButton = {
    variant:"outlined",
    
    size:"medium",
    fullWidth: true,
    
    
    
    ...otherProps,
  }

  return (
    <Paper className={classes.buttonPapersubmit}>
    <Button
    
      {...configButton}
      className={classes.submit}
    >
      {children}
    </Button></Paper>
  );
};

export const ButtonRed = ({
  children,
  ...otherProps
}) => {
  const configButton = {
    variant:"outlined",
    
    size:"medium",
    fullWidth: true,
    
    
    
    ...otherProps,
  }
 

  return (
    <ThemeProvider theme={themebutton}>
    <ButtonWrapper {...configButton} >{children}</ButtonWrapper>
     </ThemeProvider>
  );
};
