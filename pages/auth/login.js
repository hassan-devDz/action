import { useState, useCallback, useRef, useEffect } from "react";

import Image from "next/image";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Router, { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "../../Components/Ui/Link";
import Grid from "@material-ui/core/Grid";

import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import LoadingPage from "../../Components/CompPage/LoadingPage";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import DividerWithText from "../../Components/Ui/DividerWithText";
import Controls from "../../Components/FormsUi/Control";
import { ButtonWrapper } from "../../Components/FormsUi/Button/ButtonNorm";
import { openToastError } from "../../Components/Notification/Alert";
import { messages } from "../../Components/Ui/Message/AllMssage";
import useStyles from "../../Components/Ui/Css/Csslogin";
import { useUser } from "../../middleware/Hooks/fetcher";
import ReCAPTCHA from "react-google-recaptcha";
const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email(messages.email).required(messages.required),

  password: Yup.string()
    .min(8, messages.minlength(8))
    .required(messages.required),
});

export default function logIn() {
  console.log("logIn");
  //const { status } = useSession();
  const [user, { mutate }] = useUser();
  const router = useRouter();
  const [pageloading, setpageLoding] = useState(false);
  const classes = useStyles();
  const [bodyUser, setBodyUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef({});
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleSubmit = useCallback(async (values) => {
    setBodyUser(values);
    recaptchaRef.current.reset();
    recaptchaRef.current.execute();
  }, []);

  const onReCAPTCHAChange = async (captchaCode) => {
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    //recaptchaRef.current.execute()
    //const token = await recaptchaRef.current.executeAsync()

    if (!captchaCode) {
      return;
    }
    setpageLoding(true);
    try {
      const response = await fetch("/api/authusers/login", {
        method: "POST",
        body: JSON.stringify({ ...bodyUser, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userObj = await response.json();
        console.log(response, userObj);
        mutate(userObj);
        router.push("/");
      } else if (response.status === 401) {
        setpageLoding(false);
        openToastError("???????????? ???????????????????? ???? ???????? ???????? ?????? ??????????");
      } else if (response.status === 403) {
        const userObj = await response.json();
        setpageLoding(false);

        openToastError(userObj.message);
      } else {
        setpageLoding(false);
        openToastError(response.statusText);
      }
    } catch (error) {
      setpageLoding(false);

      openToastError("?????? ??????????");
    }
  };
  const Unavailable = (e) => {
    console.log(e.target.innerText);

    openToastError(`????${e.target.innerText} ?????? ???????? ??????????`);
  };
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  if (!pageloading) {
    return (
      <Container component="section" className={classes.selfAlin}>
        <Grid
          container
          className={classes.form}
          alignContent="center"
          style={{ margin: 0 }}
          alignItems="center"
        >
          <Grid item xs={12} md={6} className={classes.disp}>
            <Image
              src={"/signup/Quitting_a_job-bro.svg"}
              width={700}
              height={700}
            />
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={12}
            md={6}
            className={classes.form}
            alignContent="center"
            style={{ margin: 0 }}
          >
            <Grid
              item
              container
              alignContent="center"
              direction="column"
              xs={12}
            >
              <Grid item>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography
                  component="h1"
                  variant="h5"
                  className={classes.dokhol}
                >
                  ????????
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              container
              justifyContent="space-between"
              className={classes.goolface}
            >
              <Grid item xs={12} sm={5} md={5}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  className={classes.button}
                  startIcon={
                    <Image src="/signup/google.svg" width={20} height={20} />
                  }
                  onClick={Unavailable}
                >
                  ???????? ?????? ????????
                </Button>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item item xs={12} sm={5} md={5}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  className={classes.button}
                  startIcon={
                    <Image src="/signup/facebook.svg" width={20} height={20} />
                  }
                  onClick={Unavailable}
                >
                  ???????? ?????? ????????????
                </Button>
              </Grid>
            </Grid>
            <DividerWithText>
              {" "}
              ???? ?????????? ???????????? ?????? ???????????? ????????????????????
            </DividerWithText>
            <Grid item container>
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE,
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={handleSubmit}
              >
                <Form className={classes.form}>
                  <Grid item container spacing={2}>
                    <Grid item xs={12}>
                      <Controls.Textfield
                        id="email"
                        label="???????????? ????????????????????"
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
                    <Grid item xs={12}>
                      <Controls.Textfield
                        name="password"
                        label="???????? ????????"
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

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox value="allowExtraEmails" color="primary" />
                        }
                        label="???????????? ."
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
                    </Grid>
                    <Grid item xs={12}>
                      <Controls.Button
                        type="submit"
                        className={classes.submit}
                        color="primary"
                      >
                        ?????????? ????????????
                      </Controls.Button>
                    </Grid>
                    <Grid item container justifyContent="space-between">
                      <Grid item>
                        <Link href="/auth/resetpassword">
                          ???????? ???????? ???????? ??{" "}
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href="/auth/signup">
                          ?????? ???????? ???????? ?? ?????????? ???????? ????????
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
  return <LoadingPage />;
}
