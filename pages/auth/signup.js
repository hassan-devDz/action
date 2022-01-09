import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import UAParser from "ua-parser-js";
import FormInfoInterested from "../../Components/Desires/FormInfoInterested";
import { openToastError } from "../../Components/Notification/Alert";
import useStyles from "../../Components/Ui/Css/Csslogin";
import { useUser } from "../../middleware/Hooks/fetcher";
import useWindowSize from "../../middleware/Hooks/windowSize";

const SignUp = (props) => {
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const size = useWindowSize();
  const infoDevise = { ...new UAParser().getResult(), ...size }; //معلومات الجهاز

  const classes = useStyles();

  const [createUser, setCreateUser] = useState({});

  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const sumbitUser = (values, actions) => {
    const { passwordConfirmation, ...INITIAL_FORM_STATE1 } = values;
    setCreateUser(values);
  };
  const onReCAPTCHAChange = async (captchaCode) => {
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    //recaptchaRef.current.execute()
    //const token = await recaptchaRef.current.executeAsync()
    console.log(captchaCode);
    if (!captchaCode) {
      return;
    }
    try {
      const response = await fetch("/api/authusers/signup", {
        method: "POST",
        body: JSON.stringify({
          ...createUser,
          createdAt: new Date(),
          captcha: captchaCode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // إذا كان الرد على ما يرام ، فسيتم إعادة توجيهه إلى الرابط
        router.push("/auth/verify-request");
      }
    } catch (error) {
      console.log(error);
      openToastError(`${error?.message} هناك خطأ ما` || "هناك خطأ ما");
    }
  };

  useEffect(() => {
    http: if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Container component="section" maxWidth="md">
        <Grid
          container
          justifyContent="center"
          className={classes.form}
          alignItems="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid item xs={12}>
            {" "}
            <Typography component="h1" variant="h5" className={classes.dokhol}>
              التسجيل في الحركة التنقلية السنوية{" "}
              {`${new Date().getFullYear()} / ${new Date().getFullYear() + 1}`}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {false ? (
              <Typography component={"h1"} variant="h5">
                مدير
              </Typography>
            ) : (
              <FormInfoInterested
                onSubmit={sumbitUser}
                onReCAPTCHAChange={onReCAPTCHAChange}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignUp;
