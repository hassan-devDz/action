import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { messages } from "../../../Components/Ui/Message/AllMssage";
import Link from "../../../Components/Ui/Link";
import { ButtonWrapper } from "../../../Components/FormsUi/Button/ButtonNorm";
import useStyles from "../../../Components/Ui/Css/Csslogin";

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

  const classes = useStyles();
  const [bodyUser, setBodyUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = useCallback(async (values) => {
    const body = { ...values, token };
    console.log(body);
    const sendPassAndToken = await fetch(
      "/api/authusers/auth/verifypass/newpass",
      {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //if (sendPassAndToken.ok) router.replace("/auth/login");
  }, []);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  console.log(valid, token);
  return (
    <>
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
                    src="/signup/reset-password.svg"
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

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
