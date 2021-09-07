import React from 'react';
import { Button } from '@material-ui/core';

import Paper from '@material-ui/core/Paper'
import useStyles from '../StyleForm'
const ButtonWrapper = ({
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

export default ButtonWrapper;
