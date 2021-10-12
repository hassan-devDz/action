import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ButtonWrapper,ButtonRed} from '../FormsUi/Button/ButtonNorm';
import { red } from "@material-ui/core/colors";


const ConfirmationDialog = ({ open, options, onCancel, onConfirm, onClose }) => {
  const {
    title,
    description,
    content,
    confirmationText,
    cancellationText,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
  } = options;

  return (
    <Dialog fullWidth {...dialogProps} open={open} onClose={onClose}>
      {title && (
        <DialogTitle>{title}</DialogTitle>
      )}
      {content ? (
        <DialogContent>
          {content}
        </DialogContent>
      ) : (
        description && (
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
        )
      )}
      <DialogActions>
      
        <ButtonRed color="secondary" {...cancellationButtonProps}  onClick={onCancel}>
          {cancellationText}
        </ButtonRed>
        <ButtonWrapper color="secondary" {...confirmationButtonProps} onClick={onConfirm}>
          {confirmationText}
        </ButtonWrapper>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;