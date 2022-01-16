import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import UAParser from "ua-parser-js";
import FormInfoInterested from "../../Components/Desires/FormInfoInterested";
import Teacher from "../../Components/CompPage/SignUpAccountsType/Teacher";
import Manager from "../../Components/CompPage/SignUpAccountsType/Manager";
import OfficeHead from "../../Components/CompPage/SignUpAccountsType/OfficeHead";
import HeadOfInterest from "../../Components/CompPage/SignUpAccountsType/HeadOfInterest";

import { openToastError } from "../../Components/Notification/Alert";
import useStyles from "../../Components/Ui/Css/Csslogin";
import { useUser } from "../../middleware/Hooks/fetcher";
import useWindowSize from "../../middleware/Hooks/windowSize";
import Checkbox from "@material-ui/core/Checkbox";
import { _accountType } from "../../middleware/StudySubjects";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// const _accountType = [//نوع الحساب
//   "teacher", //أستاذ
//   "manager", //مدير
//   "officeHead", //رئيس مكتب
//   "memberOfTheCommittee", //عضو لجنة
//   "HeadOfInterest", //رئيس مصلحة
// ];
// const _accountType = [
//   "1", //أستاذ
//   "2", //مدير
//   "3", //رئيس مكتب
//   "4", //عضو لجنة
//   "5", //رئيس مصلحة
// ];

const SignUp = (props) => {
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const size = useWindowSize();
  const infoDevise = { ...new UAParser().getResult(), ...size }; //معلومات الجهاز
  const [accountType, setAccountType] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const classes = useStyles();
  console.log({ accountType });
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
          accountType,
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

          <Grid item xs={12} style={{ placeSelf: "stretch" }}>
            {accountType ? (
              accountType.key == 1 ? (
                <Teacher
                  onSubmit={sumbitUser}
                  onReCAPTCHAChange={onReCAPTCHAChange}
                />
              ) : accountType.key == 2 ? (
                <Manager
                  onSubmit={sumbitUser}
                  onReCAPTCHAChange={onReCAPTCHAChange}
                />
              ) : accountType.key == 3 || accountType.key == 4 ? (
                <OfficeHead
                  onSubmit={sumbitUser}
                  onReCAPTCHAChange={onReCAPTCHAChange}
                />
              ) : (
                <HeadOfInterest
                  onSubmit={sumbitUser}
                  onReCAPTCHAChange={onReCAPTCHAChange}
                />
              )
            ) : (
              <Autocomplete
                fullWidth
                value={accountType}
                onChange={(event, newValue) => {
                  setAccountType(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={_accountType}
                getOptionLabel={(option) => option.value}
                renderOption={(option, { selected }) => (
                  <>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8, color: "#2b50ed" }}
                      checked={selected}
                    />
                    {option.value}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="اختر نوع الحساب"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignUp;
