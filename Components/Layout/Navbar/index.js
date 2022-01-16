import React, { useState } from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import MoreIcon from "@material-ui/icons/MoreVert";
//import FallbackAvatars from "../Avatar/Fallbacks";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Button from "@material-ui/core/Button";
import Link from "../../Ui/Link";
import useStyles from "./style";
import { Container, Grid, GridList } from "@material-ui/core";
import { useRouter } from "next/router";
import { useUser } from "../../../middleware/Hooks/fetcher";
const StyledMenu = (props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
);
const StyledMenuMobile = (props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
);

export default function PrimarySearchAppBar(props) {
  const [user, { mutate }] = useUser();
  const router = useRouter();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [auth, setAuth] = useState(true);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const year = router.query.year || new Date().getFullYear();
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const signOut = async () => {
    const res = await fetch("/api/authusers/logout");
    mutate({ user: null });
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <StyledMenu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <InboxIcon fontSize="medium" />
        </ListItemIcon>
        <ListItemText primary="البريد" />
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </StyledMenu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <StyledMenuMobile
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      className={classes.menu}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} classes={{ badge: classes.badge }}>
            <MailOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} classes={{ badge: classes.badge }}>
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </StyledMenuMobile>
  );
  console.log(props.data, "data");
  return (
    <Container component="header" maxWidth="xl" className={classes.grow}>
      <AppBar component="nav" position="fixed" className={classes.navBar}>
        <Toolbar>
          <IconButton onClick={props.data} className={classes.marginr}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h4"
            component="h1"
            align="center"
            className={classes.typographyClass}
          >
            جدول الحركة التنقلية للموسم {`${year} / ${+year + 1}`}
          </Typography>

          <div className={classes.grow} />
          <FormGroup>
            {/* <FormControlLabel
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" name="auth" />}
          label={auth ? 'Logout' : 'Login'}
        /> */}
          </FormGroup>
          <div className={classes.sectionDesktop}>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  onClick={signOut}
                  className={classes.typographyClass}
                  variant="text"
                >
                  خروج
                </Button>
              </Grid>
              <Grid item>
                <Link href={`/choise/${year}`}>
                  <Button className={classes.typographyClass} variant="text">
                    choise
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href={`/school_manager/${year}`}>
                  <Button className={classes.typographyClass} variant="text">
                    مدير
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href={`/users/${year}`}>
                  <Button className={classes.typographyClass} variant="text">
                    users
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href={`/users/${year}`}>
                  <Button className={classes.typographyClass} variant="text">
                    عضو لجنة
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} classes={{ badge: classes.badge }}>
                <MailOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 100 new notifications" color="inherit">
              <Badge badgeContent={100} classes={{ badge: classes.badge }}>
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              // aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <span>hgkkjjjkk</span>
              {/* <FallbackAvatars user={auth} /> */}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Container>
  );
}
