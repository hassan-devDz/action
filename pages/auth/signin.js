import { useState, useEffect, useRef } from "react";

import Avatar from "@material-ui/core/Avatar";

import Grid from "@material-ui/core/Grid";
import { nanoid } from "nanoid";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";

import Router, { useRouter } from "next/router";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import UAParser from "ua-parser-js";

import FormInfoInterested from "../../Components/Desires/FormInfoInterested";
import useWindowSize from "../../Components/Hooks/windowSize";
import Backdrop from "@material-ui/core/Backdrop";
import ScaleLoader from "react-spinners/ScaleLoader";
import useStyles from "../../Components/Ui/Css/Csslogin";
import {
  getProviders,
  signIn,
  getSession,
  useSession,
  getCsrfToken,
} from "next-auth/react";

const SignIn = (props) => {
  const router = useRouter();

  const size = useWindowSize();
  const infoDevise = { ...new UAParser().getResult(), ...size };
  const [email, setEmail] = useState("");
  const recaptchaRef = useRef({});
  const classes = useStyles();
  const [createUser, setCreateUser] = useState({});
  const [spinnersLoding, setSpinnersLoding] = useState(false);
  const {data:session}  = useSession();
 
  const sumbitUser = async (values, actions) => {
    
    

    // const response = await fetch("/api/auth/callback/credentials", {
    //   method: "POST",
    //   body: data1,
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //   },
    // });
  
    const redUrl = await signIn("login", {
      redirect: false,
      callbackUrl: "/",
      username: "username",
      domain: "domain2",
    });
    //Router.push(redUrl.url)
    //await signIn('credentials', { redirect: false, phone: phone, password: password })
    const { passwordConfirmation, ...INITIAL_FORM_STATE1 } = values;
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

  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
        <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
      </Backdrop>
      <Container component="section" className={classes.selfAlin} maxWidth="md">
        <Grid
          container
          justifyContent="center"
          className={classes.form}
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          <Grid item>
            {" "}
            <Typography component="h1" variant="h5" className={classes.dokhol}>
              التسجيل في الحركة التنقلية السنوية
            </Typography>
          </Grid>

          <Grid item>
            <FormInfoInterested onSubmit={sumbitUser} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
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
export default SignIn;
