// import nextConnect from "next-connect";
// import { subjects } from "../../middleware/StudySubjects";
// import auth, { AuthIsRequired } from "../../middleware/auth";
// import { validate } from "../../middleware/validate";
// import { moassaSchema } from "../../schemas/schemas_moassa";
// import { getKeyByValue, projec } from "../../middleware/StudySubjects";
// import { nanoid } from "nanoid";
// //صفحة المدير
// /**
//  * معلومات المدير تتكون من
//  *المستوى ابتدائي ثانو متوسط
//  * الولا الاسم واللفب
//  *ثانيا مؤسسة العمل
//  *الولاية والبلدية
//  *  الرقم الوظيفي
//  *تاريخ انشاء الحساب
//  * تاريخ الازدياد
//  * نوع الحساب = مدير
//  * الايميل وكلمة السر
//  */

// const handler = nextConnect();

// handler
//   .use(auth)
//   .use(AuthIsRequired)
//   .get(async (req, res) => {
//     const {
//       wilaya,
//       baldia,
//       workSchool,
//       specialty,
//       educationalPhase,
//       ...restBody
//     } = await req.user;

//     // مسار المستوى
//     const educationalPhasePath = `citys.${getKeyByValue(
//       projec,
//       educationalPhase
//     )}`; //todo ex => citys.primary
//     // مادة التدريس
//     const specialtyName = getKeyByValue(subjects.secondaryObj, specialty); //ex => Arabic
//     //مسار رقم المؤسسة
//     const workSchoolKey = `${educationalPhasePath}.${specialtyName}.EtabMatricule`;

//     //مسار اسم المؤسسة
//     const workSchoolName = `${educationalPhasePath}.${specialtyName}.EtabNom`;
//     /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
//     const simple_query = {
//       $and: [
//         {
//           ...wilaya,
//           ...baldia,
//           ...workSchool,
//         },
//       ],
//     };

//     const key = getKeyByValue(projec, educationalPhase);

//     /**** الاصلية التاكد من ان المعومات المرسلة موجودة في الداتا*** */

//     //! انتهى التأكد من المعلومات المرسلة */

//     const valueOfTor = `citys.${[key]}`;
//     const keyOfspecialty = getKeyByValue(subjects[`${[key]}Obj`], specialty);
//     const keyOfspecialty2 = `citys.$.${[key]}.${keyOfspecialty}`;
//     //البحث عن كل المعلومات الواردة من المستخدم والتي طلب اضافتها هل موجودة سابقا او لا
//     console.log(simple_query, "simple_querysimple_query");
//     const isDataExt = await req.db
//       .collection("users_2021")
//       .findOne(simple_query, {
//         projection: {
//           passwordHash: 0,
//           _id: 0,
//         },
//       });

//     console.log(isDataExt, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
//     if (!isDataExt) {
//       return res.status(200).json({});
//     }
//     //البحث عن الولاية والبلدية فقط لكي لا تتداخل المعلومات ولتنسيق داتا الحركة الجديدة عند التحديث
//     return res.status(200).json(isDataExt);
//   });

// export default handler;
