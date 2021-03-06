import nextConnect from "next-connect";
import auth, { AuthIsRequired } from "../../../middleware/auth";
import { LoggerLevel, ObjectId } from "mongodb";
import { insertUser } from "../../../lib/dbRely";
const handler = nextConnect();

/**
 * تعديل وحذف استاذ من طرف المدير
 * خاصة بالادمن او المدير المركزي حيث لا يمكنه ت
 */

handler
  .use(auth)
  .use(AuthIsRequired)
  .put(async (req, res) => {
    const { year } = await req.query;
    const {
      _id, //المعرف غير قابل للتعديل

      dateOfBirth,
      ...restBody //بقية المعلومات غير قابلة للتعديل تصلح للاستعلام فقط
    } = await req.body;
    const simple_query = {
      $and: [
        {
          _id: new ObjectId(_id),
        },
      ],
    };
    const updateDocument = {
      $set: {
        ...restBody,
        dateOfBirth: new Date(dateOfBirth),
      },
    };
    console.log(req.user);
    //البحث عن المستخدم أولا والتأكد من وجوده في قاعدة البيانات
    const findUser = await req.db
      .collection(`users_${year}`)
      .updateOne(simple_query, updateDocument, {
        projection: { passwordHash: 0 },
      });
    const {
      acknowledged,
      modifiedCount,
      upsertedId,
      upsertedCount,
      matchedCount,
    } = findUser;
    if (!matchedCount) {
      return res.status(400).json({ message: "معلومات غير موجودة" });
    }
    if (matchedCount && modifiedCount) {
      return res.status(201).json({ message: "تم تعديل البيانات بنجاح" });
    }
    if (matchedCount) {
      return res.status(422).json({ message: "لم يتم تغيير البيانات" });
    }

    return res.json(findUser);
  })
  .delete(async (req, res) => {
    console.log(req.user, "userrrrr");
    const { year } = await req.query;
    const { _id } = await req.body;
    const simple_query = {
      _id: new ObjectId(_id),
    };

    const deleteUser = await req.db
      .collection(`users_${year}`)
      .findOneAndDelete(simple_query);

    const { value } = deleteUser;
    console.log(value, "findOneAndDelete");
    if (!value) {
      return res.status(400).json({ message: "معلومات غير موجودة" });
    }
    if (value) {
      const { _id, ...restBody } = await value;
      req.body = restBody;
      const inset = await insertUser(req, `users_delete_${year}`);
      return res.status(201).json({ message: "تم الحذف بنجاح" });
    }

    return res.status(422).json({ message: "حدث خطأ ما" });
  });
export default handler;
//new ObjectId(req.body.id)
