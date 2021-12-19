import auth from "../../middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
 
  const data_collection = await req.db.collection("Hassan");
      const data = await data_collection.aggregate( [
      {$project: {
        shaps:  "$daira.commune_name.bladia",_id:0}
       },
      
    ])
      .toArray()
       
      const dat = data[0]["shaps"].flatMap(x => x)
      res.status(200).json(dat);
    
 
  
});

export default handler;
// [
//   { $unwind: "$daira" },
//   { $match: { "daira.daira_name": query["daira_name"] } },
//   { $project: { wilaya_name: 0, id: 0, _id: 0 } },
// ];

// ,{ $addFields: { firstrun: { $first: "$moassata" }, lastrun: { $last: "$daira.commune_name.moassata" } } }

// const felter = await doc.daira"connections who play golf": "$daira.commune_name.moassata.EtabNom"
//   .filter((x) => x.daira_name === query["daira_name"])
//   .map((x, i) => x.commune_name);

// handler.put(async (req, res) => {

//   let date = req.body.date
//   let id = '6117559800043a420a520797';
// const value="value"
// let o_id = new ObjectID(id);
//   let data = req.body.value;
//   const query = {"class":'5'}
// const test = `value.${date}`
//   console.log(req.body,"reqreqreqreq",date,data,query,test);

//   const updateDocument = {$set:  {[test]:data[date]}};
//   console.log(updateDocument);
//   //let doc1 = await req.db.collection('data').findOne()
//   let doc = await req.db.collection('data').updateOne(query, updateDocument,{upsert:true})

//   res.json({message: 'ok'});
// });
// shapes: {
//   $filter: {
//     input: "$shapes",
//     as: "shape",
//     cond: { $eq: ["$$shape.color", "red"] },
//   },
// },
//,{ $addFields: { firstrun: { $first: "$input" }, lastrun: { $last: "$daira.commune_name.bladia" } } }

/*************استعلام عن البلدية ومؤسساتها ***********************/
/**{ $match: { "daira.commune_name.bladia": query["daira_name"] } },
        {$project: {
          shapes: {$filter: {
              input: '$daira.commune_name',
              as: 'daira',
              cond: {$eq: ['$$daira.bladia', query["daira_name"]]}
          }},_id:0}
        } */

/**استعلام عن بلديات الدائرة */

// { $match: { "daira.commune_name.bladia": query["daira_name"] } },

// {
//   $project: {
//     _id: 0,

//     b:"$daira.commune_name.bladia",

//   },
// }

/***************************** */

/**function******************* */
/** message:
            { $function:
               {
                  body: function(frst) {
                    frst.map((x,i)=>{
        
                      return x.moassata.map((key,index)=>{
                        return (key.bl=x.bladia)
                       })
                     })
                  },
                  args: [ "$daira.commune_name"],
                  lang: "js"
               }
            } */
 //,{$project: {
        
    //     daira:{$reduce: {
    //         input:"$daira.commune_name.bladia",
    //         initialValue: [ ],
    //         in: { $concatArrays : ["$$value", "$$this"] }
    //      }}
    //     }
    //   }

    //,{$project: {
        
    //     daira:{$reduce: {
    //         input:"$shaps.commune_name.bladia",
    //         initialValue: [ ],
    //         in: { $concatArrays : ["$$value", "$$this"] }
    //      }}
    //     }
    //   }

     // .aggregate([ { $match: { "daira.commune_name.bladia": query["daira_name"] } },

        // {
        //   $project: {
        //     _id: 0,
        
        //     b:"$daira.commune_name.bladia",
        
        //   },
        // }]).toArray()
        
      
      

      // const loop = ()=>data[0].daira.commune_name.map((x,i)=>{

      //  return x.moassata.map((key,index)=>{
      //    return (key.bl=x.bladia)
      //   })
      // })
      // const t = loop()
      // console.log(t);
   //  else {
    //   //if (key_query === "daira_name" && query["daira_name"] === "الجلفة")
    //   const data = await data_collection
    //     .aggregate([
    //       { $unwind: "$daira" },
    //       { $match: { "daira.daira_name": query["daira_name"] } },
    //       {
    //         $addFields: {
    //           "daira.commune_name.moassata.bladia": query["daira_name"],
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           daira_name: query["daira_name"],
    //           moassata: "$daira.commune_name.moassata",
    //         },
    //       },
    //     ])
    //     .toArray();

    //   res.json(...data);
    // }