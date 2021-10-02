import {useState} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { styled } from "@material-ui/core/styles";
import ButtonWrapper from "../FormsUi/Button/ButtonNorm";
import theme from '../Theme';
import {ThemeProvider} from '@material-ui/core/styles';
const MyButton = styled(ButtonWrapper)({
  minWidth: 40,
  padding: "5px 6px",
});
export default function AlertDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log(props.rowData);
  };
const onDeleteProduct = (e) => {
  console.log(e,);
  setOpen(false);
  props.onDeleteProduct(props.rowData)
  
}
  const handleClose = (e) => {
   
    setOpen(false);
  };

  return (
    <>
      <MyButton variant="outlined"
              color="secondary"
              aria-label="information Delete " onClick={handleClickOpen}>
        <DeleteTwoToneIcon/>
      </MyButton>
      <Dialog
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
          <MyButton color='secondary' variant="outlined" onClick={handleClose} startIcon={<CloseIcon />}>لا</MyButton><ThemeProvider theme={theme}>
          <MyButton color='secondary' onClick={onDeleteProduct}  startIcon={<CheckIcon />} autoFocus>
            نعم
          </MyButton></ThemeProvider>
        </DialogActions>
      </Dialog>
    </>
  );
}