import nextConnect from "next-connect";

import middleware from "../../middleware/connectDb";
import { validate } from "../../middleware/validate";
import { itemsSchema } from "../../schemas/schemas_moassa";

const result = (object1, object2) =>
  Object.keys(object1).every((key) => object1[key] === object2[key]);

const difference = (dataBase, Queri) =>
  dataBase.filter((db) => {
    const { moassa: moassaDb, ...dairaDb } = db;
    return Queri.some((dataQueri) => {
      const { moassa: moassaQueri, ...dairaQueri } = dataQueri;
      return result(moassaDb, moassaQueri) && result(dairaDb, dairaQueri);
    });
  });
const handler = nextConnect();

handler.use(middleware);
handler.post(async (req, res) => {
  const query = await req.body.items;

  /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */
  const Hassan_collection_query = await req.db.collection("sample");

  const Hassan_query = await Hassan_collection_query.findOne({
    ...req.query,
  });
  if (!Hassan_query) {
    return res.status(404).send("notfound");
  }
  const choise_collection = await req.db.collection("choise");
  const isEx = await difference(Hassan_query.schools, query);
  if (query.length === isEx.length) {
    const choise_post = await choise_collection.updateOne(
        { ... req.query },
        { $addToSet:  req.body  },
        { upsert: true }
      );
    return res.status(201).json({ message: "تم" });
  } else {
    return res.status(422).json({ message: "بيانات غير صحيحة" });
  }

  //   ;
  //   //   db.sample.findOne(
  //   //     { "year": "2021" ,"schools": { $all: [{"$elemMatch":{"moassa.bladia":"عين معبد","moassa.EtabMatricule":17051002}}] } }
  //   //  )
  //   if (Hassan_query) {
  //     return res.status(201).json({ message: "بيانات غير صحيحة" });
  //   }
});

export default validate(itemsSchema, handler);
/****التاكد من ان المعومات المرسلة موجودة في الداتا*** */

//   const sample_collection = await req.db.collection("sample");

//   const isExt = await sample_collection.findOne({
//     year: req.query.year,
//     "schools.moassa.EtabMatricule": { $eq: +req.body.moassa.EtabMatricule },
//   });

//   if ( !isExt ) {
//     const sample_post = await sample_collection.updateOne(
//       { year: req.query.year },
//       { $addToSet: { schools: req.body } },
//       { upsert: true }
//     );
//     return res.status(201).json({message:"تمت العملية بنجاح"})

//   }
//   if (isExt) {
//     return res.status(422).json({message:"موجود بالفعل"});

//   }
//   return res.status(422).json({ message: "هناك خطأ ما" });

//var url = new URL(req.headers.referer);
