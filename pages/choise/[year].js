import TeacherPage from "../../Components/CompPage/IndexPage/TeacherPage";
import { loopforUser } from "../../middleware/StudySubjects";
const choiseScools = ({ newStructureData }) => {
  return <TeacherPage newStructureData={newStructureData} />;
};

export async function getServerSideProps(ctx) {
  const urlBass = await process.env.URL_BASE;
  const query = new URLSearchParams(ctx.query).toString();
  const cookie = await ctx.req?.headers.cookie;
  const res = await fetch(`${urlBass}/api/getListMoassatForUser`, {
    headers: {
      cookie: cookie,
    },
  });

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const data = await res.json();
  console.log(data, "rrrrrrrrrrrrrrr");
  const newStructureData = data.citys ? loopforUser(data) : data;

  return {
    props: { newStructureData }, // will be passed to the page component as props
  };
}
choiseScools.auth = true;
export default choiseScools;
