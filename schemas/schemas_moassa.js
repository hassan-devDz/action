import * as Yup from "yup";


export const moassaSchema = Yup.object().shape({
  potentialVacancy: Yup.number()
  .integer()
  .when(["forced", "vacancy", "surplus"], {
    is: (forced, vacancy, surplus) =>
      forced === 0 && vacancy === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
    otherwise: Yup.number(),
  }),
forced: Yup.number()
  .integer()
  .when(["potentialVacancy", "vacancy", "surplus"], {
    is: (potentialVacancy, vacancy, surplus) =>
      potentialVacancy === 0 && vacancy === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
    otherwise: Yup.number(),
  }),
vacancy: Yup.number()
  .integer()
  .when(["potentialVacancy", "forced", "surplus"], {
    is: (potentialVacancy, forced, surplus) =>
      potentialVacancy === 0 && forced === 0 && surplus === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
    otherwise: Yup.number(),
  }),
surplus: Yup.number()
  .integer()
  .when(["potentialVacancy", "forced", "vacancy"], {
    is: (potentialVacancy, forced, vacancy) =>
      potentialVacancy === 0 && forced === 0 && vacancy === 0,
    then: Yup.number()
      .integer()
      .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
      .required("حقل الزامي"),
    otherwise: Yup.number(),
  }),
    moassa: Yup.object({
      EtabMatricule: Yup.number().integer().positive().required("حقل الزامي"),
      EtabNom: Yup.string().required("حقل الزامي"),
      bladia: Yup.string().required("حقل الزامي"),
    }).required("حقل الزامي"),
    daira: Yup.string().required("حقل الزامي"),
  },
  [
    ["potentialVacancy", "forced"],
    ["potentialVacancy", "vacancy"],
    ["vacancy", "forced"],
    ["vacancy", "surplus"],
    ["forced", "surplus"],
    ["potentialVacancy", "surplus"],
  ]);

