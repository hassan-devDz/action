import nextConnect from "next-connect";
import auth, { AuthNotRequired } from "../../../middleware/auth";
import sendVerificationEmail from "../../../middleware/sendemail";
import { validate } from "../../../middleware/validate";
import verifycaptcha from "../../../middleware/verifyCaptcha";
import { FormInfoInterestedSchema } from "../../../schemas/schemas_moassa";

const handler = nextConnect();

handler
  .use(verifycaptcha)
  .use(auth)
  .use(AuthNotRequired)
  .post(async (req, res) => {
    const user = await sendVerificationEmail(req, res);
  });

export default validate(FormInfoInterestedSchema, handler);
