import * as Yup from "yup";
import { Messages } from "./Messages";
// import MaterialUIPickers, {
//     parseDateString,
//     dateFormaNow,
//   } from "../FormsUI/datep/datep";
//   console.log(parseDateString);
// export function YupDate(isRequired=true) {
//     return Yup.date()
//     .required(Messages.required)
//     .typeError(Messages.date)
//     .transform(parseDateString)
//     .min("01-01-1970", Messages.rangeDate(1970, new Date().getFullYear()))
//     .max(dateFormaNow(), Messages.rangeDate(1970, 'واليوم'))
//   }
export function YupString(minlength = 1,maxlength = 20) {//الكتابة بالعربية
  return Yup.string()
    .required(Messages.required)
    .matches(/^[\u0600-\u06FF_ ]*$/, Messages.arabic)
    .min(minlength, Messages.minlength(minlength))
    .max(maxlength, Messages.maxlength( maxlength));
}
export function numStr(length = 16) {//رقم سترينغ محدد طول الاحرف
  return Yup.string()
    .matches(/^[0-9]*$/, Messages.digits).trim()
    .length(length, Messages.equalToNum(length))
    .required(Messages.required);
}

export function numStrMinMax(min = 1, max = 16) {//رقم سترينغ محدد ادنى واقصى الاحرف
  return Yup.string()
    .matches(/^[0-9]*$/, Messages.digits)
    .min(min, Messages.rangeLength(min, max))
    .max(max, Messages.rangeLength(min, max))
    .required(Messages.required);
}
export function BasicStr(maxlength=200) {//سلسلة عادية
  return Yup.string().required(Messages.required).max(maxlength, Messages.maxlength( maxlength));
}
export let schema = Yup.object().shape({
  name: Yup.string().required(),
  age: Yup.number().required().positive().integer(),
  email: Yup.string().email(),
  website: Yup.string().required().url(),
  createdOn: Yup.date().default(function () {
    return new Date();
  }),
});

