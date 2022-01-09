import nextConnect from "next-connect";
import auth from "../../middleware/auth";
const handler = nextConnect();
handler.use(auth).get(async (req, res) => {
  const findWilaya = await req.db
    .collection("education_Directorates")
    .find()
    .project({ value: 1, _id: 0, key: 1 })
    .toArray();

  return res.json(findWilaya);
});
export default handler;
// const wilaya = [
//   { value: "01021", nameW: "مديرية التربية لولاية أدرار" },
//   { value: "02041", nameW: "مديرية التربية لولاية الشلف" },
//   { value: "03021", nameW: "مديرية التربية لولاية الأغواط" },
//   { value: "04041", nameW: "مديرية التربية لولاية أم البواقي" },
//   { value: "05051", nameW: "مديرية التربية لولاية باتنة" },
//   { value: "06051", nameW: "مديرية التربية لولاية بجاية" },
//   { value: "07031", nameW: "مديرية التربية لولاية بسكرة" },
//   { value: "08021", nameW: "مديرية التربية لولاية بشار" },
//   { value: "09051", nameW: "مديرية التربية لولاية البليدة" },
//   { value: "10041", nameW: "مديرية التربية لولاية البويرة" },
//   { value: "11011", nameW: "مديرية التربية لولاية تمنراست" },
//   { value: "12031", nameW: "مديرية التربية لولاية تبسة" },
//   { value: "13041", nameW: "مديرية التربية لولاية تلمسان" },
//   { value: "14041", nameW: "مديرية التربية لولاية تيارت" },
//   { value: "15051", nameW: "مديرية التربية لولاية تيزي وزو" },
//   { value: "16051", nameW: "مديرية التربية للجزائر غرب" },
//   { value: "16052", nameW: "مديرية التربية للجزائر وسط" },
//   { value: "16053", nameW: "مديرية التربية للجزائر شرق" },
//   { value: "17031", nameW: "مديرية التربية لولاية الجلفة" },
//   { value: "18041", nameW: "مديرية التربية لولاية جيجل" },
//   { value: "19051", nameW: "مديرية التربية لولاية سطيف" },
//   { value: "20031", nameW: "مديرية التربية لولاية سعيدة" },
//   { value: "21041", nameW: "مديرية التربية لولاية سكيكدة" },
//   { value: "22041", nameW: "مديرية التربية لولاية سيدي بلعباس" },
//   { value: "23041", nameW: "مديرية التربية لولاية عنابة" },
//   { value: "24031", nameW: "مديرية التربية لولاية قالمة" },
//   { value: "25051", nameW: "مديرية التربية لولاية قسنطينة" },
//   { value: "26041", nameW: "مديرية التربية لولاية المدية" },
//   { value: "27041", nameW: "مديرية التربية لولاية مستغانم" },
//   { value: "28041", nameW: "مديرية التربية لولاية المسيلة" },
//   { value: "29041", nameW: "مديرية التربية لولاية معسكر" },
//   { value: "30031", nameW: "مديرية التربية لولاية ورقلة" },
//   { value: "31051", nameW: "مديرية التربية لولاية وهران" },
//   { value: "32021", nameW: "مديرية التربية لولاية البيض" },
//   { value: "33011", nameW: "مديرية التربية لولاية إليزي" },
//   { value: "34041", nameW: "مديرية التربية لولاية برج بوعريريج" },
//   { value: "35041", nameW: "مديرية التربية لولاية بومرداس" },
//   { value: "36031", nameW: "مديرية التربية لولاية الطارف" },
//   { value: "37011", nameW: "مديرية التربية لولاية تندوف" },
//   { value: "38021", nameW: "مديرية التربية لولاية تيسمسيلت" },
//   { value: "39031", nameW: "مديرية التربية لولاية الوادي" },
//   { value: "40031", nameW: "مديرية التربية لولاية خنشلة" },
//   { value: "41031", nameW: "مديرية التربية لولاية سوق أهراس" },
//   { value: "42041", nameW: "مديرية التربية لولاية تيبازة" },
//   { value: "43041", nameW: "مديرية التربية لولاية ميلة" },
//   { value: "44041", nameW: "مديرية التربية لولاية عين الدفلى" },
//   { value: "45011", nameW: "مديرية التربية لولاية النعامة" },
//   { value: "46031", nameW: "مديرية التربية لولاية عين تيموشنت" },
//   { value: "47021", nameW: "مديرية التربية لولاية غرداية" },
//   { value: "48041", nameW: "مديرية التربية لولاية غليزان" },
// ];

// let arraydata = [];
//   let promises = [];
//   for (let i = 0; i < wilaya.length; i++) {
//     console.log(i);
//     const res = await fetch("https://ostad.education.gov.dz/getComByIap", {
//       method: "POST",
//       body: `iap=${wilaya[i].value}`,
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     const data = await res.json();
//     for (let index = 0; index < data.length; index++) {
//       for (let x = 1; x < 4; x++) {
//         const respose = await fetch(
//           "https://ostad.education.gov.dz/getEstabsByCom",
//           {
//             method: "POST",
//             body: `commune=${data[index].cle}&cycle=${x}`,
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           }
//         );
//         const lastdata = await respose.json();
//         data[index][x == 1 ? "primary" : x == 2 ? "middle" : "secondary"] =
//           lastdata;
//       }
//     }

//     arraydata.push({
//       citys: data,
//       value: wilaya[i].nameW,
//       key: wilaya[i].value,
//     });
//   }
//   const insert = req.db.collection("education_Directorates").insertMany(arraydata);
//   return res.json({ data: arraydata, ty: promises });
