import { Grid } from "@material-ui/core";
import React from "react";
import { Formik, Form } from "formik";
import Controls from "../FormsUi/Control";

const INITIAL_FORM_STATE = {
  
  firstName: "", //الاسم
  lastName: "", //اللقب
  baldia: "", //البلدية
  workSchool: { EtabMatricule: null, EtabNom: null, bladia: null }, //مؤسسة العمل
  points: 0, //النقاط
  situation: "", //الوضعية
};
const FormInfoInterested = () => {
    const handelSubmit = (params) => {
        
    }
  return (
    <Formik
    initialValues={{
      ...INITIAL_FORM_STATE,
    }}
    //validationSchema={moassaSchema}
    onSubmit={handelSubmit}
  >
    <Form>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield type='text' name="firstName" label="الاسم" />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield type='text' name="lastName" label="اللقب" />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield  name="baldia" label="البلدية" />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield  name="workSchool" label="مؤسسة العمل" />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield type='number' name="points" label="النقطة" InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Controls.Textfield name="situation" label="الوضعية" />
      </Grid>
    </Grid></Form></Formik>
  );
};
export default FormInfoInterested;
