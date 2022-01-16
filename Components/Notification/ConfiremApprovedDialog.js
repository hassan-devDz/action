import { useState } from "react";

import CheckIcon from "@material-ui/icons/Check";
import RedoIcon from "@material-ui/icons/Redo";
import Alert from "@material-ui/lab/Alert";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { ButtonWrapper, ButtonRed } from "../FormsUi/Button/ButtonNorm";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import useConfirm from "../UiDialog/useConfirm";
import { Typography } from "@material-ui/core";
import { dateFormaNow } from "../FormsUi/DatePicker";
export default function AlertDialog(props) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);

    console.log(props.rowData);
  };

  const onApproved = (e) => {
    console.log(e);
    setOpen(false);
    props.onApproved(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleApproved = (item) => {
    confirm({
      title: <>سيتم قبول معلومات الأستاذ (ة) :</>,
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              name="firstName"
              label="الاسم"
              value={item.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={item.lastName}
              name="lastName"
              label="اللقب"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={dateFormaNow(item.createdAt)}
              name={"createdAt"}
              label="تاريخ التسجيل"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={dateFormaNow(item.dateOfBirth)}
              name={"dateOfBirth"}
              label="تاريخ الميلاد"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={item.employeeId}
              name="employeeId"
              label="رقم التعريف الوظيفي"
            />
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={item.specialty}
              name="specialty"
              label="مادة التدريس"
            />
          </Grid>
          <Grid item xs={12} sm={6} elevation={6}>
            <TextField
              fullWidth
              variant="outlined"
              value={item.situation}
              name="situation"
              label="الوضعية"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              value={item.email}
              label="البريد الالكتروني"
              name="email"
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              تنبيه : بمجرد تأكيد الحساب فإنه لايمكنك تعديله ولا حذفه وسيظهر
              مباشر لدى رئيس المكتب .
            </Alert>
          </Grid>
        </Grid>
      ),

      confirmationButtonProps: { startIcon: <CheckIcon /> },
      cancellationButtonProps: { startIcon: <RedoIcon /> },
    })
      .then(() => props.onApproved(item))
      .catch(() => console.log(" cancelled."));
  };
  return (
    <>
      <ButtonWrapper
        variant="text"
        color="secondary"
        aria-label="approved"
        //onClick={onRowEditInitconsol}
        size="small"
        onClick={() => handleApproved(props.rowData)}
      >
        {props.children}
      </ButtonWrapper>
    </>
  );
}
