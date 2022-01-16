import { subjects } from "../middleware/StudySubjects";

import { getKeyByValue, projec } from "../middleware/StudySubjects";

export async function getListMoassatForUser(req, res) {
  /**
   *  خاصة بالاستاذ ترجع جميع المناصب المتنافس عليها في ولايته وفي اختصاصه فقط

   */
  const { year } = await req.query;
  const {
    wilaya,

    educationalPhase,
    specialty,
    ...restBody
  } = await req.user;
  //مسار المستوى
  const educationalPhasePath = `citys.${getKeyByValue(
    projec,
    educationalPhase
  )}`; // ex => citys.primary
  // مادة التدريس
  const specialtyName = getKeyByValue(subjects.secondaryObj, specialty); //ex => Arabic
  //مسار المادة في الداتا
  const specialtyNamePath = `${educationalPhasePath}.${specialtyName}`; //ex => citys.primary.Arabic
  //!نفس الوظيفة الي فوق
  const key = getKeyByValue(projec, educationalPhase); //ex => primary
  const keyOfspecialty = getKeyByValue(subjects[`${[key]}Obj`], specialty); //ex => Arabic
  const keyOfspecialty2 = `citys.$.${[key]}.${keyOfspecialty}`; //citys.primary.Arabic
  //! انتهى التعليق على نفس الوظيفة الي فوق
  /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
  const simple_query = {
    $and: [
      {
        key: wilaya.key,
        value: wilaya.value,

        [specialtyNamePath]: { $elemMatch: { specialty } },
      },
    ],
  };

  /**** الاصلية التاكد من ان المعومات المرسلة موجودة في الداتا*** */

  //! انتهى التأكد من المعلومات المرسلة */

  //البحث عن كل المعلومات الواردة من المستخدم والتي طلب اضافتها هل موجودة سابقا او لا
  console.log(simple_query, "simple_querysimple_query", req);
  const isDataExt = await req.db
    .collection(`new_action_${year}`)
    .findOne(simple_query, {
      projection: {
        [specialtyNamePath]: 1,
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
}

export async function getListForSchoolManager(req, res) {
  // المدير
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

  if (req.user) {
    //مؤجلة
  }
  const {
    wilaya,
    baldia,
    workSchool,
    specialty,
    educationalPhase,
    accountType,
    ...restBody
  } = await req.user;
  //السنة
  const { year } = await req.query;
  // مسار المستوى
  const educationalPhasePath = `citys.${getKeyByValue(
    projec,
    educationalPhase
  )}`; //todo ex => citys.primary
  // مادة التدريس
  const specialtyName = getKeyByValue(subjects.secondaryObj, specialty); //ex => Arabic
  //مسار رقم المؤسسة
  const workSchoolKey = `${educationalPhasePath}.${specialtyName}.EtabMatricule`;

  //مسار اسم المؤسسة
  const workSchoolName = `${educationalPhasePath}.${specialtyName}.EtabNom`;
  /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
  const simple_query = {
    $and: [
      {
        wilaya,
        baldia,
        workSchool,
        educationalPhase,
        "accountType.key": 1,
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
    .collection(`users_${year}`)
    .find(simple_query, {
      projection: {
        wilaya: 0,
        baldia: 0,
        workSchool: 0,
        educationalPhase: 0,
        AccountType: 0,
        passwordHash: 0,
      },
    })
    .toArray();

  console.log(isDataExt, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
  if (!isDataExt) {
    return res.status(200).json({});
  }
  //البحث عن الولاية والبلدية فقط لكي لا تتداخل المعلومات ولتنسيق داتا الحركة الجديدة عند التحديث
  return res.status(200).json(isDataExt);
}

export async function getAllUsersForWilayaAndEducationalPhase(req, res) {
  /**
   *
   *
   * خاصة برئيس المكتب لأحد الأطوار
   * وظيفتها ترجع جميع الأساتذة بدون استثناء
   *في سنة الحركة
   *كل المواد
   * */

  const { year } = await req.query;
  const {
    wilaya,

    educationalPhase,
    accountType,
    ...restBody
  } = await req.user;
  const simple_query = {
    $and: [
      {
        wilaya, //نفس ولاية رئيس المكتب
        educationalPhase, // اختصاص رئيس المكتب ابتدائي متوسط...ثانوي
        approved: true, // يجب أن يظهر فقط من أكده المدير
        "accountType.key": { $in: [1] }, //خاص فقط بالاساتذة
      },
    ],
  };
  /*--------------------------------------------------------رئيس مكتب-----------استعلام حول الاساتذة المشاركين في الحركة*/
  const findListUsers = await req.db

    .collection(`users_${year}`)
    .find(simple_query, {
      projection: {
        wilaya: 0,
        accept: 0,
        email: 0,
        educationalPhase: 0,
        approved: 0,
        accountType: 0,
        passwordHash: 0,
      },
    })
    .toArray();

  return res.json(findListUsers);
}
