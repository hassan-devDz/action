import nextConnect from "next-connect";
import { subjects } from "../../middleware/StudySubjects";
import auth, { AuthIsRequired } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";
import { getKeyByValue, projec } from "../../middleware/StudySubjects";
import { nanoid } from "nanoid";

const handler = nextConnect();
// صفحة خاصة باضافة منصب شاغر او راغب او ..... الى الداتا
handler
  .use(auth)
  .use(AuthIsRequired)
  .post(async (req, res) => {
    const {
      wilaya,
      baldia,
      workSchool,
      educationalPhase,
      specialty,
      ...restBody
    } = await req.body;
    const year = req.query.year;
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
    const key = getKeyByValue(projec, educationalPhase);
    console.log(subjects[key].includes(specialty), key, req.query);
    if (!subjects[key].includes(specialty)) {
      return res.status(400).json({ error: "بيانات غير صحيحة" });
    }
    const EtabMatricule = `citys.${key}.EtabMatricule`;
    const EtabNom = `citys.${key}.EtabNom`;

    /**** الاصلية التاكد من ان المعومات المرسلة موجودة في الداتا*** */
    const isDataInDb = await req.db
      .collection("education_Directorates")
      .findOne({
        $and: [
          {
            key: wilaya.key,
            value: wilaya.value,
            "citys.cle": baldia.cle,
            "citys.valeur": baldia.valeur,
            [EtabMatricule]: workSchool.EtabMatricule,
            [EtabNom]: workSchool.EtabNom,
          },
        ],
      });
    if (!isDataInDb) {
      return res.status(400).json({ error: "بيانات غير صحيحة" });
    }
    //! انتهى التأكد من المعلومات المرسلة */

    const valueOfTor = `citys.${[key]}`;
    const keyOfspecialty = getKeyByValue(subjects[`${[key]}Obj`], specialty);
    const keyOfspecialty2 = `citys.$.${[key]}.${keyOfspecialty}`;
    //البحث عن كل المعلومات الواردة من المستخدم والتي طلب اضافتها هل موجودة سابقا او لا
    console.log(simple_query, "simple_querysimple_query");
    const isDataExt = await req.db
      .collection(`new_action_${year}`)
      .findOne(simple_query);

    if (isDataExt) {
      return res.status(422).json({ message: "موجود بالفعل" });
    }
    //البحث عن الولاية والبلدية فقط لكي لا تتداخل المعلومات ولتنسيق داتا الحركة الجديدة عند التحديث
    const findWilayaAndBaldia = await req.db
      .collection(`new_action_${year}`)
      .findOne({
        $and: [{ "citys.cle": baldia.cle, "citys.valeur": baldia.valeur }],
      });

    if (findWilayaAndBaldia) {
      //التحديث الثاني بعد وجود الولاية والبلدية
      const nextUpdate = await req.db
        .collection(`new_action_${year}`)
        .updateOne(
          {
            $and: [
              {
                key: wilaya.key,
                value: wilaya.value,
                "citys.cle": baldia.cle,
                "citys.valeur": baldia.valeur,
              },
            ],
          },

          {
            $addToSet: {
              [keyOfspecialty2]: {
                ...workSchool,
                specialty: specialty,
                ...restBody,
                id: nanoid(),
              },
            },
          },
          { upsert: true }
          //{ arrayFilters: [{ "elem.userId": "123" }] }
        );
      const { modifiedCount, upsertedCount, matchedCount } = nextUpdate;
      if (modifiedCount || upsertedCount) {
        return res.status(201).json({ message: "تمت العملية بنجاح" });
      }
    }
    if (!findWilayaAndBaldia) {
      //التحديث لاول مرة تسجيل الولاية والبلدية
      const firstUpdate = await req.db.collection(`new_action_${year}`).update(
        {
          key: wilaya.key,
          value: wilaya.value,
        },

        {
          $addToSet: {
            citys: {
              ...baldia,
              [key]: {
                [keyOfspecialty]: [
                  {
                    ...workSchool,
                    specialty: specialty,
                    ...restBody,
                    id: nanoid(),
                  },
                ],
              },
            },
          },
        },
        { upsert: true }
      );

      const { modifiedCount, upsertedCount, matchedCount } = firstUpdate;
      if (modifiedCount || upsertedCount) {
        return res.status(201).json({ message: "تمت العملية بنجاح" });
      }

      return res.status(422).json({ message: "هناك خطأ ما" });
    }
    return res.status(422).json({ message: "هناك خطأ ما" });
    // { "year": "2021" ,"schools": { $all: [{"$elemMatch":{"moassa.bladia":"عين معبد","moassa.EtabMatricule":17051002}}] } }

    // const data = req.body.daira === "الجلفة" ? Djelfa : NotDjelfa;
    // const Hassan_query = await Hassan_collection_query.findOne(data);

    // if (!Hassan_query) {
    //   return res.status(400).json({ error: "بيانات غير صحيحة" });
    // }

    // /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */

    // const sample_collection = await req.db.collection("sample");

    // const isExt = await sample_collection.findOne({
    //   ...req.query,
    //   "schools.moassa.EtabMatricule": { $eq: req.body.moassa.EtabMatricule },
    // });

    // if (!isExt) {
    //   const sample_post = await sample_collection.updateOne(
    //     { ...req.query },
    //     { $addToSet: { schools: req.body } },
    //     { upsert: true }
    //   );
    //   return res.status(201).json({ message: "تمت العملية بنجاح" });
    // }
    // if (isExt) {
    //   return res.status(422).json({ message: "موجود بالفعل" });
    // }
    // return res.status(422).json({ message: "هناك خطأ ما" });

    //var url = new URL(req.headers.referer);
  });

export default validate(moassaSchema, handler);
