

import { getToken } from "next-auth/jwt"

const secret = "INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw"
export function auth(handler){
  return async (req, res) => {
    const token = await getToken({ req, secret })
    console.log(token);
    if (!token) {
     return res.status(401).json({message:"غير مصرح"})
    }
    await handler(req, res);
  };
}


export function validate(
  schema,
  handler
) {
  return async (req, res) => {
    const token = await getToken({ req, secret })
   
    if (['POST', 'PUT'].includes(req.method)) {
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
    }if (!token) {
     
     return res.status(401).json({message:"Not Signed in"})
    }
    await handler(req, res);
  };
}