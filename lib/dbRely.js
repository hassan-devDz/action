import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import normalizeEmail from "validator/lib/normalizeEmail";

export async function getAllUsers(req) {
  const findListUsers = await req.db.collection("users").find({}).toArray();

  return res.json(findListUsers);
}

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email);
  const user = await db.collection("users").findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    return { ...user, passwordHash: undefined }; // filtered out password
  }
  return null;
}

export async function findUserForAuth(db, userId) {
  return db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { passwordHash: 0 } })
    .then((user) => user || null);
}

export async function findUserById(
  db,
  userId,
  colc = "users",
  projection = { projection: dbProjectionUsers() }
) {
  return db
    .collection(colc)
    .findOne({ _id: new ObjectId(userId) }, projection)
    .then((user) => user || null);
}
export async function findUserByToken(db, token, colc = "verification_tokens") {
  return db
    .collection(colc)
    .findOne({ confirmationCode: token })
    .then((user) => user || null);
}
export async function findUserByTokenAndDelete(
  db,
  token,

  colc = "verification_tokens"
) {
  return db
    .collection(colc)
    .findOneAndDelete({
      $and: [{ confirmationCode: token, expires: { $gt: Date.now() } }],
    })
    .then((user) => user.value);
}

export async function findUserByUsername(db, username) {
  return db
    .collection("users")
    .findOne({ username }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUserByEmail(db, email, colc = "users") {
  email = normalizeEmail(email);
  return db
    .collection(colc)
    .findOne({ email })
    .then((user) => user || null);
}
export async function deleteUser(db, id) {
  // Here you should delete the user in the database
  // await db.deleteUser(req.user)

  const copy = await db.collection("users").findOne({ _id: new ObjectId(id) });
  const creat = await db.collection("deletcount").insertOne(copy);
  const reslt = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });
}
export async function updateUserById(db, id, data) {
  return db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after", projection: { password: 0 } }
    )
    .then(({ value }) => value);
}
export async function insertUserVerificationTokens(
  req,
  token,
  colc = "verification_tokens"
) {
  const { captcha, passwordConfirmation, password, createdAt, ...infoUser } =
    req.body;
  const user = {
    ...infoUser,
    AccountType: "participant",
    confirmationCode: token,
    createdAt: new Date(createdAt).getTime(),
    expires: new Date(createdAt).getTime() + 60 * 60 * 1000, //expired After 1H
  };
  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;
  const { insertedId } = await req.db.collection(colc).insertOne({ ...user });
  user._id = new ObjectId(insertedId);

  return user;
}
export async function insertPasswordVerificationTokens(
  req,
  token,
  colc = "reset_password"
) {
  const { captcha, email } = req.body;

  const user = {
    email,
    confirmationCode: token,

    expires: Date.now() + 60 * 60 * 1000, //expired After 1H
  };

  const findOneAndUpdate = await req.db
    .collection(colc)
    .findOneAndUpdate(
      { email: email },
      { $set: user },
      { upsert: true, returnNewDocument: true }
    )
    .then((user) => user.value);
}
export async function insertUser(req, colc = "users") {
  const { confirmationCode, expires, ...user } = req.body;
  const insert = await req.db.collection(colc).insertOne({ ...user });

  return user;
}
export async function findAndUpdate(req, query, newdoc, colc = "users") {
  return req.db
    .collection(colc)
    .findOneAndUpdate(
      query,
      { $set: { ...newdoc } },
      { upsert: false, returnNewDocument: true }
    )
    .then((user) => user.value);
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection("users").findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await bcrypt.compare(oldPassword, user.password);
  if (!matched) return false;
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = "") {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}
