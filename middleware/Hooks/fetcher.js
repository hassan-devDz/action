import useSWR, { useSWRConfig } from "swr";
import { useContext } from "react";
import AppContext from "../appContext";
import { useRouter } from "next/router";
import { subjects } from "../StudySubjects";
export const fetcher = (url) =>
  fetch(url).then((r) => {
    if (r.ok) {
      return r.json();
    }
  });

export function useUser() {
  const urlBass = process.env.URL_BASE;

  const { data, mutate } = useSWR(`/api/authusers/user`, fetcher);
  // if data is not defined, the query has not completed

  const loading = !data;
  const value = useContext(AppContext);

  const user = loading ? value : data?.user;

  return [user, { mutate, loading }];
}

export function useData() {
  const { data, error, mutate } = useSWR(
    "/api/getNationalAnnualMovementData",
    fetcher
  );

  const loading = !error && !data;
  console.log(data, loading);
  return {
    data: data,
    isLoading: loading,
    isError: error,
    isMutate: mutate,
  };
} //"/api/getAllUsers/2021"
export function useUsers(url) {
  const year = useRouter().query.year;
  const { data, error, mutate } = useSWR(url + year, fetcher);

  const loading = !error && !data;
  console.log(data, loading, error);
  return {
    data: data,
    isLoading: loading,
    isError: error,
    isMutate: mutate,
  };
}
