import auth, { AuthIsRequired } from "../../../middleware/auth";
import nextConnect from "next-connect";
import { AddUserFromManger } from "../../../schemas/schemas_moassa";
import { validate } from "../../../middleware/validate";
import { addUserFromManger } from "../../../Method/add";
const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .post(async (req, res) => {
    await addUserFromManger(req, res);
  });

export default validate(AddUserFromManger, handler);
