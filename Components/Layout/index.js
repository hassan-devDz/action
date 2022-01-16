import Aside from "./aside/Aside";
import Footer from "./Footer";
import Navbar from "./Navbar/index";
import Container from "@material-ui/core/Container";
import { useState, useContext, createContext } from "react";
import useStyles from "./Stylyout";

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const isLogin = true;
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.content}>
      <Navbar data={open ? handleDrawerClose : handleDrawerOpen} />
      {/* <Aside stat={open} /> */}
      <Container component="main" maxWidth="xl" className={classes.bg}>
        {children}
      </Container>
      <Footer name="footer" />
    </div>
  );
};

export default Layout;
