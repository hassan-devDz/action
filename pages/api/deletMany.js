import nextConnect from "next-connect";

import auth, { AuthIsRequired } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { arrayMoassaSchema } from "../../schemas/schemas_moassa";
import {
  getKeyByValue,
  projec,
  subjects,
} from "../../middleware/StudySubjects";

const handler = nextConnect();
//حذف المؤسسات هذه الصفحة خاصة ب رئيس المصلحة أو من هو أعلى درجة منه
handler
  .use(auth)
  .use(AuthIsRequired)
  .put(async (req, res) => {
    let arr = [];
    function lop(arrayEtabMatricule) {
      let workSchoolKeyforDelet;

      for (let index = 0; index < arrayEtabMatricule.length; index++) {
        let element = arrayEtabMatricule[index];

        const workSchoolKey = `citys.${getKeyByValue(
          projec,
          element.educationalPhase
        )}.${getKeyByValue(
          subjects.secondaryObj,
          element.specialty
        )}.EtabMatricule`;
        workSchoolKeyforDelet = `citys.$.${getKeyByValue(
          projec,
          element.educationalPhase
        )}.${getKeyByValue(subjects.secondaryObj, element.specialty)}`; //like => Arabic

        arr.push({
          updateOne: {
            filter: {
              key: element.key,
              "citys.cle": element.cle,
              [workSchoolKey]: arrayEtabMatricule[index].EtabMatricule,
            },
            update: {
              $pull: {
                [workSchoolKeyforDelet]: {
                  EtabMatricule: arrayEtabMatricule[index].EtabMatricule,
                },
              },
            },
            upsert: true,
          },
        });
      }
    }

    const arrayEtabMatricule = await req.body.arrayEtabMatricule;
    lop(arrayEtabMatricule);
    try {
      const sample_collection = await req.db.collection("new_action");
      const sample_post = await sample_collection.bulkWrite(arr);
      const { modifiedCount, upsertedCount, matchedCount } = sample_post;

      if (modifiedCount && matchedCount) {
        return res.status(200).json({ message: "تمت العملية بنجاح" });
      } else {
        return res
          .status(422)
          .json({ message: "لا يمكن تحديث بيانات غير موجودة" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "حدث خطأ ما قد يكون الاستعلام خاطئ أو البيانات قد حذفت ",
      });
    }
  });

export default validate(arrayMoassaSchema, handler);

//   if (!isExt ) {
//     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });
//   const simple_query = {};
//   const potentialVacancUpdate = `citys.$.${getKeyByValue(
//     projec,
//     educationalPhase
//   )}.${getKeyByValue(
//     subjects.secondaryObj,
//     specialty
//   )}.$[elm].potentialVacancy`;
//   const forcedUpdate = `citys.$.${getKeyByValue(
//     projec,
//     educationalPhase
//   )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].forced`;
//   const vacancyUpdate = `citys.$.${getKeyByValue(
//     projec,
//     educationalPhase
//   )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].vacancy`;
//   const surplusUpdate = `citys.$.${getKeyByValue(
//     projec,
//     educationalPhase
//   )}.${getKeyByValue(subjects.secondaryObj, specialty)}.$[elm].surplus`;
//   console.log(req.body.arrayEtabMatricule);
//   const updateDocument = {
//     $pull: {
//       citys:
//         $and[
//           {
//             "moassa.EtabMatricule": {
//               $in: req.body.arrayEtabMatricule,
//             },
//           }
//         ],
//     },
//   };
//  db.students3.updateMany(
//    {},
//    { $pull: { "citys.$[elm]": 2 } },
//    {
//      arrayFilters: [
//        {
//          elm: { $in: ["primary", "middle", "secondary"] },
//          //score: { $in: ["primary", "middle", "secondary"] },
//        },
//      ],
//    }
//  );
