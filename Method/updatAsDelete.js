import nextConnect from "next-connect";

import auth, { AuthIsRequired } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { moassaSchema } from "../schemas/schemas_moassa";
import { getKeyByValue, projec, subjects } from "../middleware/StudySubjects";

export async function deleteSpecialtyFromMoassa(req, res) {
  /**
   * حذف تخصص من مدرسة ما
   * تحذف جميع المناصب سواء شاغر أو راغب أو... مهما كان العدد
   * في مدرسة ما
   * الحذف هذا فقط يشمل مادة واحدة وليس جميع المواد
   *
   *
   */

  /*التاكد من ان المعومات المرسلة موجودة في الداتا*** */
  const {
    wilaya,
    baldia,
    workSchool,
    educationalPhase,
    specialty,
    ...restBody
  } = await req.body;
  //مسار المادة في الداتا
  const elmada = `citys.${getKeyByValue(
    projec,
    educationalPhase
  )}.${getKeyByValue(subjects.secondaryObj, specialty)}.specialty`;
  //مسار رقم المؤسسة
  const workSchoolKey = `citys.${getKeyByValue(
    projec,
    educationalPhase
  )}.${getKeyByValue(subjects.secondaryObj, specialty)}.EtabMatricule`;

  //مسار اسم المؤسسة
  const workSchoolName = `citys.${getKeyByValue(
    projec,
    educationalPhase
  )}.${getKeyByValue(subjects.secondaryObj, specialty)}.EtabNom`;
  /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
  const simple_query = {
    $and: [
      {
        key: wilaya.key,
        value: wilaya.value,
        "citys.cle": baldia.cle,
        "citys.valeur": baldia.valeur,
        [workSchoolKey]: workSchool.EtabMatricule,
        [workSchoolName]: workSchool.EtabNom,
        [elmada]: specialty,
      },
    ],
  };
  console.log(simple_query);
  //path like => citys.$.primary.Arabic
  const workSchoolKeyforDelet = `citys.$.${getKeyByValue(
    projec,
    educationalPhase
  )}.${getKeyByValue(subjects.secondaryObj, specialty)}`; //like => Arabic
  const updateDocument = {
    $pull: {
      [workSchoolKeyforDelet]: { EtabMatricule: workSchool.EtabMatricule },
    },
  };
  const sample_collection = await req.db.collection("new_action");
  const sample_post = await sample_collection.updateOne(
    simple_query,
    updateDocument,
    { upsert: true }
  );
  const { modifiedCount, upsertedCount, matchedCount } = sample_post;
  console.log(
    "sample_postsample_postsample_post",
    modifiedCount,
    upsertedCount,
    matchedCount,

    "sample_postsample_postsample_post"
  );

  if (modifiedCount && matchedCount) {
    return res.status(201).json({ message: "تمت العملية بنجاح" });
  } else {
    return res.status(404).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
  }
}

//   if (!isExt ) {
//     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });
