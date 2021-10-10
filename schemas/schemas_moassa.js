import * as Yup from "yup";


export const moassaSchema = Yup.object().shape({
  potentialVacancy: Yup.number().required()
  .integer()
  .when(["forced", "vacancy", "surplus"], {
    is: (forced, vacancy, surplus) =>
      forced === 0 && vacancy === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
  }),
forced: Yup.number().required()
  .integer()
  .when(["potentialVacancy", "vacancy", "surplus"], {
    is: (potentialVacancy, vacancy, surplus) =>
      potentialVacancy === 0 && vacancy === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
  }),
vacancy: Yup.number().required()
  .integer()
  .when(["potentialVacancy", "forced", "surplus"], {
    is: (potentialVacancy, forced, surplus) =>
      potentialVacancy === 0 && forced === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
  }),
surplus: Yup.number().required()
  .integer()
  .when(["potentialVacancy", "forced", "vacancy"], {
    is: (potentialVacancy, forced, vacancy) =>
      potentialVacancy === 0 && forced === 0 && vacancy === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
  }),
    moassa: Yup.object({
      EtabMatricule: Yup.string().required("حقل الزامي"),
      EtabNom: Yup.string().required("حقل الزامي"),
      bladia: Yup.string().required("حقل الزامي"),
    }).required("حقل الزامي").nullable(),
    daira: Yup.string().required("حقل الزامي").nullable(),
  },
  [
    ["potentialVacancy", "forced"],
    ["potentialVacancy", "vacancy"],
    ["vacancy", "forced"],
    ["vacancy", "surplus"],
    ["forced", "surplus"],
    ["potentialVacancy", "surplus"],
  ]);


export const arrayMoassaSchema = Yup.object().shape({
 
    arrayEtabMatricule: Yup.array().min(1).of(Yup.string().length(8,"مطلوب ثمانية أرقام").required("حقل الزامي")).required("حقل الزامي"),
  });

export const itemsSchema = Yup.object().shape({
 
  items: Yup.array().of(Yup.object().shape({
    potentialVacancy: Yup.number().required()
    .integer()
    .when(["forced", "vacancy"], {
      is: (forced, vacancy) =>
        forced === 0 && vacancy === 0 ,
      then: Yup.number()
        .integer()
        .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
        .required("حقل الزامي"),
    }),
  forced: Yup.number().required()
    .integer()
    .when(["potentialVacancy", "vacancy"], {
      is: (potentialVacancy, vacancy) =>
        potentialVacancy === 0 && vacancy === 0,
      then: Yup.number()
        .integer()
        .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
        .required("حقل الزامي"),
    }),
  vacancy: Yup.number().required()
    .integer()
    .when(["potentialVacancy", "forced"], {
      is: (potentialVacancy, forced) =>
        potentialVacancy === 0 && forced === 0,
      then: Yup.number()
        .integer()
        .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
        .required("حقل الزامي"),
    }),
  surplus: Yup.number().required()
    .integer()
    ,
      moassa: Yup.object({
        EtabMatricule: Yup.string().required("حقل الزامي"),
        EtabNom: Yup.string().required("حقل الزامي"),
        bladia: Yup.string().required("حقل الزامي"),
      }).required("حقل الزامي").nullable(),
      daira: Yup.string().required("حقل الزامي").nullable(),
    },
    [
      ["potentialVacancy", "forced"],
      ["potentialVacancy", "vacancy"],
      ["vacancy", "forced"],
    ])).required().min(1).max(5),
  });

  //FormInfoInterested
  const INITIAL_FORM_STATE = {
  
    firstName: "", //الاسم
    lastName: "", //اللقب
    baldia: "", //البلدية
    workSchool: { EtabMatricule: null, EtabNom: null, bladia: null }, //مؤسسة العمل
    points: 0, //النقاط
    situation: "", //الوضعية
  };
  export const FormInfoInterestedSchema = Yup.object().shape({
 
    formInfoInterested: Yup.object().shape({
      
        daira: Yup.string().required("حقل الزامي").nullable(),
      }).required(),
    });