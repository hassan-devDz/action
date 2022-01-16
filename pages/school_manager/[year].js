import ManagerPage from "../../Components/CompPage/IndexPage/ManagerPage";
import TeacherPage from "../../Components/CompPage/IndexPage/TeacherPage";
import { useUser, useUsers } from "../../middleware/Hooks/fetcher";

const now = new Date().getUTCFullYear() - 10;
const years = Array(now - (now - 20))
  .fill("")
  .map((v, idx) => (now + idx).toString());
const DataTableCrud = ({ dataserver }) => {
  const [user, { mutate }] = useUser();
  console.log(user);
  return (
    <>
      {user && user.accountType.key == 1 ? (
        <TeacherPage dataserver={dataserver} />
      ) : (
        <ManagerPage dataserver={dataserver} />
      )}
    </>
  );
};

export async function getServerSideProps({ req, query, res, params }) {
  const urlBass = await process.env.URL_BASE;

  const cookie = await req?.headers.cookie;
  const year = (await years.includes(params.year))
    ? params.year
    : new Date().getFullYear();
  if (!years.includes(params.year)) {
    return {
      redirect: {
        destination: `/school_manager/${year}`,
        permanent: false,
      },
    };
  }

  const response = await fetch(
    `${urlBass}/api/getListForSchoolManager/${year}`,
    {
      headers: {
        cookie: cookie,
      },
    }
  );

  if (!response.ok) {
    return {
      notFound: true,
    };
  }
  const dataserver = await response.json();
  console.log(dataserver);

  return {
    props: { dataserver }, // will be passed to the page component as props
  };
}
DataTableCrud.auth = true;
export default DataTableCrud;
