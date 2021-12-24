import Image from "next/image";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "../../Components/Ui/Link";
import { useUser } from "../../middleware/Hooks/fetcher";
import { ButtonWrapper } from "../../Components/FormsUi/Button/ButtonNorm";
import Container from "@material-ui/core/Container";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
export default function verifyRequest({ url }) {
  const [user, { mutate, loading }] = useUser();
  const [Url, setUrl] = useState("");
  console.log(url);
  const router = useRouter();

  const urlHistor = { token: "/auth/resendtoken", pass: "/auth/resetpassword" };

  useEffect(() => {
    router.prefetch("/auth/login");
    if (url) {
      setUrl(new URL(url).pathname);
    }
    if (!url && !user) {
      router.replace("/auth/login");
    }
    if (user) {
      router.push("/");
    }
  }, [user, loading]);

  console.log(Url);
  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Container maxWidth="sm">
      <Grid
        container
        alignContent="center"
        style={{ textAlign: "justify", wordSpacing: 3 }}
      >
        <Grid item xs={12} container justifyContent="center">
          <Image src="/signup/Mailsent-bro-1.svg" width={450} height={450} />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            paragraph
            style={{ paddingBottom: 40 }}
          >
            تفقد بريدك الإلكتروني
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {Url && Url === urlHistor.pass ? (
            <Typography variant="body1" paragraph component="p">
              تم إرسال رسالة إلى بريدك الاكتروني تحتوي على رابط للتحقق ولإعادة
              كلمة المرور. لدواعي أمنية ، ستنتهي صلاحية هذه الرسالة{" "}
              <span style={{ color: "red" }}>خلال 1 ساعة</span> .
            </Typography>
          ) : (
            <Typography variant="body1" paragraph component="p">
              تم إرسال رسالة إلى بريدك الاكتروني تحتوي على رابط للتحقق وتفعيل
              حسابك. لدواعي أمنية ، ستنتهي صلاحية هذه الرسالة{" "}
              <span style={{ color: "red" }}>خلال 24 ساعة</span> .
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p">
            لذا يوصى بالتحقق من عنوان بريدك الإلكتروني في أقرب وقت ممكن .
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p">
            تأكد من فحص مجلدات البريد غير الهام أو البريد العشوائي إذا لم تظهر
            الرسالة في بريدك خلال دقيقتين.{" "}
            <Link
              href={
                Url && Url === urlHistor.pass ? urlHistor.pass : urlHistor.token
              }
            >
              اضغط هنا لإعادة ارسال رابط التحقق
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph component="p">
            اذا كانت هناك مشكلة في رابط التحقق؟ تواصل معنا{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link href="/auth/login">
            {" "}
            <ButtonWrapper>عودة الى صفحة الدخول</ButtonWrapper>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
export async function getServerSideProps({ req }) {
  const urlHes = await req?.headers?.referer;

  return {
    props: { url: urlHes || null },
  };
}
