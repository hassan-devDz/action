import nextConnect from "next-connect";
import auth, { AuthNotRequired } from "../../../middleware/auth";
import { reSetPassword } from "../../../middleware/sendemail";

import verifycaptcha from "../../../middleware/verifyCaptcha";
const handler = nextConnect();

handler
  .use(verifycaptcha)
  .use(auth)
  .use(AuthNotRequired)
  .post(async (req, res) => {
    const user = await reSetPassword(req, res);
  });
export default handler;
