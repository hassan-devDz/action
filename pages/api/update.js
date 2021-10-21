import nextConnect from "next-connect";

import middleware from "../../middleware/connectDb";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";

const handler = nextConnect();

handler.use(middleware);
handler.put(async (req, res) => {
  /*التاكد من ان المعومات المرسلة موجودة في الداتا*** */

  /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
  const simple_query = {
    ...req.query,
    schools: {
      $all: [
        {
          $elemMatch: {
            "moassa.bladia": req.body.moassa.bladia,
            "moassa.EtabMatricule": req.body.moassa.EtabMatricule,
            "moassa.EtabNom": req.body.moassa.EtabNom,
          },
        },
      ],
    },
  };

  const updateDocument = {
    $set: {
      "schools.$.vacancy": req.body.vacancy,
      "schools.$.surplus": req.body.surplus,
      "schools.$.forced": req.body.forced,
      "schools.$.potentialVacancy": req.body.potentialVacancy,
    },
  };

  const sample_collection = await req.db.collection("sample");
  const sample_post = await sample_collection.updateOne(
    simple_query,
    updateDocument,
    false,
    true
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
  } else if (!modifiedCount && matchedCount) {
    return res.status(422).json({ message: "لم يتم تغيير البيانات" });
  } else {
    return res.status(404).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
  }
});

export default validate(moassaSchema, handler);

//   if (!isExt ) {
//     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });
