import { Grid, InputAdornment, IconButton, Container } from "@material-ui/core";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  YupString,
  numStr,
  BasicStr,
} from "../Components/YupValidation/YupFun";
import Controls from "../Components/FormsUi/Control";
import { useState, useEffect, useRef, useCallback } from "react";

import axios from "axios";
const INITIAL_FORM_STATE = {
  wilaya: null,
  baldia: null, //البلدية
  educationalPhase: null, //الطور
  specialty: null,
  workSchool: null, //مؤسسة العمل
};

const FORM_VALIDATION = Yup.object().shape({
  wilaya: Yup.object({
    key: numStr(5),
    value: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
  baldia: Yup.object({
    cle: numStr(4),
    valeur: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
  educationalPhase: BasicStr().nullable(),
  specialty: BasicStr().nullable(),
  workSchool: Yup.object({
    EtabMatricule: numStr(8),
    EtabNom: BasicStr(),
  })
    .required("حقل الزامي")
    .nullable(),
});

const fetcher = async (url, param = "") => {
  const res = await axios.get(url, {
    params: {
      ...param,
    },
  });
  const data = await res.data;

  return data;
};
async function putData(method, url, values) {
  const response = await axios({
    method: method,
    url: url,
    data: values,
  });

  return response;
}
const secondary = [
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
];
const middle = [
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
];
const _educationalPhase = ["ابتدائي", "متوسط", "ثانوي"];
const _specialty = ["لغة عربية", "لغة فرنسية", "اللغة الأمازيغية"];
const FormInfoInterested = (props) => {
  //console.log(FormInfoInterestedSchema);
  const [wilayaList, setWilayaList] = useState([]); // قائمة كل المديريات
  const [baldiaList, setBaldiaList] = useState([]); //قائمة البلديات التابعة للمديرية المختارة
  const [specialtyList, setSpecialtyList] = useState([]); //قائمة مواد التدريس
  const [moassaList, setMoassaList] = useState([]); //قائمة المؤسسات التابعة للبلدية
  const [educationalPhaseList, setEducationalPhaseList] = useState([]); //قائمة الاطوار
  const [inputValueWilaya, setInputValueWilaya] = useState(""); //اختيار المديرية
  const [inputValueBaldia, setInputValueBaldia] = useState(""); //ادخال اسم البلدية
  const [educationalValuePhase, setEducationalValuePhase] = useState(""); //الطور
  const [inputValueSpecialty, setInputValueSpecialty] = useState(""); //مادة التدريس
  const [inputValueMoassa, setInputValueMoassa] = useState(""); //اختيار المؤسسة
  useEffect(() => {
    fetcher(`/api/getlistwilaya`) //طلب  المديرية  المعنية
      .then(function (response) {
        setWilayaList(response);
      })
      .catch((err) => {
        console.log(err);
      });
    // fetcher(`/api/getbaldia`) //طلب  البلدية المعنية
    //   .then(function (response) {
    //     setBaldiaList(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  const getValueWilaya = (event, newInputValue) => {
    /**
     *!احتيار المديرية
     */
    setInputValueWilaya(newInputValue);
    setInputValueBaldia("");
    setInputValueMoassa("");
    setInputValueSpecialty("");
    setEducationalValuePhase("");
    setBaldiaList([]);
    setEducationalPhaseList([]);
    setSpecialtyList([]);
    setMoassaList([]);

    const isChoiseOfWilayaInList = wilayaList.filter(
      (ele) => ele.value == newInputValue
    );

    if (!!isChoiseOfWilayaInList.length) {
      //طلب قائمة البلديات بعد اختيار المديرية المعنية
      fetcher(`/api/getlistbaldia`, {
        key: isChoiseOfWilayaInList[0].key,
      }).then((response) => {
        setBaldiaList(response.citys);
      });
    }
  };

  const getValueBaldia = (event, newInputValue) => {
    //اختيار البلدية
    setInputValueBaldia(newInputValue);
    setInputValueMoassa("");
    setInputValueSpecialty("");
    setEducationalValuePhase("");
    setEducationalPhaseList([]);
    setSpecialtyList([]);
    setMoassaList([]);
    const isChoiseOfBaldiaInList = baldiaList.filter(
      (elm) => elm.valeur == newInputValue
    );
    //         .cle

    console.log(isChoiseOfBaldiaInList);
    if (!!isChoiseOfBaldiaInList.length) {
      //طلب قائمة الاطوار بعد اختيار البلدية
      setEducationalPhaseList(_educationalPhase);
    }
  };
  const getValueEducationalPhase = (event, newInputValue) => {
    //اختيار الطور
    /**
     * ! التأكد من افراغ المدخلات
     *
     */
    console.log();
    setInputValueMoassa("");
    setInputValueSpecialty("");

    setSpecialtyList([]);
    setMoassaList([]);
    //!انتهى التفريغ

    setEducationalValuePhase(newInputValue);
    console.log(inputValueBaldia);
    if (_educationalPhase.includes(newInputValue)) {
      const body = {
        cle: baldiaList.filter((elm) => elm.valeur == inputValueBaldia)[0].cle,
        value: newInputValue,
      };
      fetcher(`/api/getlistmoassat`, body).then((res) => {
        setMoassaList(res);
      });
    }
    if (newInputValue === "ابتدائي") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(_specialty);
    }
    if (newInputValue === "متوسط") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(middle);
    }
    if (newInputValue === "ثانوي") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(secondary);
    }
  };
  const getValueMoassa = (event, newInputValue) => {
    //اختيار مؤسسة العمل
    setInputValueMoassa(newInputValue);
  };

  const getValueSpecialty = (event, newInputValue) => {
    //مادة التدريس
    setInputValueSpecialty(newInputValue);
  };

  const handelSubmit = (valusForm, fun) => {
    console.log(valusForm);
  };

  // useEffect(() => {
  //   if (educationalPhase && inputValueBaldia && inputValueWilaya) {
  //     const body = {
  //       wilaya: wilayaList.filter((elm) => elm.value == inputValueWilaya)[0]
  //         .key,
  //       baldia: baldiaList.filter((elm) => elm.valeur == inputValueBaldia)[0]
  //         .cle,
  //       phase: educationalPhase,
  //     };
  //     putData("post", "/api/getmoassat", body).then((res) => {
  //       console.log(res);
  //     });
  //   } else {
  //     setInputValueMoassa(null);
  //   }
  // }, [educationalPhase, inputValueBaldia, inputValueWilaya]);
  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={handelSubmit}
    >
      <Form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="wilaya"
              label="مديرية التربية"
              variant="outlined"
              inputValue={inputValueWilaya}
              onInputChange={getValueWilaya}
              options={wilayaList}
              getOptionLabel={(option) => {
                return option.value || "";
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="baldia"
              label="البلدية"
              variant="outlined"
              inputValue={inputValueBaldia}
              onInputChange={getValueBaldia}
              options={baldiaList || []}
              getOptionLabel={(option) => {
                return option.valeur || "";
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} elevation={6}>
            <Controls.AutocompleteMui
              name="educationalPhase"
              label="الطور"
              variant="outlined"
              inputValue={educationalValuePhase}
              onInputChange={getValueEducationalPhase}
              options={educationalPhaseList}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="specialty"
              label="مادة التدريس"
              loading
              loadingText={"في الانتظار"}
              inputValue={inputValueSpecialty}
              onInputChange={getValueSpecialty}
              options={specialtyList || []}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.AutocompleteMui
              name="workSchool"
              label="مؤسسة العمل"
              loading
              loadingText={"في الانتظار"}
              inputValue={inputValueMoassa}
              onInputChange={getValueMoassa}
              options={moassaList || []}
              getOptionLabel={(option) => {
                return option.EtabNom || "";
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controls.Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              تسجيل حساب جديد
            </Controls.Button>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
FormInfoInterested.auth = true;
export default FormInfoInterested;
