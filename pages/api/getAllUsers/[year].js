import nextConnect from "next-connect";
import auth, { AuthIsRequired } from "../../../middleware/auth";
const handler = nextConnect();
handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    const { year } = await req.query;
    console.log(year);
    const findListUsers = await req.db

      .collection(`users_${year}`)
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();

    return res.json(findListUsers);
  });
export default handler;
