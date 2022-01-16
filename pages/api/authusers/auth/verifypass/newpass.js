import nextConnect from "next-connect";
import {
  findUserByToken,
  findUserByTokenAndDelete,
  findAndUpdate,
} from "../../../../../lib/dbRely";
import bcrypt from "bcryptjs";
import auth, { AuthNotRequired } from "../../../../../middleware/auth";
import verifycaptcha from "../../../../../middleware/verifyCaptcha";
const handler = nextConnect();
handler
  .use(verifycaptcha)
  .use(auth)
  .use(AuthNotRequired)
  .put(async (req, res) => {
    const { token, password } = await req.body;

    ///

    const findToken = await findUserByTokenAndDelete(
      req.db,
      token,
      `reset_password_${new Date().getFullYear()}`
    );
    if (findToken) {
      const { email } = findToken;
      const passwordHash = await bcrypt.hash(password, 10);
      const upDatepass = await findAndUpdate(
        req,
        { email: email },
        {
          passwordHash: passwordHash,
        }
      );
      return res.status(201).json({ message: "Updated successfully" });
    }

    return res.json({ valid: findToken });
  });

export default handler;
