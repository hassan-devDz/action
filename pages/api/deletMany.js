import nextConnect from "next-connect";

import middleware from "../../middleware/connectDb";
import { validate } from "../../middleware/validate";
import { arrayMoassaSchema } from "../../schemas/schemas_moassa";

const handler = nextConnect();

handler.use(middleware);
handler.put(async (req, res) => {
  /*التاكد من ان المعومات المرسلة موجودة في الداتا*** */
console.log(req.query);
  /*^^^^التاكد من ان المعومات المرسلة موجودة في الداتا^^^^*/
  const simple_query = {
    year: req.query.Year
  };


  const updateDocument = {
    $pull: {
      schools: {
        "moassa.EtabMatricule": {
          "$in": req.body.arrayEtabMatricule
        }
      }
    }
  };
  const sample_collection = await req.db.collection("sample");
  const sample_post = await sample_collection.updateOne(
    simple_query,
    updateDocument,false,true
  );
  const { modifiedCount, upsertedCount, matchedCount } = sample_post;
  console.log(
    "sample_postsample_postsample_post",
    modifiedCount,
    upsertedCount,
    matchedCount,
    sample_post,
    "sample_postsample_postsample_post"
  );

  if (modifiedCount && matchedCount) {
    return res.status(200).json({message:"تمت العملية بنجاح"})
  }  else {
    return res.status(404).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
  }

});

export default validate(arrayMoassaSchema, handler);

  //   if (!isExt ) {
  //     return res.status(422).json({ message: "لا يمكن تحديث بيانات غير موجودة" });
  //   }
  //   return res.status(422).json({ message: "هناك خطأ ما" });