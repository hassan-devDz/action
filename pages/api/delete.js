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
    year: "2021"
  };


  const updateDocument = {
    $pull: { schools:{"moassa.EtabMatricule": req.body.moassa.EtabMatricule }}
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
    return res.status(200).send("ok");
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