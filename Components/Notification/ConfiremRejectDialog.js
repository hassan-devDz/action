import { useState } from "react";

import CheckIcon from "@material-ui/icons/Check";
import RedoIcon from "@material-ui/icons/Redo";
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

  const onReject = (e) => {
    console.log(e);
    setOpen(false);
    props.onReject(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleReject = (item) => {
    confirm({
      title: "سيتم حذف معلومات الأستاذ (ة) :",
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
        </Grid>
      ),
      confirmationButtonProps: { startIcon: <CheckIcon /> },
      cancellationButtonProps: { startIcon: <RedoIcon /> },
    })
      .then(() => props.onReject(item))
      .catch(() => console.log(" cancelled."));
  };
  return (
    <>
      <ButtonRed
        variant="text"
        color="secondary"
        aria-label="reject"
        //onClick={onRowEditInitconsol}
        size="small"
        onClick={() => handleReject(props.rowData)}
      >
        {props.children}
      </ButtonRed>
    </>
  );
}
