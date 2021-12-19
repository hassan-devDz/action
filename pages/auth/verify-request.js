import Image from "next/image";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "../../Components/Ui/Link";
import { useUser } from "../../middleware/Hooks/fetcher";
import { Paper } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
export default function verifyRequest() {
  const [user, { mutate, loading }] = useUser();

  const router = useRouter();
  // const sess = getSession().then((res)=>{if (res.user.email) {
  //     router.push('/')
  // }})
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  console.log(loading);
if (loading) {
  return(
  <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>)
}
  return (
    <Container maxWidth="sm">
      
      <Grid container alignContent="center">
      <Grid item xs={12}>
          <Image src="/signup/Mailsent-bro-1.svg" width={718} height={458} />
        </Grid>
     <Grid item xs={12}>
          <Typography variant="h4" align="center" paragraph  style={{paddingBottom:40}}>
            تفقد بريدك الإلكتروني
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p" > تم إرسال رسالة إلى بريدك الاكتروني تحتوي على رابط للتحقق وتفعيل حسابك. لدواعي أمنية ، ستنتهي صلاحية هذه الرسالة خلال 24  ساعة .</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p" >لذا يوصى بالتحقق من عنوان بريدك الإلكتروني في أقرب وقت ممكن لتنشيط حسابك! </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p">تأكد من فحص مجلدات البريد غير الهام أو  البريد العشوائي إذا لم تظهر الرسالة في بريدك خلال  دقيقتين.             <Link href="/auth/resendtoken">اضغط هنا لإعادة ارسال رابط التحقق</Link>
  </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p">اذا كانت هناك مشكلة في رابط التحقق؟ تواصل معنا </Typography>
        </Grid>
       
   
      </Grid>
    </Container>
  );
}
