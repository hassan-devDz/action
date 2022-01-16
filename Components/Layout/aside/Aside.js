import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ListComp from "./listaside";
import useStyles from "./sty";
import { Container } from "@material-ui/core";
import styles from "../../../styles/Aide.module.css";

const Aside = (props) => {
  const menuId = "primary-search-account-menu";
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Container
      component="aside"
      maxWidth={false}
      className={styles.aside}
      disableGutters={true}
    >
      <Drawer
        variant="permanent"
        classes={{
          root: clsx(classes.gred),
          paperAnchorRight: clsx(classes.paperAnchorRightstyle),
          paper: clsx(
            classes.drawerPaper,
            !props.stat && classes.drawerPaperClose
          ),
        }}
        open={props.stat}
      >
        <ListComp />
      </Drawer>
    </Container>
  );
};

export default Aside;
