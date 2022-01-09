import nextConnect from "next-connect";

import auth, { AuthIsRequired } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";
import {
  getKeyByValue,
  projec,
  subjects,
} from "../../middleware/StudySubjects";

const handler = nextConnect();

handler
  .use(auth)
  .use(AuthIsRequired)
  .put(async (req, res) => {
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

    const potentialVacancUpdate = `citys.$.${getKeyByValue(
      projec,
      educationalPhase
    )}.${getKeyByValue(
      subjects.secondaryObj,
      specialty
    )}.$[elm].potentialVacancy`;
    const forcedUpdate = `citys.$.${getKeyByValue(
      projec,
      educationalPhase
    )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].forced`;
    const vacancyUpdate = `citys.$.${getKeyByValue(
      projec,
      educationalPhase
    )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].vacancy`;
    const surplusUpdate = `citys.$.${getKeyByValue(
      projec,
      educationalPhase
    )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].surplus`;
    const updateDocument = {
      $set: {
        [potentialVacancUpdate]: restBody.potentialVacancy,
        [forcedUpdate]: restBody.forced,
        [vacancyUpdate]: restBody.vacancy,
        [surplusUpdate]: restBody.surplus,
      },
    };
    const filter = {
      arrayFilters: [
        {
          $and: [
            {
              "elm.EtabMatricule": workSchool.EtabMatricule,
              "elm.specialty": specialty,
            },
          ],
        },
      ],
    };

    const sample_collection = await req.db.collection("new_action");
    const sample_post = await sample_collection.updateOne(
      simple_query,
      updateDocument,
      filter
    );
    const { modifiedCount, upsertedCount, matchedCount } = sample_post;

    if (modifiedCount && matchedCount) {
      return res.status(201).json({ message: "تمت العملية بنجاح" });
    } else if (!modifiedCount && matchedCount) {
      return res.status(422).json({ message: "لم يتم تغيير البيانات" });
    } else {
      return res
        .status(404)
        .json({ message: "لا يمكن تحديث بيانات غير موجودة" });
    }
  });

export default validate(moassaSchema, handler);

//   if (!isExt ) {
//     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });

// import nextConnect from "next-connect";

// import auth, { AuthIsRequired } from "../../middleware/auth";
// import { validate } from "../../middleware/validate";
// import { moassaSchema } from "../../schemas/schemas_moassa";

// const handler = nextConnect();

// handler
//   .use(auth)
//   .use(AuthIsRequired)
//   .put(async (req, res) => {
//     /*التاكد من ان المعومات المرسلة موجودة في الداتا*** */

//     /*^^^^الاستعلام عن ان المعومات المرسلة موجودة في الداتا^^^^*/
//     const simple_query = {

//       schools: {
//         $all: [
//           {
//             $elemMatch: {
//               "moassa.bladia": req.body.moassa.bladia,
//               "moassa.EtabMatricule": req.body.moassa.EtabMatricule,
//               "moassa.EtabNom": req.body.moassa.EtabNom,
//             },
//           },
//         ],
//       },
//     };

//     const updateDocument = {
//       $set: {
//         "schools.$.vacancy": req.body.vacancy,
//         "schools.$.surplus": req.body.surplus,
//         "schools.$.forced": req.body.forced,
//         "schools.$.potentialVacancy": req.body.potentialVacancy,
//       },
//     };

//     const sample_collection = await req.db.collection("sample");
//     const sample_post = await sample_collection.updateOne(
//       simple_query,
//       updateDocument,
//       false,
//       true
//     );
//     const { modifiedCount, upsertedCount, matchedCount } = sample_post;
//     console.log(
//       "sample_postsample_postsample_post",
//       modifiedCount,
//       upsertedCount,
//       matchedCount,
//       "sample_postsample_postsample_post"
//     );

//     if (modifiedCount && matchedCount) {
//       return res.status(201).json({ message: "تمت العملية بنجاح" });
//     } else if (!modifiedCount && matchedCount) {
//       return res.status(422).json({ message: "لم يتم تغيير البيانات" });
//     } else {
//       return res
//         .status(404)
//         .json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//     }
//   });

// export default validate(moassaSchema, handler);

//   if (!isExt ) {
//     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });
