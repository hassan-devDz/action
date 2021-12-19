import useSWR from 'swr'
import { useContext } from "react";
import AppContext from "../middleware/appContext";

export const fetcher = (url) => fetch(url).then((r) => r.json())

export function useUser() {
  const { data, mutate } = useSWR('/api/user', fetcher)
  // if data is not defined, the query has not completed
  
  const loading = !data
  const value = useContext(AppContext);

  const user = loading?value :data?.user ;
  
  return [user, { mutate, loading }]
}
