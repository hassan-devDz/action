import nextConnect from "next-connect";
import passport from "../lib/passport";
import session from "../lib/session";
import database from "../lib/database";
import { findUserByEmail } from "../lib/dbRely";

const auth = nextConnect()
  .use(database)
  .use(
    session({
      name: "sess",
      secret: process.env.TOKEN_SECRET,
      cookie: {
        maxAge: 60 * 60 * 8, // 8 hours,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      },
    })
  )

  .use(passport.initialize())
  .use(passport.session());

export default auth;
export const AuthNotRequired = nextConnect().use((req, res, next) => {
  if (req.isAuthenticated()) {
    return res
      .status(409)
      .json({ message: "أنت فعلا مسجل الدخول ", err: req.user });
  }
  next();
});
export const AuthIsRequired = nextConnect().use((req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "غير مصرح يجب عليك التسجيل " });
  }
  next();
});
export const isAprroved = nextConnect().use(async (req, res, next) => {
  const { email } = await req.body;
  const { approved } = await findUserByEmail(req.db, email);

  if (!approved) {
    return res
      .status(403)
      .json({ message: "لم تتم الموافقة بعد على حسابك من طرف مسؤولك المباشر" });
  }
  next();
});
