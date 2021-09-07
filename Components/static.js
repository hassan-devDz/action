import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import useStyle from '../Components/FormsUi/StyleForm';
const Static = (prpos) => {
  const classe = useStyle()
  const [sum, setsum] = useState(prpos.data);
  console.log(prpos.data);
  const sumMohtaml = prpos.data.reduce(function (acc, val) {
    return acc + val.forced;
  }, 0);
  return (
    <Grid container spacing={1} style={{margin:"6px 0"}}>
      <Grid item xs={2}>
        <Paper elevation={3} className={classe.buttonPaper}>
          <Grid container  wrap="nowrap">
            <Grid item xs={8} style={{padding:"5px 22px 0 22px"}}>
              <Typography
                variant="h4"
                component="h4"
                align="left"
                gutterBottom
                color="secondary"
              >
                {prpos.data.length}
              </Typography>
              <Typography
              
                variant="h6"
                component="h4"
                align="left"
                gutterBottom
                color="secondary"
              >
                عدد المدارس
              </Typography>
            </Grid>
            <Grid item xs={4}>
             <SchoolTwoToneIcon fontSize="large" style={{width:"100%",height:"100%",padding:10}} color="secondary"/>
            </Grid>
         
          </Grid>
        </Paper>
      </Grid>
      
    </Grid>
  );
};
export default Static;
/**width: 100%;
height: 100%;
padding: 10px; */