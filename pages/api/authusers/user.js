import nextConnect from "next-connect";
import auth from "../../../middleware/auth";

const handler = nextConnect();

handler
  .use(auth)

  .get(async (req, res) => {
    // You do not generally want to return the whole user object
    // because it may contain sensitive field such as !!password!! Only return what needed

    if (req.user) {
      const { AccountType } = req.user;
      if (AccountType === "participant") {
        const { lastName, firstName, email } = await req.user;
        return res.json({ user: { lastName, firstName, email } });
      }
      if (AccountType === "manger") {
        const { lastName, firstName, email, wilaya, baldia, workSchool } =
          await req.user;
        return res.json({
          user: { lastName, firstName, email, wilaya, baldia, workSchool },
        });
      }
    }

    // res.json({ user: { name, username, favoriteColor } })

    return res.json({ user: "" });
  });
// .post(async (req, res) => {
//   const { email, password, name } = await req.body;

//   await insertUser(req);
//   //createUser(req, { email, password, name })
//   return res.status(200).json({ success: true, message: "created new user" });
// })
// handler.use(async (req, res, next) => {
//   // handlers after this (PUT, DELETE) all require an authenticated user
//   // This middleware to check if user is authenticated before continuing
//   if (!(await req.user)) {
//     return res.status(401).send("unauthenticated");
//   } else {
//     next();
//   }
// })
// .put(async (req, res) => {
//   const { name } = await req.body;
//   const user = await updateUserByUsername(req, req.user.email, { name });
//   return res.json({ user });
// })
// .delete(async (req, res) => {
//   await deleteUser(req.db, req.user._id);
//   req.logOut();
//   return res.status(204).end();
// });

export default handler;
