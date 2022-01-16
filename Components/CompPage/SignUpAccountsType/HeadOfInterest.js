import { Grid, InputAdornment, IconButton, Container } from "@material-ui/core";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  YupString,
  numStr,
  BasicStr,
  YupDate,
} from "../../YupValidation/YupFun";
import Controls from "../../FormsUi/Control";
import { useState, useEffect, useRef, useCallback } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Link from "../../Ui/Link";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { FormInfoInterestedSchema } from "../../../schemas/schemas_moassa";
import {
  subjects,
  _educationalPhase,
  postionChoiseExtended,
} from "../../../middleware/StudySubjects";
const INITIAL_FORM_STATE1 = {
  firstName: "", //الاسم
  lastName: "", //اللقب
  dateOfBirth: Controls.dateFormaNow(new Date().getTime() - 567993600000),

  employeeId: "",

  wilaya: null,

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
  dateOfBirth: YupDate(true, new Date().getTime() - 567993600000),

  wilaya: Yup.object({
    key: numStr(5),
    value: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
  //movemenType: BasicStr().nullable(),

  //phone: numStr(10),
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
async function putData(method, url, values) {
  const response = await axios({
    method: method,
    url: url,
    data: values,
  });

  return response;
}

const OfficeHead = (props) => {
  //console.log(FormInfoInterestedSchema);
  const [inputValueMaritalStatus, setInputValueMaritalStatus] = useState(""); //اختيار الحالة العائلية
  //اختيار الدرجة الحالية

  const [wilayaList, setWilayaList] = useState([]); // قائمة كل المديريات

  //!const [inputMovemenType, setInputMovemenType] = useState(""); //اختيار نوع الحركة خارج او داخل الولاية
  const [inputValueWilaya, setInputValueWilaya] = useState(""); //اختيار المديرية
  const [educationalValuePhase, setEducationalValuePhase] = useState(""); //الطور

  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef({});
  useEffect(() => {
    fetcher(`/api/getlistwilaya`) //طلب  المديرية  المعنية
      .then(function (response) {
        setWilayaList(response);
      })
      .catch((err) => {
        console.log(err);
      });
    // fetcher(`/api/getbaldia`) //طلب  البلدية المعنية
    //   .then(function (response) {
    //     setBaldiaList(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  const getValueWilaya = (event, newInputValue) => {
    /**
     *!احتيار المديرية
     */
    setInputValueWilaya(newInputValue);
  };

  const handleClickShowPassword = (e) => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handelSubmit = async (valusForm, fun) => {
    await recaptchaRef.current.reset();
    await recaptchaRef.current.execute();
    console.log(valusForm, fun);
    props.onSubmit(valusForm);
  };

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE1,
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
            <Controls.MaterialUIPickers
              name={"dateOfBirth"}
              label="تاريخ الميلاد"
              format="YYYY-MM-DD"
              defVlue={new Date().getTime() - 567993600000}
              max={new Date().getTime() - 567993600000}
              //views={["year", "month", "date"]}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controls.Textfield name="employeeId" label="رقم التعريف الوظيفي" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="wilaya"
              label="مديرية التربية"
              variant="outlined"
              inputValue={inputValueWilaya}
              onInputChange={getValueWilaya}
              options={wilayaList}
              getOptionLabel={(option) => {
                return option.value || "";
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
export default OfficeHead;
