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
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
const INITIAL_FORM_STATE = {
  firstName: "", //الاسم
  lastName: "", //اللقب
  baldia: null, //البلدية
  workSchool: null, //مؤسسة العمل
  situation: null, //الوضعية
  EmployeeId: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  accept: false,
  points: 0, //النقاط
};
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
  EmployeeId: numStr(),
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
const FormInfoInterested = (props) => {
  const [baldiaList, setBaldiaList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [moassaList, setMoassaList] = useState([]);
  const [inputValueMoassa, setInputValueMoassa] = useState("");
  const [inputValueBaldia, setInputValueBaldia] = useState(""); //ادخال اسم البلدية
  const [postion, setPostion] = useState("");
  const recaptchaRef = useRef({});
  useEffect(() => {
    fetcher(`/api/getbaldia`) //طلب قائمة المؤسسات من خلال اختيار البلدية المعنية
      .then(function (response) {
        setBaldiaList(response);
      }).catch((err)=>{
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
  const handleClickShowPassword = (e) => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handelSubmit =async (valusForm,fun) => {
  //   const response = await fetch("/api/auth/callback/credentials", {
  //     method: "POST",
  //     body:  valusForm ,
  //    headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  // },
    
  //   });
    console.log(response);
   
  };
  const onReCAPTCHAChange = async (captchaCode) => {
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    //const token = await recaptchaRef.current.executeAsync()
    //console.log(token,captchaCode);
    if (!captchaCode) {
      return;
    }
    try {
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        body: JSON.stringify({ captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        // If the response is ok than show the success alert
        //router.push("/form");
        //setOpen(true);
      } else {
        // Else throw an error with the message returned
        // from the API
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      alert(`${error?.message} هناك خطأ ما` || "هناك خطأ ما");
    } finally {
      // Reset the hCaptcha when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      console.log(captchaCode);
    }
  };
  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
      }}
      //validationSchema={FORM_VALIDATION}
      onSubmit={props.onSubmit}
    >
      <Form >
      
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="firstName" label="الاسم" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="lastName" label="اللقب" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="EmployeeId" label="رقم التعريف الوظيفي" />
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
              onChange={onReCAPTCHAChange}
              badge="bottomleft"
            />
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
              <Link href="/login">لديك حساب؟ تسجيل الدخول</Link>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
export default FormInfoInterested;
