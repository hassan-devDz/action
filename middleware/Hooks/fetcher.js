import useSWR from "swr";
import { useContext } from "react";
import AppContext from "../appContext";

export const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const urlBass = process.env.URL_BASE;

  const { data, mutate } = useSWR(`/api/authusers/user`, fetcher);
  // if data is not defined, the query has not completed

  const loading = !data;
  const value = useContext(AppContext);

  const user = loading ? value : data?.user;
  console.log(user);
  return [user, { mutate, loading }];
}
