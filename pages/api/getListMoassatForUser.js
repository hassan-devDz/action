import nextConnect from "next-connect";
import { subjects } from "../../middleware/StudySubjects";
import auth, { AuthIsRequired } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";
import { getKeyByValue, projec } from "../../middleware/StudySubjects";
import { nanoid } from "nanoid";

const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .get(async (req, res) => {
    const {
      wilaya,

      educationalPhase,
      specialty,
      ...restBody
    } = await req.user;

    //مسار المادة في الداتا
    const elmada = `citys.${getKeyByValue(
      projec,
      educationalPhase
    )}.${getKeyByValue(subjects.secondaryObj, specialty)}.specialty`;

    /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
    const simple_query = {
      $and: [
        {
          key: wilaya.key,
          value: wilaya.value,
          [elmada]: specialty,
        },
      ],
    };
    const key = getKeyByValue(projec, educationalPhase);

    /**** الاصلية التاكد من ان المعومات المرسلة موجودة في الداتا*** */

    //! انتهى التأكد من المعلومات المرسلة */

    const valueOfTor = `citys.${[key]}`;
    const keyOfspecialty = getKeyByValue(subjects[`${[key]}Obj`], specialty);
    const keyOfspecialty2 = `citys.$.${[key]}.${keyOfspecialty}`;
    //البحث عن كل المعلومات الواردة من المستخدم والتي طلب اضافتها هل موجودة سابقا او لا
    console.log(simple_query, "simple_querysimple_query");
    const isDataExt = await req.db
      .collection("new_action")
      .findOne(simple_query, {
        projection: {
          "citys.primary.Arabic": 1,
          "citys.cle": 1,
          "citys.valeur": 1,
          _id: 0,
        },
      });

    console.log(isDataExt, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    if (!isDataExt) {
      return res.status(200).json({});
    }
    //البحث عن الولاية والبلدية فقط لكي لا تتداخل المعلومات ولتنسيق داتا الحركة الجديدة عند التحديث
    return res.status(200).json(isDataExt);

    //var url = new URL(req.headers.referer);
  });

export default handler;
