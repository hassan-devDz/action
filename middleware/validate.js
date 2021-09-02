



export function validate(
  schema,
  handler
) {
  return async (req, res) => {
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
    }
    await handler(req, res);
  };
}