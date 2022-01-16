import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";
import useStyle from "./FormsUi/StyleForm";
import Image from "next/image";
import SvgIcon from "@material-ui/core/SvgIcon";
import Kids from "../public/cards/kids_school.svg";
import Icon from "@material-ui/core/Icon";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import Skeleton from "@material-ui/lab/Skeleton";
import Divider from "@material-ui/core/Divider";
import { useUser } from "../middleware/Hooks/fetcher";
import { blue } from "@material-ui/core/colors";

// const _accountType = [//نوع الحساب
//   "teacher", //أستاذ
//   "manager", //مدير
//   "officeHead", //رئيس مكتب
//   "memberOfTheCommittee", //عضو لجنة
//   "headOfInterest", //رئيس مصلحة
// ];
// const _accountType = [
//   "1", //أستاذ
//   "2", //مدير
//   "3", //رئيس مكتب
//   "4", //عضو لجنة
//   "5", //رئيس مصلحة
// ];
const _accountType = [
  { value: "أستاذ", key: 1 },
  { value: "مدير", key: 2 },
  { value: "رئيس مكتب", key: 3 },
  { value: "عضو لجنة", key: 3 },
  { value: "رئيس مصلحة", key: 3 },
];

const SignUpType = (prpos) => {
  const classe = useStyle();

  const [accountType, setAccountType] = useState([]);

  return (
    <Grid
      container
      spacing={1}
      style={{ margin: "6px 0" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className={classe.buttonPaper}>
          <Grid container wrap="nowrap">
            <Grid
              item
              container
              xs={8}
              style={{ padding: "5px 22px 0 22px" }}
              justifyContent="space-around"
              direction="column"
            >
              <Typography
                variant="body1"
                component="h4"
                align="left"
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: 700, whiteSpace: "nowrap" }}
              >
                مديرية التربية لولاية
              </Typography>
              <Grid item container>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  align="left"
                  color="secondary"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 700,
                  }}
                >
                  {!prpos.loading ? (
                    user.wilaya.value.replace("مديرية التربية لولاية", "")
                  ) : (
                    <Skeleton width={"50%"} />
                  )}
                </Typography>{" "}
              </Grid>
            </Grid>{" "}
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0px" }}
            />
            <Grid
              item
              xs={4}
              style={{
                backgroundImage: `url(/cards/wilaya.svg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgb(228, 233, 255)",
              }}
            >
              {/* <Icon>
                <Image width={97} height={97} src="/cards/Eco_education-bro.svg" />
              </Icon> */}
              {/* <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className={classe.buttonPaper}>
          <Grid container wrap="nowrap">
            <Grid
              item
              container
              xs={8}
              style={{ padding: "5px 22px 0 22px" }}
              justifyContent="space-around"
              direction="column"
            >
              <Typography
                variant="body1"
                component="h4"
                align="left"
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: 700, whiteSpace: "nowrap" }}
              >
                البلدية
              </Typography>
              <Grid item container>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  align="left"
                  color="secondary"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 700,
                  }}
                >
                  {!prpos.loading ? (
                    user.baldia.valeur
                  ) : (
                    <Skeleton width={"50%"} />
                  )}
                </Typography>{" "}
              </Grid>
            </Grid>{" "}
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0px" }}
            />
            <Grid
              item
              xs={4}
              style={{
                backgroundImage: `url(/cards/baldia.svg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgb(228, 233, 255)",
              }}
            >
              {/* <Icon>
                <Image width={97} height={97} src="/cards/Eco_education-bro.svg" />
              </Icon> */}
              {/* <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className={classe.buttonPaper}>
          <Grid container wrap="nowrap">
            <Grid
              item
              container
              xs={8}
              style={{ padding: "5px 22px 0 22px" }}
              justifyContent="space-around"
              direction="column"
            >
              <Typography
                variant="body1"
                component="h4"
                align="left"
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {replaceNom().nom}
              </Typography>
              <Grid item container>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  align="left"
                  color="secondary"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 700,
                  }}
                >
                  {!prpos.loading ? (
                    replaceNom().name
                  ) : (
                    <Skeleton width={"50%"} />
                  )}
                </Typography>{" "}
              </Grid>
            </Grid>{" "}
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0px" }}
            />
            <Grid
              item
              xs={4}
              style={{
                backgroundImage: `url(/cards/kids_school.svg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgb(228, 233, 255)",
              }}
            >
              {/* <Icon>
                <Image width={97} height={97} src="/cards/Eco_education-bro.svg" />
              </Icon> */}
              {/* <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className={classe.buttonPaper}>
          <Grid container wrap="nowrap">
            <Grid
              item
              container
              xs={8}
              style={{ padding: "5px 22px 0 22px" }}
              justifyContent="space-around"
              direction="column"
            >
              <Typography
                variant="body1"
                component="h4"
                align="left"
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: 700, whiteSpace: "nowrap" }}
              >
                المدير (ة):
              </Typography>
              <Grid item container>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  align="left"
                  color="secondary"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 700,
                  }}
                >
                  {!prpos.loading ? (
                    `${user.firstName}  ${user.lastName}`
                  ) : (
                    <Skeleton width={"50%"} />
                  )}
                </Typography>{" "}
              </Grid>
            </Grid>{" "}
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0px" }}
            />
            <Grid
              item
              xs={4}
              style={{
                backgroundImage: `url(/cards/manager.svg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgb(228, 233, 255)",
              }}
            >
              {/* <Icon>
                <Image width={97} height={97} src="/cards/Eco_education-bro.svg" />
              </Icon> */}
              {/* <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default SignUpType;
/**width: 100%;
height: 100%;
padding: 10px; */
