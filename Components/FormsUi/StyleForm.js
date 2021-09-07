import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      fontWeight:700
      
    },
   
    image: {
      paddingTop: theme.spacing(1),
      alignSelf:"flex-end"
    },
    buttonPaper: {
      
      backgroundColor:theme.palette.background.default,
     
      [theme.breakpoints.down('xs')]: {
          marginBottom: theme.spacing(1),
        },
        '&:hover':{
          boxShadow:theme.shadows[24]
        }
    },
    buttonPapersubmit: {
      
      //margin: theme.spacing(3, 0, 2),
      backgroundColor:theme.palette.background.default,
     
      [theme.breakpoints.down('xs')]: {
          marginBottom: theme.spacing(1),
        },
        '&:hover':{
          boxShadow:theme.shadows[24]
        }
    },

    
    button: {
      border:0,
      
      padding: theme.spacing(2),
      
      '&:hover':{
        border:0 ,
      }
    },
    dokhol:{
        marginBottom:theme.spacing(3),
        
    },
    goolface:{
      marginBottom:theme.spacing(3)
    },
    selfAlin:{
      alignSelf:"center",
      placeSelf:"center",
    }
  }));

  export default useStyles;