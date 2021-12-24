import { Grid, InputAdornment, IconButton, Container } from "@material-ui/core";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { YupString, numStr, BasicStr } from "../YupValidation/YupFun";
import Controls from "../FormsUi/Control";
import { useState, useEffect, useRef } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Link from "../Ui/Link";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { FormInfoInterestedSchema } from "../../schemas/schemas_moassa";

const INITIAL_FORM_STATE = {
  firstName: "", //الاسم
  lastName: "", //اللقب
  employeeId: "",
  baldia: null, //البلدية
  workSchool: null, //مؤسسة العمل
  situation: null, //الوضعية
  educationalPhase: null, //الطور
  email: "",
  password: "",
  passwordConfirmation: "",
  accept: false,

  //points: 0, //النقاط
};
const { captcha, ...valide } = FormInfoInterestedSchema;

const FORM_VALIDATION = Yup.object().shape({
  firstName: YupString(3).trim(), //الاسم
  lastName: YupString(3).trim(), //اللقب
  baldia: BasicStr().nullable(),
  workSchool: Yup.object({
    EtabMatricule: numStr(8),
    EtabNom: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
  situation: BasicStr().nullable(),
  educationalPhase: BasicStr().nullable(),
  employeeId: numStr(),
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("هذا الحقل مطلوب"),

  password: Yup.string()
    .min(8, "يجب عليك ادخال 8 أحرف على الأقل")
    .required("هذا الحقل مطلوب"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمة السر غير مطابقة")
    .required("يرجى تأكيد كلمة السر"),
  accept: Yup.boolean()
    .oneOf([true], "بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة .")
    .required("بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة ."),
});

const fetcher = async (url, param = "") => {
  const res = await axios.get(url, {
    params: {
      ...param,
    },
  });
  const data = await res.data;

  return data;
};
const postionChoise = ["راغب", "مجبر", "فائض"];
const _educationalPhase = ["ابتدائي", "متوسط", "ثانوي"];
const FormInfoInterested = (props) => {
  console.log(FormInfoInterestedSchema);
  const [baldiaList, setBaldiaList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [moassaList, setMoassaList] = useState([]);
  const [inputValueMoassa, setInputValueMoassa] = useState("");
  const [inputValueBaldia, setInputValueBaldia] = useState(""); //ادخال اسم البلدية
  const [postion, setPostion] = useState("");
  const [educationalPhase, setEducationalPhase] = useState("");
  const recaptchaRef = useRef({});
  useEffect(() => {
    fetcher(`/api/getbaldia`) //طلب قائمة المؤسسات من خلال اختيار البلدية المعنية
      .then(function (response) {
        setBaldiaList(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getValueBaldia = (event, newInputValue) => {
    console.log(newInputValue);
    setInputValueBaldia(newInputValue);
    setInputValueMoassa("");
    setMoassaList([]);
    if (baldiaList.includes(newInputValue)) {
      fetcher(`/api/getworkSchool`, { bladia: newInputValue }) //طلب قائمة المؤسسات من خلال اختيار البلدية المعنية
        .then(function (response) {
          console.log(response);
          setMoassaList(response.bladia);
        });
    }
  };
  const getValueMoassa = (event, newInputValue) => {
    setInputValueMoassa(newInputValue);
  };
  const getValuePostion = (event, newInputValue) => {
    setPostion(newInputValue);
  };
  const getValueEducationalPhase = (event, newInputValue) => {
    setEducationalPhase(newInputValue);
  };
  const handleClickShowPassword = (e) => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handelSubmit = async (valusForm, fun) => {
    recaptchaRef.current.reset();
    recaptchaRef.current.execute();
    console.log(valusForm);
    props.onSubmit(valusForm);
    //   const response = await fetch("/api/auth/callback/credentials", {
    //     method: "POST",
    //     body:  valusForm ,
    //    headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // },

    //   });
  };

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handelSubmit}
    >
      <Form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="firstName" label="الاسم" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="lastName" label="اللقب" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="employeeId" label="رقم التعريف الوظيفي" />
          </Grid>
          <Grid item xs={12} sm={6} elevation={6}>
            <Controls.AutocompleteMui
              name="situation"
              label="الوضعية"
              variant="outlined"
              inputValue={postion}
              onInputChange={getValuePostion}
              options={postionChoise}
            />
          </Grid>
          <Grid item xs={12} sm={6} elevation={6}>
            <Controls.AutocompleteMui
              name="educationalPhase"
              label="الطور"
              variant="outlined"
              inputValue={educationalPhase}
              onInputChange={getValueEducationalPhase}
              options={_educationalPhase}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="baldia"
              label="البلدية"
              variant="outlined"
              inputValue={inputValueBaldia}
              onInputChange={getValueBaldia}
              options={baldiaList}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="workSchool"
              label="مؤسسة العمل"
              loading
              loadingText={"في الانتظار"}
              inputValue={inputValueMoassa}
              onInputChange={getValueMoassa}
              options={moassaList || []}
              getOptionLabel={(option) => {
                return option.EtabNom || "";
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Controls.Textfield
              id="email"
              label="البريد الالكتروني"
              name="email"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="email">
                      <AlternateEmailIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controls.Textfield
              autoFocus={false}
              name="password"
              label="كلمة السر"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controls.Textfield
              name="passwordConfirmation"
              label="تأكيد كلمة السر"
              type={showPassword ? "text" : "password"}
              id="passwordConfirmation"
              autoComplete="off"
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              hl="ar"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={props.onReCAPTCHAChange}
              badge="bottomleft"
            />
          </Grid>
          <Grid item xs={12}>
            <Controls.CheckboxWrapper name="accept" />
          </Grid>
          <Grid item xs={12}>
            <Controls.Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              تسجيل حساب جديد
            </Controls.Button>
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end">
            <Grid item>
              <Link href="/auth/login">لديك حساب؟ تسجيل الدخول</Link>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
export default FormInfoInterested;
