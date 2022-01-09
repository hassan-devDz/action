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
    try {
      const { token } = await req.query;

      ///

      const findTokenInDb = await findUserByTokenAndDelete(req.db, token);
      if (!findTokenInDb) {
        return res
          .status(401)
          .json({ message: "رمز التحقق خاطئ أو انتهت صلاحيتة" });
      }

      if (findTokenInDb) {
        req.body = findTokenInDb;
        const inset = await insertUser(req);

        return req.logIn(inset, (err) => {
          if (err) throw err;
          // Log the signed up user in
          const { lastName, firstName, email } = req.user;
          return res.status(201).json({
            user: { lastName, firstName, email },
            message: "تهانينا لقد تم تفعيل حسابك بنجاح",
          });
        });
      }
      return res.status(401).json({ message: "هناك خطأ ما" });
    } catch (error) {
      return res.status(500).json({ message: "هناك خطأ ما" });
    }
  });

export default handler;
