import nextConnect from "next-connect";
import auth from "../../middleware/auth";
const handler = nextConnect();

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
let projec = { primary: "ابتدائي", middle: "متوسط", secondary: "ثانوي" };
handler.use(auth).get(async (req, res) => {
  const { cle, value } = await req.query;
  const query = { "citys.cle": cle };

  const key = getKeyByValue(projec, value);
  if (key) {
    const keyInDb = `citys.${key}.$`;
    const findMoassat = await req.db
      .collection("education_Directorates")
      .findOne(query, { projection: { [keyInDb]: 1, _id: 0 } });
    if (!findMoassat) {
      return res.json(findMoassat);
    }
    return res.json(findMoassat.citys[0][key]);
  }
  return res.end();
});
export default handler;

/*
{
      $and: [{ key: req.body.key, "citys.cle": body.key } }],
   }
*/
