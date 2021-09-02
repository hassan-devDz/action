import middleware from "../../mongo/connectDb";
import nextConnect from "next-connect";
import * as Yup from "yup"
const handler = nextConnect();
const dataSchema = Yup.object().shape({
    potential_vacancy: Yup.number().integer().required("حقل الزامي"),
    forced: Yup.number().integer().required("حقل الزامي"),
    vacancy: Yup.number().integer().required("حقل الزامي"),
    surplus: Yup.number().integer().required("حقل الزامي"),
    moassa: Yup.object({
      EtabMatricule:Yup.number().required("حقل الزامي"),
      EtabNom:Yup.string().required("حقل الزامي"),
      bladia:Yup.string().required("حقل الزامي"),
    }).required("حقل الزامي"),
    daira: Yup.string().required("حقل الزامي"),
  });
handler.use(middleware);
handler.post(async (req, res) => {
  const data_collection = await req.db.collection("sample");
  // The drop() command destroys all data from a collection.
  // Make sure you run it against the correct database and collection.
  const isExt = await data_collection.findOne({
    year: "2022",
    "schools.moassa.EtabMatricule": { $ne: req.body.moassa.EtabMatricule },
  });
  console.log(isExt);
  if (isExt) {
    const data_post = await data_collection.updateOne(
      { year: "2022" },
      { $addToSet: { schools: req.body } },
      { upsert: true }
    );
   return res.status(201).send("ok");
  }
  return res.status(422).json({error:"هناك خطأ ما"});
  
  //var url = new URL(req.headers.referer);
 

  
});
export default handler;
