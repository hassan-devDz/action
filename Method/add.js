import bcrypt from "bcryptjs";
import { findUserByEmail, insertUser } from "../lib/dbRely";
import { nanoid } from "nanoid";

export async function addUserFromManger(req, res) {
  const { email, ...resBody } = await req.body;
  const { baldia, wilaya, educationalPhase, workSchool } = await req.user;
  const passwordHash = await bcrypt.hash(nanoid(), 10);
  const info = {
    accountType: {
      value: "أستاذ",
      key: 1,
    },
    accept: true,
    addFromManger: true,
    approved: true,
    passwordHash: passwordHash,
    createdAt: new Date().getTime(),
  };

  const findTokenInDb = await findUserByEmail(req.db, email);
  if (findTokenInDb) {
    return res.status(401).json({ message: "أعد ايميل غير هذا" });
  }

  if (!findTokenInDb) {
    //const { _id, ...restBody } = await findTokenInDb;
    req.body = {
      ...resBody,
      email,
      baldia,
      wilaya,
      educationalPhase,
      workSchool,
      ...info,
    };
    const inset = await insertUser(req);
    if (inset) {
      return res.status(201).json({
        message: "تهانينا لقد تمت العملية بنجاح",
      });
    } else {
      return res.status(401).json({ message: "هناك خطأ ما" });
    }
  }
  return res.status(401).json({ message: "هناك خطأ ما" });
}
