import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paperAnchorRightstyle:{
    borderRight:'0',
  },
  gred: {
    backgroundColor:theme.palette.background.default,
    position:"fixed",
    top: "56px ",
    height: "100%",
    zIndex: 99,

    [theme.breakpoints.between("sm", "md")]: {
      top: "64px",
      
    },
    [theme.breakpoints.up("md")]: {
      
      top: "80px",
    },
  },
  margn:{
    marginRight:'4px',
    marginTop: "56px ",
    

    [theme.breakpoints.between("sm", "md")]: {
      marginTop: "64px",
      
    },
    [theme.breakpoints.up("md")]: {
      
      marginTop: "80px",
    },
  },
  drawerPaper: {
    backgroundColor:theme.palette.primary.transparent,
    overflowX: "hidden",
    position: "fixed",
    whiteSpace: "nowrap",
    width: theme.spacing(33.75),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  pdli: {
    color:theme.palette.primary.main,
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(2.75),
    },
   
    
  },
  buttonPaper: {
      
    backgroundColor:theme.palette.background.default,
    color:theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(1),
      },
      '&:hover':{
        boxShadow:theme.shadows[24]
      }
  },
  pdliActive: {
    color:theme.palette.primary.main,
      backgroundColor: theme.palette.primary.mainlight,
      
      '&:hover':{
        backgroundColor: theme.palette.primary.mainlight
      }
  
  },
  arrowLinks: {
    display: "flex",
    placeItems: "center",
    flexGrow: 1,
  },
  root: {
    width: "100%",
    maxWidth: 360,
    
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  fontList: {
    fontSize: 24,
  },
  visi: {
    visibility: "hidden",
  },
  papercls:{
    margin:'6px 0',
    backgroundColor:theme.palette.background.default,
    '&:hover':{
      boxShadow:theme.shadows[1]
    }
  }
}));
export default useStyles;
