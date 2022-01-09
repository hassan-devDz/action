import auth, { AuthIsRequired } from "../../middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    const query = await req.query;

    const findWilayaAndBaldia = await req.db
      .collection("new_action")
      .find(query, { projection: { _id: 0 } })
      .toArray();
    res.json(findWilayaAndBaldia);
  });

export default handler;
