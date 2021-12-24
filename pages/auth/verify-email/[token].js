import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { useUser, fetcher } from "../../../middleware/Hooks/fetcher";
import useSWR from "swr";
import { openToastError } from "../../../Components/Notification/Alert";
import Image from "next/image";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { ButtonWrapper } from "../../../Components/FormsUi/Button/ButtonNorm";
import Link from "../../../Components/Ui/Link";
import LoadingPage from "../../../Components/CompPage/LoadingPage";
import { useTimer } from "use-timer";

function UserList() {
  const { data: { users } = {} } = useSWR("/api/users", fetcher);
  return (
    <>
      <h2> All users </h2>
      {!!users?.length && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <pre> {JSON.stringify(user, null, 2)} </pre>
            </li>
          ))}
          <style jsx>
            {`
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            `}
          </style>
        </ul>
      )}
    </>
  );
}

function verifyEmail({ query }) {
  console.log(query);
  const [succesResponse, setSuccesResponse] = useState("");
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const [errorRespons, setErrorRespons] = useState("");
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 10,
    timerType: "DECREMENTAL",
    endTime: 1,
    onTimeOver: () => {
      router.push("/");
    },
  });
  const handlerToken = async () => {
    const get = await fetch(`/api/authusers/auth/verify/${query.token}`);
    const respons = await get.json();

    if (get.status === 201) {
      mutate(respons);
      //
      start();
      setSuccesResponse(respons.message);
      // set user to useSWR state
    } else {
      openToastError(respons.message);
      setErrorRespons(respons.message);
      //router.push("/signup")
    }

    //console.log(respons);
  };

  useEffect(() => {
    handlerToken();
  }, []);
  console.log(loading, !errorRespons, !succesResponse);
  if (!errorRespons && !succesResponse) {
    return <LoadingPage />;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Grid
          container
          spacing={2}
          style={{ height: "100%" }}
          alignContent="center"
        >
          <Grid item xs={12}>
            <Image
              src={
                errorRespons
                  ? "/signup/401-error.svg"
                  : "/signup/ok-animate.svg"
              }
              width={600}
              height={600}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              paragraph
              component="p"
              style={{ textAlign: "center", wordSpacing: 3 }}
            >
              {errorRespons || succesResponse}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {!!errorRespons ? (
              <Link href="/auth/resendtoken">
                <ButtonWrapper> اعد ارسال رابط التحقق </ButtonWrapper>
              </Link>
            ) : (
              <Typography
                variant="h6"
                paragraph
                component="p"
                style={{ textAlign: "center", wordSpacing: 3 }}
              >
                سيتم توجهيك الى الصفحة الرئيسية بعد
                <span style={{ color: "red" }}> {time} </span>ثواني .
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
      {/* {response && (
                    <>
                      <p>Currently logged in as:</p>
                      <pre>{response.message}</pre>
                    </>
                  )} */}
    </>
  );
}
export async function getServerSideProps({ query }) {
  return {
    props: { query }, // will be passed to the page component as props
  };
}

export default verifyEmail;
