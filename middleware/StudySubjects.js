export const subjects = {
  secondary: [
    "الرياضيات",
    "اللغة العربية",
    "اللغة الفرنسية",
    "اللغة الإنجليزية",
    "التاريخ و الجغرافيا",
    "العلوم الفيزيائية",
    "العلوم الطبيعية",
    "التربية الإسلامية",
    "التربية الاقتصادية",
    "كيمياء",
    "الهندسة المدنية",
    "ميكانيك",
    "الكترونيك",
    "اللغة الألمانية",
    "اللغة الأمازيغية",
    "اللغة الإسبانية",
    "الفلسفة",
    "اللغة الإيطالية",
    "التربية الفنية",
    "إعلام ألي",
    "التربية البدنية",
  ],
  secondaryObj: {
    Maths: "الرياضيات",
    Arabic: "اللغة العربية",
    French: "اللغة الفرنسية",
    English: "اللغة الإنجليزية",
    HistoryAndGeography: "التاريخ و الجغرافيا",
    Physics: "العلوم الفيزيائية",
    NaturalSciences: "العلوم الطبيعية",
    Islamic: "التربية الإسلامية",
    Economic: "التربية الاقتصادية",
    Chemistry: "كيمياء",
    CivilEngineering: "الهندسة المدنية",
    Mechanical: "ميكانيك",
    Electronic: "الكترونيك",
    German: "اللغة الألمانية",
    Amazight: "اللغة الأمازيغية",
    Spanish: "اللغة الإسبانية",
    Philosophy: "الفلسفة",
    Italian: "اللغة الإيطالية",
    Art: "التربية الفنية",
    ComputerScience: "إعلام ألي",
    Sports: "التربية البدنية",
    Music: "التربية الموسيقية",
  },
  middle: [
    "الرياضيات",
    "اللغة العربية",
    "اللغة الفرنسية",
    "اللغة الإنجليزية",
    "التاريخ و الجغرافيا",
    "العلوم الفيزيائية",
    "العلوم الطبيعية",
    "التربية الإسلامية",
    "اللغة الأمازيغية",
    "إعلام ألي",
    "التربية البدنية",
    "التربية الفنية",
    "التربية الموسيقية",
  ],
  middleObj: {
    Maths: "الرياضيات",
    Arabic: "اللغة العربية",
    French: "اللغة الفرنسية",
    English: "اللغة الإنجليزية",
    HistoryAndGeography: "التاريخ و الجغرافيا",
    Physics: "العلوم الفيزيائية",
    NaturalSciences: "العلوم الطبيعية",
    Islamic: "التربية الإسلامية",
    Amazight: "اللغة الأمازيغية",
    ComputerScience: "إعلام ألي",
    Sports: "التربية البدنية",
    Art: "التربية الفنية",
    Music: "التربية الموسيقية",
  },
  primaryObj: {
    Arabic: "اللغة العربية",
    French: "اللغة الفرنسية",
    Amazight: "اللغة الأمازيغية",
  },
  primary: ["اللغة العربية", "اللغة الفرنسية", "اللغة الأمازيغية"],
};
export const postionChoise = ["راغب", "مجبر", "فائض"];
export const _educationalPhase = ["ابتدائي", "متوسط", "ثانوي"];
export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
export const postionChoiseExtended = [
  "راغب",
  "مجبر",
  "فائض",
  "محال على الاستيداع",
  "منتدب",
  "تحت التصرف",
  "عطلة طويلة الأمد",
];
export const _accountType = [
  { value: "أستاذ", key: 1 },
  { value: "مدير", key: 2 },
  { value: "رئيس مكتب", key: 4 },
  { value: "عضو لجنة", key: 3 },
  { value: "رئيس مصلحة", key: 5 },
];
export const projec = {
  primary: "ابتدائي",
  middle: "متوسط",
  secondary: "ثانوي",
};
export function loop(data) {
  const arr = [];

  data?.map((x) => {
    const { key, value, citys } = x; //الولاية ورمزها

    citys.map((ct) => {
      const { cle, valeur, ...ref } = ct; //البلدية ورمزها

      const bla = Object.keys(ref);
      bla.map((x) => {
        //الطور
        const kr = Object.keys(ref[x]);
        kr.map((cl, ndex) => {
          //مادة التدريس

          ref[x][cl].map((dane, i) => {
            //مؤسسة العمل و وضعيا ت الحركة
            const ob = {
              wilaya: { key, value },
              baldia: { cle, valeur },
              educationalPhase: projec[x],
              specialty: null,
              workSchool: null,
              potentialVacancy: 0,
              forced: 0,
              vacancy: 0,
              surplus: 0,
              id: dane.id,
            };
            if (x === "primary") {
              ob.specialty = subjects.primaryObj[cl];
            } else if (x === "secondary") {
              ob.specialty = subjects.secondaryObj[cl];
            } else if (x === "middle") {
              ob.specialty = subjects.middleObj[cl];
            }

            ob.workSchool = {
              EtabMatricule: dane.EtabMatricule,
              EtabNom: dane.EtabNom,
            };

            ob.potentialVacancy = dane.potentialVacancy;
            ob.forced = dane.forced;
            ob.vacancy = dane.vacancy;
            ob.surplus = dane.surplus;

            arr.push(ob);
          });

          //console.log(x, cl);
        });
      });
    });
  });
  return arr;
}
export function loopf(data) {
  const arr = [];

  data?.data.map((x) => {
    console.log(x);
    arr.push(x);
  });
  console.log(arr);
  return arr;
}
export function loopforUser(data) {
  const arr = [];
  if (data?.citys) {
    data?.citys.map((ct) => {
      const { cle, valeur, ...ref } = ct; //البلدية ورمزها

      const bla = Object.keys(ref);
      bla.map((x) => {
        //الطور
        const kr = Object.keys(ref[x]);
        kr.map((cl, ndex) => {
          //مادة التدريس

          ref[x][cl].map((dane, i) => {
            //مؤسسة العمل و وضعيا ت الحركة
            const ob = {
              baldia: { cle, valeur },
              educationalPhase: projec[x],
              specialty: null,
              workSchool: null,
              potentialVacancy: 0,
              forced: 0,
              vacancy: 0,
              surplus: 0,
              id: dane.id,
            };
            if (x === "primary") {
              ob.specialty = subjects.primaryObj[cl];
            } else if (x === "secondary") {
              ob.specialty = subjects.secondaryObj[cl];
            } else if (x === "middle") {
              ob.specialty = subjects.middleObj[cl];
            }

            ob.workSchool = {
              EtabMatricule: dane.EtabMatricule,
              EtabNom: dane.EtabNom,
            };

            ob.potentialVacancy = dane.potentialVacancy;
            ob.forced = dane.forced;
            ob.vacancy = dane.vacancy;
            ob.surplus = dane.surplus;

            arr.push(ob);
          });

          //console.log(x, cl);
        });
      });
    });
  }

  return arr;
}
const interOrExten = ["خارج الولاية", "داخل الولاية"];

const maritalStatus = ["أعزب", "أرمل(ة)", "مطلق(ة)", "متزوج(ة)"];
