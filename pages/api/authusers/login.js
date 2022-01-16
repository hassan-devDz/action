import nextConnect from "next-connect";
import auth, {
  AuthNotRequired,
  AuthIsRequired,
  isAprroved,
} from "../../../middleware/auth";
import passport from "../../../lib/passport";
import verifycaptcha from "../../../middleware/verifyCaptcha";
import { validate } from "../../../middleware/validate";
import { loginSchema } from "../../../schemas/schemas_moassa";
const handler = nextConnect();

// const sensitiveFields = ['email', 'emailVerified', 'password'];
// export function extractUser(user) {
//   if (!user) return null;
//   const obj = {};
//   Object.keys(user).forEach((key) => {
//     if (!sensitiveFields.includes(key)) obj[key] = user[key];
//   });
//   return obj;
// }

handler
  .use(verifycaptcha)
  .use(auth)
  .use(AuthNotRequired)
  //.use(isAprroved)
  .post(passport.authenticate("local"), (req, res) => {
    const { email } = req.user;
    return res.status(200).json({ user: req.user });
  });

export default validate(loginSchema, handler);
