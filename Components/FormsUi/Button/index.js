import React from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';
import Paper from '@material-ui/core/Paper'
import useStyles from '../StyleForm'
const ButtonWrapper = ({
  children,
  ...otherProps
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
    
  }
 const classes = useStyles()
  const configButton = {
    variant: 'contained',
    type:'submit',
    size:"large",
    fullWidth: true,
    
    
    onSubmit: handleSubmit,
    ...otherProps,
  }

  return (
    <Paper className={classes.buttonPapersubmit}>
    <Button
    className={classes.submit}
      {...configButton}
    >
      {children}
    </Button></Paper>
  );
};

export default ButtonWrapper;
