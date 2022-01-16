import styles from "../../../styles/Footer.module.css";
import React from "react";

import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Copyright from "../Copyright";

// import { FontProvider, Font } from "website/src/components/Font";

const Footer = (props) => {
  return (
    <nav aria-label={props.name} className={styles.footer}>
      <Divider />

      <Grid
        container
        justifyContent="center"
        style={{ height: "100%" }}
        alignItems="center"
      >
        <Copyright />
      </Grid>
    </nav>
  );
};
// const Footer = (props) => {
//   return <footer className={styles.footer} aria-label={props.name}></footer>;
// };

export default Footer;
