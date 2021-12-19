import auth ,{AuthIsRequired}from "../../middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(auth).use(AuthIsRequired).get(async (req, res) => {
  

  const data_collection = await req.db.collection("sample");
  const data = await data_collection.findOne(
    req.query ,
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
