import nextConnect from "next-connect";

import middleware from "../../middleware/connectDb";
import { validate } from "../../middleware/validate";
import { moassaSchema } from "../../schemas/schemas_moassa";
import { getSession } from "next-auth/react"

// async function auth(req, res,next)  {
//   const session = await getSession({ req })
//   if (session) {
//     // Signed in
//     console.log("Session", JSON.stringify(session, null, 2))
//   } else {
//     // Not Signed in
//    return res.status(401)
//   }
//   next()
// }
const handler = nextConnect();

handler.use(middleware);
handler.post(async (req, res) => {
  
  // const session = await getSession({req})
  // if (!session) {
  //   return res.status(403).json({ error: "غير مسموح" });

  // }
  console.log(req.body.moassa.bladia);
  /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */
  const Hassan_collection_query = await req.db.collection("Hassan");
  // { "year": "2021" ,"schools": { $all: [{"$elemMatch":{"moassa.bladia":"عين معبد","moassa.EtabMatricule":17051002}}] } }
  const Djelfa = {
    daira: {
      //[]
      $all: [
        {
          $elemMatch: {
            daira_name: req.body.daira,

            "commune_name.bladia": req.body.moassa.bladia,
            "commune_name.moassata": {
              $all: [
                {
                  $elemMatch: {
                    EtabMatricule: `${req.body.moassa.EtabMatricule}`,
                    EtabNom: req.body.moassa.EtabNom,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  };
  const NotDjelfa = {
    daira: {
      $all: [
        {
          $elemMatch: {
            daira_name: req.body.daira,
            commune_name: {
              $all: [
                {
                  $elemMatch: {
                    bladia: req.body.moassa.bladia,
                    moassata: {
                      $all: [
                        {
                          $elemMatch: {
                            EtabMatricule: `${req.body.moassa.EtabMatricule}`,
                            EtabNom: req.body.moassa.EtabNom,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  };
  const data = req.body.daira==="الجلفة"?Djelfa:NotDjelfa;
  const Hassan_query = await Hassan_collection_query.findOne(data);

  if (!Hassan_query) {
    return res.status(400).json({ error: "بيانات غير صحيحة" });
  }

  /****التاكد من ان المعومات المرسلة موجودة في الداتا*** */

  const sample_collection = await req.db.collection("sample");

  const isExt = await sample_collection.findOne({
    ...req.query,
    "schools.moassa.EtabMatricule": { $eq: req.body.moassa.EtabMatricule },
  });

  if (!isExt) {
    const sample_post = await sample_collection.updateOne(
      { ...req.query },
      { $addToSet: { schools: req.body } },
      { upsert: true }
    );
    return res.status(201).json({ message: "تمت العملية بنجاح" });
  }
  if (isExt) {
    return res.status(422).json({ message: "موجود بالفعل" });
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
