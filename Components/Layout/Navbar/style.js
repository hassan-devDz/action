import { makeStyles, fade } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    gridArea: "header",
    zIndex: 999,
  },
  navBar: {
    boxShadow: "inset 0px -1px 1px #E7EBF0",
    color: "#3E5060",
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  marginr: {
    margin: "0 12px 0 -12px !important",
    "&:hover": {
      backgroundColor: "rgba(145, 158, 171, 0.8) ",
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      flexGrow: "1",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginRight: 0,
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      marginRight: theme.spacing(3),
      width: "auto",
    },

    transition: "width 1000ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  searchIcon: {
    padding: "0 16px",
    height: "100%",
    position: "absolute",
    right: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.standard,
    }),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "500px",
      },
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      placeItems: "center",
    },
  },
  badge: {
    color: "#fff",
    backgroundColor: "rgb(255, 72, 66)",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "600",
    right: "0px",
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  switch: {
    color: "red",
  },
  typographyClass: {
    color: " #3E5060",
    fontSize: "0.875rem",
    fontWeight: 700,
  },
}));
export default useStyles;
