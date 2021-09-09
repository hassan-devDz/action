import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";
import useStyle from "../Components/FormsUi/StyleForm";
import Image from "next/image";
import SvgIcon from "@material-ui/core/SvgIcon";
import Kids from "../public/cards/kids_school.svg";
import Icon from "@material-ui/core/Icon";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import Skeleton from "@material-ui/lab/Skeleton";

const Static = (prpos) => {
  const classe = useStyle();
  const [sum, setsum] = useState(prpos.data);
  console.log(prpos.data);

  const sumForced = prpos.data.reduce(function (acc, val) {
    return acc + val.forced;
  }, 0);
  const arrItem = [
    {
      key: "potentialVacancy",
      name: "محتمل الشغور",
      src: "/cards/mohtamal.svg",
    },
    { key: "forced", name: "مجبر", src: "/cards/forced.svg" },
    { key: "vacancy", name: "شاغر", src: "/cards/vacant.svg" },
    { key: "surplus", name: "فائض", src: "/cards/Quitting-job-bro.svg" },
  ];
  const DataMap = () =>
    arrItem.map((x) => {
      const sumForced = prpos.data.reduce(function (acc, val) {
        return acc + val[x.key];
      }, 0);
      return (
        <Grid item xs={12} sm={6} md={4} lg={2} key={x.name}>
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
                  {x.name}
                </Typography>
                <Typography
                  variant="h4"
                  component="h4"
                  align="left"
                  color="secondary"
                  style={{ fontFamily: "Helvetica", fontWeight: 700 }}
                >
                  {prpos.data.length>0?sumForced:<Skeleton width={'50%'} />}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  backgroundImage: `url(${x.src})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                {/* <Icon>
              <Image width={97} height={97} src={x.src} />
            </Icon> */}
                {/* <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/> */}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      );
    });
  console.log();

  return (
    <Grid
      container
      spacing={1}
      style={{ margin: "6px 0" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={6} md={4} lg={2}>
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
                style={{ fontWeight: 700 }}
              >
                عدد المدارس
              </Typography>
              <Typography
                variant="h4"
                component="h4"
                align="left"
                color="secondary"
                style={{ fontFamily: "Helvetica", fontWeight: 700 }}
              >
                {prpos.data.length>0?prpos.data.length : <Skeleton width={'50%'} />}
              </Typography>
            </Grid>

            <Grid
              item
              xs={4}
              style={{
                backgroundImage: `url(/cards/kids_school.svg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
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
      <DataMap />
    </Grid>
  );
};
export default Static;
/**width: 100%;
height: 100%;
padding: 10px; */
