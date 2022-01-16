import { useState, useCallback } from "react";

import CheckIcon from "@material-ui/icons/Check";
import RedoIcon from "@material-ui/icons/Redo";
import Controls from "../FormsUi/Control";
import { Formik, Form } from "formik";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { ButtonWrapper, ButtonRed } from "../FormsUi/Button/ButtonNorm";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import useConfirm from "../UiDialog/useConfirm";
import { Grid, Typography } from "@material-ui/core";
import { InputTextarea } from "hassanreact/inputtextarea";
import TextField from "@material-ui/core/TextField";

const INITIAL_FORM_STATE = {
  send: "",
};
export default function AlertDialog(props) {
  const confirm = useConfirm();
  const onApproved = (e) => {
    console.log(e);
    setOpen(false);
    props.onApproved(props.rowData);
  };
  const handelSubmit = (values) => {
    console.log(values, props.rowData);
    props.onSendDataToPernt(props.rowData, values);
  };
  const handleOpen = (item) => {
    confirm({
      content: (
        <Formik
          initialValues={{
            ...INITIAL_FORM_STATE,
            ...item,
          }}
          //validationSchema={FORM_VALIDATION}
          onSubmit={handelSubmit}
        >
          <Form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {` ارسال طلب الى رئيس المكتب لفتح التعديل على ملف الاستاذ ${item.firstName} ${item.lastName} .`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography subtitle1="body1" color="error">
                  {" "}
                  سبب التعديل :
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controls.Textfield
                  name="send"
                  fullWidth
                  id="outlined-multiline-static"
                  label="سبب التعديل"
                  multiline
                  aria-label="سبب التعديل"
                  rows={4}
                  variant="outlined"
                  placeholder="أذكر هنا سبب التعديل بدقة "
                />
                {/* <TextareaAutosize
              style={{ width: "100%", maxWidth: "100%", minWidth: "100%" }}
             
              
              minRows={6}
              
            /> */}
              </Grid>
              <Grid item xs={12} style={{ width: 0 }}>
                <Controls.Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  تسجيل حساب جديد
                </Controls.Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      ),

      confirmationButtonProps: { startIcon: <CheckIcon /> },
      cancellationButtonProps: { startIcon: <RedoIcon /> },
    })
      .then(handelSubmit)

      .catch(() => console.log(" cancelled."));
  };
  return (
    <>
      <ButtonWrapper
        variant="outlined"
        color="secondary"
        onClick={() => handleOpen(props.rowData)}
        disabled={!props.rowData?.approved}
        aria-label="send to boss"
      >
        {props.children}
      </ButtonWrapper>
    </>
  );
}
