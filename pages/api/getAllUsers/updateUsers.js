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

      approved,
      //بقية المعلومات غير قابلة للتعديل تصلح للاستعلام فقط
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
        approved,
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
      modifiedCount,

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
  });

export default handler;
//new ObjectId(req.body.id)
