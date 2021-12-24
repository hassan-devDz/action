import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { messages } from "../../../Components/Ui/Message/AllMssage";
import Link from "../../../Components/Ui/Link";
import { ButtonWrapper } from "../../../Components/FormsUi/Button/ButtonNorm";
import useStyles from "../../../Components/Ui/Css/Csslogin";
import { useUser } from "../../../middleware/Hooks/fetcher";
import ReCAPTCHA from "react-google-recaptcha";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Controls from "../../../Components/FormsUi/Control";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Container from "@material-ui/core/Container";
import CountdownCircle from "../../../Components/CompPage/CountdownCircleTimer";
import Image from "next/image";
import { useTimer } from "use-timer";
import { Button } from "@material-ui/core";
import Head from "next/head";
const INITIAL_FORM_STATE = {
  email: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email(messages.email).required(messages.required),
});
export default function ResetPassword() {
  const [user, { mutate }] = useUser();
  const router = useRouter();

  const classes = useStyles();
  const [bodyUser, setBodyUser] = useState("");

  const recaptchaRef = useRef({});

  const handleSubmit = useCallback(async (values) => {
    setBodyUser(values);
    recaptchaRef.current.reset();
    recaptchaRef.current.execute();
    //INITIAL_FORM_STATE.resetForm();

    //   actions.resetForm();
  }, []);

  const onReCAPTCHAChange = async (captchaCode) => {
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    //recaptchaRef.current.execute()
    //const token = await recaptchaRef.current.executeAsync()

    if (!captchaCode) {
      return;
    }

    const response = await fetch("/api/authusers/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bodyUser, captcha: captchaCode }),
    })
      .then(() => {
        router.push("/auth/verify-request");
      })
      .catch((error) => {
        console.log(error);
        console.log(`${error?.message} هناك خطأ ما` || "هناك خطأ ما");
      });
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>reset password</title>
      </Head>
      <Container maxWidth="sm">
        <Formik
          initialValues={{
            ...INITIAL_FORM_STATE,
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          <Form className={classes.form}>
            <Grid
              container
              spacing={2}
              style={{ height: "100%" }}
              alignContent="center"
            >
              {" "}
              <Grid item xs={12}>
                <Link href="/auth/login">
                  {" "}
                  <ButtonWrapper>عودة الى صفحة الدخول</ButtonWrapper>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Image
                  src="/signup/reset-password.svg"
                  alt="reset-password"
                  priority
                  width={718}
                  height={458}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  paragraph
                  component="p"
                  style={{ textAlign: "center", wordSpacing: 3 }}
                >
                  نسيت كلمة المرور
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  paragraph
                  component="p"
                  style={{ textAlign: "justify", wordSpacing: 3 }}
                >
                  أدخل عنوان البريد الإلكتروني لحسابك وسنرسل رابط التحقق لإعادة
                  تعيين كلمة المرور الخاصة بك.{" "}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controls.Textfield
                  id="email"
                  label="البريد الالكتروني"
                  name="email"
                  autoComplete="email"
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
              <Grid item xs={12} style={{ flex: 0 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="invisible"
                  hl="ar"
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={onReCAPTCHAChange}
                  badge="bottomleft"
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.Button
                  type="submit"
                  //className={classes.submit}
                  color="primary"
                >
                  إرسل رابط التحقق
                </Controls.Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Container>
    </>
  );
}
