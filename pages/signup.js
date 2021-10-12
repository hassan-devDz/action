import Link from "../Components/Ui/Link";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Formik, Form, useFormik } from "formik";
import * as Yup from "yup";
import { nanoid } from "nanoid";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";

import ReCAPTCHA from "react-google-recaptcha";
import Router, { useRouter } from "next/router";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UAParser from "ua-parser-js";
import Controls from "../Components/FormsUi/Control";
import DividerWithText from "../Components/Ui/DividerWithText";

import useWindowSize from "../Components/Hooks/windowSize";

import useStyles from "../Components/Ui/Css/Csslogin";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
  accept: false,

  passwordConfirmation: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("هذا الحقل مطلوب"),

  password: Yup.string()
    .min(8, "يجب عليك ادخال 8 أحرف على الأقل")
    .required("هذا الحقل مطلوب"),
  accept: Yup.boolean()
    .oneOf([true], "بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة .")
    .required("بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة ."),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمة السر غير مطابقة")
    .required("يرجى تأكيد كلمة السر"),
});

export default function SignUp() {
  const router = useRouter();
  const arr = { ...["a", "b"] };
  const size = useWindowSize();
  const infoDevise = { ...new UAParser().getResult(), ...size };
  const [email, setEmail] = useState("");
  const recaptchaRef = useRef({});
  const classes = useStyles();
  const [createUser, setCreateUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const sumbitUser = (values, actions) => {
    const { passwordConfirmation, ...INITIAL_FORM_STATE1 } = values;
    setCreateUser({
      idUser: nanoid(),
      ...INITIAL_FORM_STATE1,
      dateCreateAccount: Date(),
      infoDevise,
    });

    console.log(
      { ...values, idUser: nanoid(), dateCreateAccount: Date() },
      actions,
      createUser,
      "recaptchaRef",
      recaptchaRef
    );
    recaptchaRef.current.execute();
    //INITIAL_FORM_STATE.resetForm();
    //actions.resetForm()
  };
  Router.events.on("routerChangeStart", () => {
    console.log("start");
  });
  Router.events.on("routerChangeComplete", () => {
    console.log("Complete");
  });
  const onReCAPTCHAChange = async (captchaCode) => {
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    //const token = await recaptchaRef.current.executeAsync()
    //console.log(token,captchaCode);
    if (!captchaCode) {
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...createUser, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        // If the response is ok than show the success alert
        router.push("/form");

        setOpen(true);
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
      setEmail("");
    }
  };
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="section" className={classes.selfAlin}>
      <Grid container justifyContent="center" className={classes.fr}>
        <Grid item xs={false} sm={false} md={6} className={classes.image}>
          <Image
            src="/signup/back_to_school.svg"
            alt="صفحة التسجيل"
            width={718}
            height={458}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          elevation={6}
          className={classes.paper}
        >
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.dokhol}>
            سجل مجانا
          </Typography>
          <Grid
            container
            justifyContent="space-between"
            className={classes.goolface}
          >
            <Grid item xs={12} sm={5} md={5}>
              <Paper elevation={2} className={classes.buttonPaper}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  className={classes.button}
                  startIcon={
                    <Image src="/signup/google.svg" width={20} height={20} />
                  }
                >
                  تسجيل عبر جوجل
                </Button>
              </Paper>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item item xs={12} sm={5} md={5}>
              <Paper elevation={2} className={classes.buttonPaper}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  className={classes.button}
                  startIcon={
                    <Image src="/signup/facebook.svg" width={20} height={20} />
                  }
                >
                  تسجيل عبر فيسبوك
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <DividerWithText>
            أو يمكنك التسجيل عبر البريد الإلكتروني
          </DividerWithText>

          <Formik
            initialValues={{
              ...INITIAL_FORM_STATE,
            }}
            validationSchema={FORM_VALIDATION}
            onSubmit={sumbitUser}
          >
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    hl="ar"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onReCAPTCHAChange}
                    badge="bottomleft"
                  />
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
                    label="كلمة السر"
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
                  <Controls.CheckboxWrapper name="accept" />
                </Grid>
              </Grid>

              <Controls.Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                تسجيل حساب جديد
              </Controls.Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login">لديك حساب؟ تسجيل الدخول</Link>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Grid>
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"جاري التسجيل في المنصة"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            إنتظر لحظات حتى يتم تأكيد التسجيل في المنصة
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
