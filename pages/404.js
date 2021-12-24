import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,

    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  fontsize: {
    fontSize: "clamp(1.5rem, 2vw, 3rem)",
  },
  image: {
    margin: "50px 0",
    display: "inline-block",
    maxWidth: "100%",

    width: 560,
  },
}));

export default function NotFoundView() {
  console.log(Router);
  const classes = useStyles();

  return (
    <Box
      display="flex"
      alignSelf="center"
      flexDirection="column"
      height="100vh"
      width="100%"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <Typography
          align="center"
          color="textPrimary"
          variant="h3"
          className={classes.fontsize}
        >
          404: الصفحة التي تبحث عنها غير موجودة
        </Typography>
        <Box textAlign="center">
          <img
            alt="not found"
            className={classes.image}
            src="/undraw_page_not_found_su7k.svg"
          />
        </Box>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          للأسف لم يتم العثور على الصفحة التي طلبتها.قد يكون الرابط خاطئ أو
          الصفحة حذفت.
        </Typography>
        <div onClick={() => Router.back()}> Go Back </div>
      </Container>
    </Box>
  );
}
