import { findUserByEmail } from "../lib/dbRely";

export function validate(schema, handler) {
  return async (req, res) => {
    if (["POST", "PUT"].includes(req.method)) {
      try {
        // const newSchema =
        //   req.method === 'POST'
        //     ? schema
        //     : schema.concat(object({ id: number().required().positive() }));
        console.log(req.url, "validate");

        if (req.url === "/api/authusers/signup") {
          const { accountType } = req.body;

          req.body = await schema(accountType)
            .camelCase()
            .validate(req.body, { abortEarly: false, stripUnknown: true });
        } else {
          req.body = await schema
            .camelCase()
            .validate(req.body, { abortEarly: false, stripUnknown: true });
        }
      } catch (error) {
        return res.status(400).json(error);
      }
    }
    await handler(req, res);
  };
}
export function validateAuth(authREq = true, schema, handler) {
  return async (req, res) => {
    const authed = await req.isAuthenticated(); //مسجل الدخول
    const notAuth = await req.isUnauthenticated();
    if (!authREq && authed) {
      //هذا مسجل فعلا
      return res.status(409).json({ message: " انت مسجل الدخول فعلا " });
    }
    if (authREq && notAuth) {
      //التسجيل مطلوب
      return res.status(401).json({ message: " غير مصرح لك" });
    }
    if (["POST", "PUT"].includes(req.method)) {
      try {
        // const newSchema =
        //   req.method === 'POST'
        //     ? schema
        //     : schema.concat(object({ id: number().required().positive() }));

        req.body = await schema
          .camelCase()
          .validate(req.body, { abortEarly: false, stripUnknown: true });
      } catch (error) {
        return res.status(400).json(error);
      }
    }

    await handler(req, res);
  };
}
export function validate1(schema, handler) {
  return async (req, res) => {
    const token = await getToken({ req, secret });

    if (["POST", "PUT"].includes(req.method) && !token) {
      try {
        // const newSchema =
        //   req.method === 'POST'
        //     ? schema
        //     : schema.concat(object({ id: number().required().positive() }));
        let data = await JSON.parse(req.body.data);

        data = await schema
          .camelCase()
          .validate(data, { abortEarly: false, stripUnknown: true });
      } catch (error) {
        return res.json({
          error: error.errors,
          status: 400,
          ok: false,
          url: null,
        });
      }
    }
    await handler(req, res);
  };
}
