import nextConnect from "next-connect";

import middleware from "../../middleware/connectDb";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";

const handler = nextConnect();

handler.use(middleware);
handler.post(async (req, res) => {
  /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */
  const Hassan_collection_query = await req.db.collection("Hassan");
  const Hassan_query = await Hassan_collection_query.findOne({
    "daira.daira_name": req.body.daira,
    "daira.commune_name.bladia": req.body.moassa.bladia,
    "daira.commune_name.moassata.EtabMatricule": `${req.body.moassa.EtabMatricule}`,
    "daira.commune_name.moassata.EtabNom": req.body.moassa.EtabNom,
  });
   if (!Hassan_query) {
    return res.status(400).json({ error: "بيانات غير صحيحة" });
  }
  
 /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */

  const sample_collection = await req.db.collection("sample");

  
  const isExt = await sample_collection.findOne({
    year: req.query.Year,
    "schools.moassa.EtabMatricule": { $eq: +req.body.moassa.EtabMatricule },
  });

  if ( !isExt ) {
    const sample_post = await sample_collection.updateOne(
      { year: req.query.Year },
      { $addToSet: { schools: req.body } },
      { upsert: true }
    );
    return res.status(201).json({message:"تمت العملية بنجاح"})

  }
  if (isExt) {
    return res.status(422).json({message:"موجود بالفعل"});

  }
  return res.status(422).json({ message: "هناك خطأ ما" });

  //var url = new URL(req.headers.referer);
});

export default validate(moassaSchema, handler);

// .aggregate([
//   { $unwind: "$daira" },
//   { $match: { "daira.commune_name.bladia": req.body.moassa.bladia } },
// {$project: {
//   shapes: {$filter: {
//       input: '$daira.commune_name',
//       as: 'daira',
//       cond: {$eq: ['$$daira.bladia', req.body.moassa.bladia]}
//   }},_id:0}
// },

//   // {
//   //   $project: {
//   //     _id: 0,

//   //     bl: "$daira.commune_name",
//   //     // moassat: {
//   //     //   $reduce: {
//   //     //     input: "$daira.commune_name.moassata",
//   //     //     initialValue: [],
//   //     //     in: { $concatArrays: ["$$value", "$$this"] },
//   //     //   },
//   //     // },
//   //   },
//   // },
//   { $unwind: "$shapes" },
//    {
//     $project: {
//       _id: 0,

//       bl: "$shapes.moassata",
//       // moassat: {
//       //   $reduce: {
//       //     input: "$daira.commune_name.moassata",
//       //     initialValue: [],
//       //     in: { $concatArrays: ["$$value", "$$this"] },
//       //   },
//       // },
//     },
//   },
//   { $unwind: "$bl" },
//   //{ $match: { "bl.EtabMatricule": req.body.moassa.EtabMatricule} },
//   // { $addFields: { "bl.moassata.bladia": "$bl.bladia" } },
//   // {
//   //   $group: {
//   //     _id: "$bl.moassata",
//   //   },
//   // }, //
//   //
//   {
//     $project: {

//       bl2:"$bl.EtabMatricule"
//       // moassat: {
//       //   $reduce: {
//       //     input: "$_id",
//       //     initialValue: [],
//       //     in: { $concatArrays: ["$$value", "$_id"] },
//       //   },
//       // },
//     },
//   },
//   { $unwind: "$bl2" }
//   ,{ $match: { "bl2": `${req.body.moassa.EtabMatricule}` } }
// ])
// .toArray();
