import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { useUser, fetcher } from "../../middleware/Hooks/fetcher";
import useSWR from "swr";

function UserList() {
  const { data: { users } = {} } = useSWR("/api/users", fetcher);
  return (
    <>
      <h2>All users</h2>
      {!!users?.length && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </li>
          ))}

          <style jsx>{`
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          `}</style>
        </ul>
      )}
    </>
  );
}

function verifyEmail({ query }) {
  const [response, setResponse] = useState("");
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();

  const handlerToken = async () => {
    const get = await fetch(`/api/authusers/auth/verify/${query.token}`);
    const respons = await get.json();
    console.log(respons);
    if (get.status === 201) {
      mutate(respons);
      //router.push("/")

      // set user to useSWR state
    }
    if (get.status === 401) {
      //alert(respons.message)
      //router.push("/signup")
    }

    //console.log(respons);
    setResponse(respons);
  };

  useEffect(() => {
    handlerToken();
  }, []);
  if (loading) {
    return <h1>loading......</h1>;
  }
  return (
    <>
      <h1>
        <a href="http://www.passportjs.org/">Passport.js</a> +{" "}
        <a href="https://github.com/hoangvvo/next-connect">next-connect</a>{" "}
        Example
      </h1>

      {response && (
        <>
          <p>Currently logged in as:</p>
          <pre>{response.message}</pre>
        </>
      )}

      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
}
export async function getServerSideProps({ query }) {
  
  return {
    props: { query }, // will be passed to the page component as props
  };
}
export default verifyEmail;
