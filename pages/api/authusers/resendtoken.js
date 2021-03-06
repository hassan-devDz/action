import nextConnect from "next-connect";
import auth, { AuthNotRequired } from "../../../middleware/auth";
import { reSendVerificationEmail } from "../../../middleware/sendemail";

import verifycaptcha from "../../../middleware/verifyCaptcha";
const handler = nextConnect();

handler
  .use(verifycaptcha)
  .use(auth)
  .use(AuthNotRequired)
  .post(async (req, res) => {
    const user = await reSendVerificationEmail(req, res);
  });
export default handler;
