import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "grid",
    height: "100vh",
    minHeight: "100%",
    gridTemplateColumns: " 1fr",
    gridTemplateRows: "56px 1fr 56px",
    gap: "40px 5px",
    gridTemplateAreas: '"header  " " main " " footer "',

    [theme.breakpoints.between("sm", "md")]: {
      gridTemplateRows: "64px 1fr 56px",
      gridTemplateColumns: "1fr",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: " 1fr",
      gridTemplateRows: "80px 1fr 56px",
    },
  },
  bg: {
    gridArea: "main",
    padding: 40,
    minWidth: 160,
    zIndex: 1,
    [theme.breakpoints.down("md")]: {
      padding: "20px 0",
    },
  },

  signup: {
    height: "100%",
    minHeight: "100vh",
    "&  $main": {
      paddingTop: "50px",
    },
  },
}));
export default useStyles;
