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

    const deleteToken = await findUserByTokenAndDelete(req.db, token);
    if (!deleteToken) {
      return res
        .status(401)
        .json({ message: "رمز التحقق خاطئ أو انتهت صلاحيتة" });
    }

    if (deleteToken) {
      req.body = deleteToken;
      const inset = await insertUser(req);

      return req.logIn(inset, (err) => {
        if (err) throw err;
        // Log the signed up user in
        return res.status(201).json({ user: req.user });
      });
    }
    return res.status(401).json({ message: "هناك خطأ ما" });
  });

export default handler;
