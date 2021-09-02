import * as Yup from "yup";


export const moassaSchema = Yup.object().shape({
    potentialVacancy: Yup.number().integer().required("حقل الزامي"),
    forced: Yup.number().integer().required("حقل الزامي"),
    vacancy: Yup.number().integer().required("حقل الزامي"),
    surplus: Yup.number().integer().required("حقل الزامي"),
    moassa: Yup.object({
      EtabMatricule: Yup.number().required("حقل الزامي"),
      EtabNom: Yup.string().required("حقل الزامي"),
      bladia: Yup.string().required("حقل الزامي"),
    }).required("حقل الزامي"),
    daira: Yup.string().required("حقل الزامي"),
  });

