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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Image from "next/image";
import { useTimer } from "use-timer";

const INITIAL_FORM_STATE = {
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  password: Yup.string()
    .min(8, messages.minlength(8))
    .required(messages.required),
});

export function ErrorComp() {
  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100%" }}
      alignContent="center"
    >
      <Grid item xs={12}>
        <Image src="/signup/401-error.svg" width={600} height={600} />
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          paragraph
          component="p"
          style={{ textAlign: "center", wordSpacing: 3 }}
        >
          رمز التحقق خاطئ أو انتهت صلاحيتة
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Link href="/auth/login">
          <ButtonWrapper>عودة الى صفحة الدخول </ButtonWrapper>
        </Link>
      </Grid>
    </Grid>
  );
}

function getToken({ valid, token }) {
  const router = useRouter();
  const recaptchaRef = useRef({});
  const [user, { mutate }] = useUser();
  const classes = useStyles();
  const [dataUser, setDataUser] = useState("");
  const [bodyUser, setBodyUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 10,
    timerType: "DECREMENTAL",
    endTime: 1,
    onTimeOver: () => {
      router.push("/auth/login");
    },
  });
  const handleSubmit = useCallback(async (values) => {
    recaptchaRef.current.reset();
    recaptchaRef.current.execute();
    setDataUser({ ...values, token });
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
      const response = await fetch("/api/authusers/auth/verifypass/newpass", {
        method: "PUT",
        body: JSON.stringify({ ...dataUser, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setBodyUser(true);
        start();

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
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  console.log(valid, token);
  return (
    <>
      {bodyUser ? (
        <Container maxWidth="sm">
          <Grid
            container
            spacing={2}
            style={{ height: "100%" }}
            alignContent="center"
          >
            <Grid item xs={12}>
              <Image src={"/signup/ok-animate.svg"} width={600} height={600} />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                paragraph
                component="p"
                style={{ textAlign: "center", wordSpacing: 3 }}
              >
                تم تغيير كلمة المرور بنجاح يمكنك الأن الدخول الى المنصة
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                paragraph
                component="p"
                style={{ textAlign: "center", wordSpacing: 3 }}
              >
                سيتم توجهيك الى صفحة الدخول بعد
                <span style={{ color: "red" }}> {time} </span>ثواني .
              </Typography>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container maxWidth="sm">
          {valid ? (
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
                    <Image
                      src="/signup/ok-animate.svg"
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
                      إعادة تعيين كلمة المرور
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      paragraph
                      component="p"
                      style={{ textAlign: "center", wordSpacing: 3 }}
                    >
                      أدخل كلمة مرور جديدة لحسابك .
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controls.Textfield
                      name="password"
                      label="كلمة المرور الجديدة"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      InputProps={{
                        // <-- This is where the toggle button is added.
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
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
                  <Grid item xs={12}></Grid>

                  <Grid item xs={12}>
                    <Controls.Button
                      type="submit"
                      //className={classes.submit}
                      color="primary"
                    >
                      اعادة تعيين كلمة المرور
                    </Controls.Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Link href="/auth/login">
                      {" "}
                      <ButtonWrapper style={{ padding: "8px 22px" }}>
                        عودة الى صفحة الدخول
                      </ButtonWrapper>
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          ) : (
            <ErrorComp />
          )}
        </Container>
      )}
    </>
  );
}
export async function getServerSideProps({ query }) {
  const urlBass = await process.env.URL_BASE;
  const get = await fetch(
    `${urlBass}/api/authusers/auth/verifypass/${query.token}`
  );
  const respons = await get.json();
  return {
    props: { valid: respons.valid, ...query }, // will be passed to the page component as props
  };
}
export default getToken;
