import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { messages } from "../../../Components/Ui/Message/AllMssage";
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
const INITIAL_FORM_STATE = {
  email: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email(messages.email).required(messages.required),
});
export default function resend() {
  const [user, { mutate }] = useUser();
  const router = useRouter();
  const [counter, setCounter] = useState(false);
  const [desble, setDesble] = useState(false);
  const classes = useStyles();
  const [bodyUser, setBodyUser] = useState("");

  const recaptchaRef = useRef({});
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 120,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: () => {
      setDesble(false);
      console.log("Time is over");
    },
  });
  const handleSubmit = useCallback(async (values) => {
    start();
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
    try {
      const response = await fetch("/api/authusers/resendtoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bodyUser, captcha: captchaCode }),
      });

      if (response.ok) {
        const userObj = await response.json();
        console.log(response, userObj);
        setCounter(false);
        setDesble(true);

        // If the response is ok than show the success alert
        //router.push("/form");
        //setOpen(true);
      } else {
      }
    } catch (error) {
      console.log(error);
      console.log(`${error?.message} هناك خطأ ما` || "هناك خطأ ما");
    } finally {
      // Reset the hCaptcha when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      //recaptchaRef.current.reset()
      //console.log(recaptchaRef);
    }
  };
  const onComplete = () => {
    router.push("/auth/verify-request");
    console.log(counter);
  };
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Container maxWidth="sm">
        <Button onClick={onComplete}>back</Button>

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
              <Grid item xs={12}>
                <Image src="/signup/Mail_sent.png" width={718} height={458} />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  paragraph
                  component="p"
                  style={{ textAlign: "justify", wordSpacing: 3 }}
                >
                  أدخل عنوان البريد الإلكتروني لحسابك وسنعيد ارسال رابط التحقق
                  لتفعيل حسابك. اتبع التعليمات لإكمال التسجيل .{" "}
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
                  disabled={desble}
                >
                  {desble
                    ? ` انتظر ثواني لاعادة الارسال${time}`
                    : "إرسل رابط التحقق"}
                </Controls.Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Container>
    </>
  );
}
