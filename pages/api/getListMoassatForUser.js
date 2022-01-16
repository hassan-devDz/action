import nextConnect from "next-connect";

import auth, { AuthIsRequired } from "../../middleware/auth";

import { getListMoassatForUser } from "../../Method/getInfo";
//صفحة خاصة بالاستاذ ترجع جميع المناصب المتنافس عليها في ولايته وفي اختصاصه فقط
const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    await getListMoassatForUser(req, res);
  });

export default handler;
