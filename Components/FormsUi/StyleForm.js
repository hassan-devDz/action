import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonPapersubmit: {
    
    //margin: theme.spacing(3, 0, 2),
    backgroundColor:theme.palette.background.default,
   
    [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(1),
      },
      '&:hover':{
        boxShadow:theme.shadows[24]
      }
  }
,
  submit: {
    fontWeight:700,
    minWidth: 40,
    
  }
  }));

  export default useStyles;