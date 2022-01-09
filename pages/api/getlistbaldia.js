import nextConnect from "next-connect";
import auth from "../../middleware/auth";
const handler = nextConnect();
handler.use(auth).get(async (req, res) => {
  const findListbaldia = await req.db
    .collection("education_Directorates")
    .findOne(
      { ...req.query },
      { projection: { "citys.valeur": 1, "citys.cle": 1, _id: 0 } }
    );

  return res.json(findListbaldia);
});
export default handler;
