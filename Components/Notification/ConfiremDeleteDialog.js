import { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { styled } from "@material-ui/core/styles";
import {ButtonWrapper,ButtonRed} from "../FormsUi/Button/ButtonNorm";

import theme from "../Theme";


import useConfirm from "../UiDialog/useConfirm";
import { Typography } from "@material-ui/core";


export default function AlertDialog(props) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);

    console.log(props.rowData);
  };

  const onDeleteProduct = (e) => {
    console.log(e);
    setOpen(false);
    props.onDeleteProduct(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleDelete = (item) => {
    console.log(item);
    confirm({
      content: <Typography variant="body1" >سيتم حذف {item.moassa.EtabNom}.</Typography>,
      confirmationButtonProps: { startIcon: <CheckIcon /> },
    })
      .then(() => props.onDeleteProduct(item))
      .catch(() => console.log("Deletion cancelled."));
  };
    return (
    <>
      <ButtonRed
        variant="outlined"
        color="secondary"
        aria-label="information Delete "
        onClick={() => handleDelete(props.rowData)}
      >
        <DeleteTwoToneIcon />
      </ButtonRed>
      {/* <ButtonWrapper variant="outlined"
              color="secondary"
              aria-label="information Delete " onClick={handleClickOpen}>
        <DeleteTwoToneIcon/>
      </ButtonWrapper> */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" >
          {"هل تريد فعلا حذف هذا العنصر ؟"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            {props.rowData&&props.rowData.moassa.EtabNom}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonWrapper color='secondary' variant="outlined" onClick={handleClose} startIcon={<CloseIcon />}>لا</ButtonWrapper><ThemeProvider theme={theme}>
          <ButtonWrapper color='secondary' onClick={onDeleteProduct}  startIcon={<CheckIcon />} autoFocus>
            نعم
          </ButtonWrapper></ThemeProvider>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
