import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  
  grow: {
    flexGrow:1
  },
 
}));

const DividerWithText = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center"  >
      <Divider variant="middle" className={classes.grow} />
      <Typography component="span">
      {children}
      </Typography>
      <Divider variant="middle" className={classes.grow} />
    </Grid>
  );
};
export default DividerWithText;