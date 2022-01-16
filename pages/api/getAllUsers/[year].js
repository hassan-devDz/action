import nextConnect from "next-connect";
import auth, { AuthIsRequired } from "../../../middleware/auth";
import { getAllUsersForWilayaAndEducationalPhase } from "../../../Method/getInfo";
const handler = nextConnect();
//رئيس مكتب
handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    getAllUsersForWilayaAndEducationalPhase(req, res);
  });
export default handler;
