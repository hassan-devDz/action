import middleware from "../../middleware/connectDb";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);
handler.get(async (req, res) => {
  console.log(req.query);
  const data_collection = await req.db.collection("sample");
  const data = await data_collection.findOne(
    { "year": req.query.Year },
   {_id:0,"schools":1}
 )
  
  if (data) {
    return res.status(200).json(data.schools );
  }
else{
  return res.redirect('/404')
}
   
  
  
});

export default handler;
