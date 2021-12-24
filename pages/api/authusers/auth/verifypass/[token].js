import nextConnect from "next-connect";
import {
  findUserByToken,
  findUserByTokenAndDelete,
  insertUser,
} from "../../../../../lib/dbRely";

import auth, { AuthNotRequired } from "../../../../../middleware/auth";

const handler = nextConnect();
handler

  .use(auth)
  .use(AuthNotRequired)
  .get(async (req, res) => {
    const { token } = await req.query;

    ///

    const findToken = await findUserByToken(req.db, token, "reset_password");

    return res.json({ valid: !!findToken });
  });

export default handler;
