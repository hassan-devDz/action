import middleware from "../../middleware/connectDb";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);
handler.get(async (req, res) => {
  
  const data_collection = await req.db.collection("sample");
  const data = await data_collection.findOne(
    { "year": "2021" },
   {_id:0,"schools":1}
 )
  console.log(data);
  if (data) {
    return res.status(200).json(data.schools );
  }
return res.status(200).json([])
   
  
  
});

export default handler;
