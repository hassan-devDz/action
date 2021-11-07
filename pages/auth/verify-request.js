import React from "react";
import Router, {useRouter}  from 'next/router';
import Link from '../../Components/Ui/Link';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography'
import {useSession,getSession} from 'next-auth/react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
const verifyRequest =  () => {
   const red= useRouter()
    // const sess = getSession().then((res)=>{if (res.user.email) {
    //     red.push('/')
    // }})
    const{status}=  useSession()
   console.log(status);
    if (status==="authenticated") {
     red.push('/')
         
    } if (status==="unauthenticated") {
        return  <Grid container alignContent="center" style={{height:"100vh"}}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" align="center" >تفقد بريدك الإلكتروني</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4"  align="center" paragraph>تفقد بريدك الإلكتروني</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4"  align="center" >
          <Link href="/auth/login"> hg</Link>
          </Typography>
        </Grid>
      </Grid> 
        
   }
        return (
            <Backdrop  open >
            <CircularProgress color="inherit" />
          </Backdrop>
  ); 
    
 
};

export default verifyRequest;
