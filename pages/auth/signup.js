import { useState, useEffect, useRef } from "react";

import Avatar from "@material-ui/core/Avatar";

import Grid from "@material-ui/core/Grid";
import { nanoid } from "nanoid";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";

import Router, { useRouter } from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UAParser from "ua-parser-js";
import ReCAPTCHA from "react-google-recaptcha";

import FormInfoInterested from "../../Components/Desires/FormInfoInterested";
import useWindowSize from "../../middleware/Hooks/windowSize";
import Backdrop from "@material-ui/core/Backdrop";
import ScaleLoader from "react-spinners/ScaleLoader";
import useStyles from "../../Components/Ui/Css/Csslogin";
import {useUser} from '../../middleware/Hooks/fetcher';
import axios from "axios";

const SignUp = (props) => {
  const router = useRouter();
  const [user, { mutate }] = useUser()
  const size = useWindowSize();
  const infoDevise = { ...new UAParser().getResult(), ...size };
  const [email, setEmail] = useState("");
  const recaptchaRef = useRef({});
  const classes = useStyles();

  const [createUser, setCreateUser] = useState({});
  const [spinnersLoding, setSpinnersLoding] = useState(false);
  
  const [open, setOpen] = useState(false);
  
  const theme = useTheme();
  const sumbitUser =  (values, actions) => {
    console.log(values);
     const { passwordConfirmation, ...INITIAL_FORM_STATE1 } = values;
     setCreateUser(values)
    // const response = await fetch("/api/auth/callback/credentials", {
    //   method: "POST",
    //   body: data1,
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //   },
    // });
    //console.log(recaptchaRef.current.updater);
   recaptchaRef.current.reset()
    recaptchaRef.current.execute()
     
    // const redUrl = await signIn("signup", {
    //   redirect: false,
    //   callbackUrl: "/",
    //  data:JSON.stringify(values)
    // })
    //Router.push(redUrl.url)
    //   actions.resetForm();
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
        body: JSON.stringify({ ...createUser,createdAt:new Date(), captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
       
      
      
      if (response.ok) {
        // If the response is ok than show the success alert
        router.push("/auth/verify-request");
        //setOpen(true);
      } 
    } catch (error) {
      console.log(error);
      alert(`${error?.message} هناك خطأ ما` || "هناك خطأ ما");
    } finally {
      
      // Reset the hCaptcha when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      //recaptchaRef.current.reset()
      //console.log(recaptchaRef);
    }
  };
  useEffect(() => {
    if (user) {
      router.push("/")
    }
    }, [user])
    return (
      <>
        <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
        </Backdrop>
        <Container component="section"  maxWidth="md">
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
                التسجيل في الحركة التنقلية السنوية
              </Typography>
            </Grid>
  
            <Grid item xs={12}>
              <FormInfoInterested onSubmit={sumbitUser} />
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
          </Grid>
        </Container>
      </>
    );
  // }
  // return (
  //   <Backdrop open>
  //     <CircularProgress color="inherit" />
  //   </Backdrop>
  // );
    //Router.push(redUrl.url)
    //await signIn('credentials', { redirect: false, phone: phone, password: password })
   
    // setCreateUser({
    //   idUser: nanoid(),
    //   ...INITIAL_FORM_STATE1,
    //   dateCreateAccount: Date(),
    //   infoDevise,
    // });

    // console.log(
    //   { ...values, idUser: nanoid(), dateCreateAccount: Date() },
    //   actions,
    //   createUser,
    //   "recaptchaRef",
    //   recaptchaRef
    // );
    // recaptchaRef.current.execute();
    //INITIAL_FORM_STATE.resetForm();
    //actions.resetForm()


 

  
};
// export async function getServerSideProps(context) {
//   const { req, res } = context;
//   const session = await getSession({ req });
//   if (session) {
//     return{
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       session: session,
//       providers: await getProviders(context),
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// }
export default SignUp;
