import * as Yup from "yup";
import { YupString, numStr, BasicStr ,YupDate} from "../Components/YupValidation/YupFun";
export const moassaSchema = Yup.object().shape(
  {
    potentialVacancy: Yup.number()
      .required()
      .integer()
      .when(["forced", "vacancy", "surplus"], {
        is: (forced, vacancy, surplus) =>
          forced === 0 && vacancy === 0 && surplus === 0,
        then: Yup.number()
          .integer()
          .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
          .required("حقل الزامي"),
      }),
    forced: Yup.number()
      .required()
      .integer()
      .when(["potentialVacancy", "vacancy", "surplus"], {
        is: (potentialVacancy, vacancy, surplus) =>
          potentialVacancy === 0 && vacancy === 0 && surplus === 0,
        then: Yup.number()
          .integer()
          .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
          .required("حقل الزامي"),
      }),
    vacancy: Yup.number()
      .required()
      .integer()
      .when(["potentialVacancy", "forced", "surplus"], {
        is: (potentialVacancy, forced, surplus) =>
          potentialVacancy === 0 && forced === 0 && surplus === 0,
        then: Yup.number()
          .integer()
          .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
          .required("حقل الزامي"),
      }),
    surplus: Yup.number()
      .required()
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
    })
      .required("حقل الزامي")
      .nullable(),
    daira: Yup.string().required("حقل الزامي").nullable(),
  },
  [
    ["potentialVacancy", "forced"],
    ["potentialVacancy", "vacancy"],
    ["vacancy", "forced"],
    ["vacancy", "surplus"],
    ["forced", "surplus"],
    ["potentialVacancy", "surplus"],
  ]
);

export const arrayMoassaSchema = Yup.object().shape({
  arrayEtabMatricule: Yup.array()
    .min(1)
    .of(Yup.string().length(8, "مطلوب ثمانية أرقام").required("حقل الزامي"))
    .required("حقل الزامي"),
});

export const itemsSchema = Yup.object().shape({
  items: Yup.array()
    .of(
      Yup.object().shape(
        {
          potentialVacancy: Yup.number()
             .required("حقل الزامي")
            .integer()
            .when(["forced", "vacancy"], {
              is: (forced, vacancy) => forced === 0 && vacancy === 0,
              then: Yup.number()
                .integer()
                .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
                .required("حقل الزامي"),
            }),
          forced: Yup.number()
             .required("حقل الزامي")
            .integer()
            .when(["potentialVacancy", "vacancy"], {
              is: (potentialVacancy, vacancy) =>
                potentialVacancy === 0 && vacancy === 0,
              then: Yup.number()
                .integer()
                .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
                .required("حقل الزامي"),
            }),
          vacancy: Yup.number()
             .required("حقل الزامي")
            .integer()
            .when(["potentialVacancy", "forced"], {
              is: (potentialVacancy, forced) =>
                potentialVacancy === 0 && forced === 0,
              then: Yup.number()
                .integer()
                .positive("يجب أن يكون أحد الحقول أكبر من الصفر")
                .required("حقل الزامي"),
            }),
          surplus: Yup.number() .required("حقل الزامي").integer(),
          moassa: Yup.object({
            EtabMatricule: Yup.string().required("حقل الزامي"),
            EtabNom: Yup.string().required("حقل الزامي"),
            bladia: Yup.string().required("حقل الزامي"),
          })
            .required("حقل الزامي")
            .nullable(),
          daira: Yup.string().required("حقل الزامي").nullable(),
        },
        [
          ["potentialVacancy", "forced"],
          ["potentialVacancy", "vacancy"],
          ["vacancy", "forced"],
        ]
      )
    )
     .required("حقل الزامي")
    .min(1)
    .max(5),
});

//FormInfoInterested

export const FormInfoInterestedSchema = Yup.object().shape({
  firstName: YupString(3).trim(), //الاسم
  lastName: YupString(3).trim(), //اللقب
  baldia: BasicStr().nullable(),
  workSchool: Yup.object({
    EtabMatricule: numStr(8),
    EtabNom: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
  situation: BasicStr().nullable(),
  employeeId: numStr(16),
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("هذا الحقل مطلوب"),

  password: Yup.string()
    .min(8, "يجب عليك ادخال 8 أحرف على الأقل")
    .required("هذا الحقل مطلوب"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "كلمة السر غير مطابقة")
    .required("يرجى تأكيد كلمة السر"),
  accept: Yup.boolean()
    .oneOf([true], "بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة .")
    .required("بإنشائك لهذا الحساب أنت توافق على شروط استخدام المنصة ."),
    captcha:Yup.string()
    .required("هذا الحقل مطلوب"),

    createdAt: Yup.date().required()
});
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .required("هذا الحقل مطلوب"),

    password: Yup.string()
    .min(8, "يجب عليك ادخال 8 أحرف على الأقل")
    .required("هذا الحقل مطلوب"),
    captcha:Yup.string()
    .required("هذا الحقل مطلوب"),
});