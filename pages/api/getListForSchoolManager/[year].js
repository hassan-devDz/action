import nextConnect from "next-connect";
import {
  getListForSchoolManager,
  getListMoassatForUser,
} from "../../../Method/getInfo";
import auth, { AuthIsRequired } from "../../../middleware/auth";

//صفحة المدير
/**
 * معلومات المدير تتكون من
 *المستوى ابتدائي ثانو متوسط
 * الولا الاسم واللفب
 *ثانيا مؤسسة العمل
 *الولاية والبلدية
 *  الرقم الوظيفي
 *تاريخ انشاء الحساب
 * تاريخ الازدياد
 * نوع الحساب = مدير
 * الايميل وكلمة السر
 */

const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    const userKey = await req.user.accountType.key;
    if (userKey === 1) {
      await getListMoassatForUser(req, res);
    }
    if (userKey === 2) {
      await getListForSchoolManager(req, res);
    }
  });

export default handler;
