import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";
import { nanoid } from "nanoid";
import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";

import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";

import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";

import AutocompleteMui from "../../Components/Autocmplemoassat";
import Controls from "../../Components/FormsUi/Control";
import {
  ButtonWrapper,
  ButtonRed,
} from "../../Components/FormsUi/Button/ButtonNorm";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";

import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";

import ScaleLoader from "react-spinners/ScaleLoader";
import dynamic from "next/dynamic";

import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import TextField from "@material-ui/core/TextField";
import DialogMui from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";
import Draggable from "react-draggable";

import { styled } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import IntegrationNotistack from "../../Components/Notification/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import { withSnackbar } from "notistack";
import Static from "../../Components/static";

import ConfiremDeleteDialog from "../../Components/Notification/ConfiremDeleteDialog";
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../../Components/Notification/Alert";
import { moassaSchema } from "../../schemas/schemas_moassa";
import { subjects, getKeyByValue, loopf } from "../../middleware/StudySubjects";
import replaceStrIcon from "../../Components/IconReplaceTxt/IconRepTxt";
import replaceWilayaBody from "../../Components/IconReplaceTxt/WilayaBody";
import DateP from "../../Components/date";
import { useUser, useUsers } from "../../middleware/Hooks/fetcher";
import ConfirmProvider from "../../Components/UiDialog/ConfirmProvider";
import { Dropdown } from "hassanreact/dropdown";
import { useRouter } from "next/router";
import Link from "../../Components/Ui/Link";
const Autocomplete = dynamic(() => import("@material-ui/lab/Autocomplete"), {
  ssr: false,
});
function PaperComponent(props) {
  return (
    <Draggable
      handle="#form-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const now = new Date().getUTCFullYear() - 10;
const years = Array(now - (now - 20))
  .fill("")
  .map((v, idx) => (now + idx).toString());
const INITIAL_FORM_STATE = {
  wilaya: null,
  baldia: null, //البلدية
  educationalPhase: null, //الطور
  specialty: null,
  workSchool: null, //مؤسسة العمل
  potentialVacancy: 0, //محتمل
  forced: 0, //مجبر
  vacancy: 0, //شاغر
  surplus: 0, //فائض
};

let originalRows = {};

const _educationalPhase = ["ابتدائي", "متوسط", "ثانوي"];
let arrt = [];
const DataTableCrud = ({ dataserver }) => {
  //const { data: session ,status:status} = useSession();
  //console.log(session,status);

  // if (!props.session) {
  //   return (
  //     <>
  //       Not signed in <br />
  //       <button onClick={() => signIn()}>Sign in</button>
  //     </>
  //   );
  // }

  /**----------------all useState----------------------- */
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const { data, isLoading, isError, isMutate } = useUsers("/api/getAllUsers/");
  const [loading, setLoading] = useState(true), //جاري التحميل للجدول الرئيسي و احصائيات المدارس
    [listMoassat, setListMoassat] = useState([]), //قائمة المؤسسات المعنية بالحركة
    [selectedMoassa, setSelectedMoassa] = useState([]), //المؤسسات التي تم تحديدها للحذف
    [globalFilter, setGlobalFilter] = useState(null), //الكلمة التي سيتم البحث عنها في الجدول
    [open, setOpen] = useState(false), //فتح النافذة المنبثقة لإضافة مدرسة في جدول الحركة
    [spinnersLoding, setSpinnersLoding] = useState(false), //سبينر في انتظار رد السرفر على طلب اضافة مدرسة
    [editingRows, setEditingRows] = useState({}); //تعديل الداتا في صف معين من الجدول
  const [year, setYear] = useState(
    years.includes(router.query.year)
      ? router.query.year
      : new Date().getFullYear()
  );
  /**
   * !!! *******************************new useState**********************************
   */

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
  const [lastdata, setLastdata] = useState(dataserver);
  const updatedData = isLoading ? dataserver : data;

  useEffect(() => {
    setLastdata(isLoading ? dataserver : data);
  }, [data]);

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
    setInputValueMoassa("");
    setInputValueSpecialty("");

    setSpecialtyList([]);
    setMoassaList([]);
    //!انتهى التفريغ

    setEducationalValuePhase(newInputValue);

    if (newInputValue) {
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
      setSpecialtyList(subjects.primary);
    }
    if (newInputValue === "متوسط") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(subjects.middle);
    }
    if (newInputValue === "ثانوي") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(subjects.secondary);
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
  //! ***************************/end new useState
  /**----------------all useState----------------------- */
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  /**!**********************getMoassat********************************* */
  const fetcher = async (url, param = "") => {
    const res = await axios.get(url, {
      params: {
        ...param,
      },
    });
    const data = await res.data;

    return data;
  };
  /** **************************** دالة الخروج ********************* */
  const signOut = async () => {
    const res = await fetch("/api/authusers/logout");

    if (res.status === 204) {
      mutate({ user: null });
      router.push("/auth/login");
    }
  };
  // const { data, error } = useSWR('/api/user', fetcher)
  /********************* طلب إضافة مؤسسة للجدول *********************start */

  /********************* طلب إضافة مؤسسة للجدول *********************end */

  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************start */

  const putData = (method, url, values, query = "") => {
    const response = axios({
      method: method,
      url: url + "?year=" + query,
      data: values,
    });

    return response;
  };
  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************end */

  const onSelected = (e, d) => {
    setSelectedMoassa(e.value);
  };

  const dt = useRef(null);

  /*******************ازالة مؤسسة من القائمة**********start******** */
  const [Message, setMessage] = useState(false);
  const deleteProduct = (rowData, e, t) => {
    setSpinnersLoding(true);
    putData("put", "/api/delete", rowData, year)
      .then((response) => {
        setSpinnersLoding(false);

        openToastSuccess(response.data.message);

        //alert(response.data.message);
      })
      .catch((err) => {
        if (err.response) {
          openToastError(err.response.data.message || err.response.data);
          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          // client never received a response, or request never left
        } else {
          // anything else
        }
      })
      .finally(() => {
        isMutate(data);
      });

    //setConfirmDeleteDailog(rowData);
    //setDeleteProductDialog(true);
  };
  /*******************ازالة مؤسسة من القائمة**********end******** */

  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------بداية----- */

  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------نهاية------ */

  /************start**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  const handleClickOpen = () => {
    if (wilayaList.length === 0) {
      fetcher(`/api/getlistwilaya`) //طلب  المديرية  المعنية
        .then(function (response) {
          setWilayaList(response);
        })
        .catch((err) => {});
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  /************end**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  const handleDeleteSelected = () => {
    setSpinnersLoding(true);

    let _lastdata = lastdata
      .filter((val) => selectedMoassa.includes(val))
      .map((ele) => {
        return {
          EtabMatricule: ele.workSchool.EtabMatricule,
          specialty: ele.specialty,
          educationalPhase: ele.educationalPhase,
          key: ele.wilaya.key,
          cle: ele.baldia.cle,
        };
      });

    putData("put", "/api/deletMany", { arrayEtabMatricule: _lastdata }, year)
      .then((response) => {
        setSpinnersLoding(false);
        setSelectedMoassa([]);

        setLastdata(data);

        openToastSuccess(response.data.message);
        //alert(response.data.message);
      })
      .catch((err) => {
        if (err.response) {
          //openToastError(err.response.data.message || err.response.data);
          setSpinnersLoding(false);
          openToastError("حدث خطأ ما");

          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          setSpinnersLoding(false);
          openToastError("لا يمكن ارسال الطلب");
          // client never received a response, or request never left
        } else {
          // anything else
          setSpinnersLoding(false);
          openToastError("حدث خطأ ما");
        }
      })
      .finally(() => {
        isMutate(data);
      });
  };
  /**-******************************************Submit************************************************************** */
  const indexOfValue = (value) => {
    console.log(lastdata);
    return lastdata.findIndex(
      (x) =>
        x.workSchool.EtabMatricule === value.workSchool.EtabMatricule &&
        x.specialty === value.specialty
    );
  };
  const handelSubmit = async (values, ...arg) => {
    if (indexOfValue(values) < 0) {
      setSpinnersLoding(true);
      putData("post", "/api/addtotable", values, year)
        .then((response) => {
          setSpinnersLoding(false);
          //alert(response.data);
          openToastSuccess(response.data.message);
        })
        .catch((err) => {
          setSpinnersLoding(false);
          if (err.response) {
            openToastError(err.response.data.message || err.response.data);

            // client received an error response (5xx, 4xx)
          } else if (err.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
        })
        .finally(() => isMutate(data));
    } else {
      openToastInfo("موجود بالفعل");
    }
  };
  /**********************indexOfValueInDataList************************ */

  const indexOfValueInDataList = (data, props) => {
    return <div>{indexOfValue(data) + 1}</div>;
  };
  /**********************indexOfValueInDataList************************ */
  /********************edit Rows**************************** */
  const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
  };

  const onRowEditChange = (event) => {
    console.log(event);
    setEditingRows(event.data);
  };
  const onRowEditInit = (event) => {
    originalRows[indexOfValue(event.data)] = {
      ...lastdata[indexOfValue(event.data)],
    };
  };

  const onRowEditCancel = (event) => {
    let _data = [...data];
    _data[event.index] = originalRows[event.index];
    delete originalRows[event.index];

    isMutate(_data);
    setLastdata(_data);
    console.log(data, updatedData);
  };

  const onRowEditSave = (event) => {
    setSpinnersLoding(true);
    putData("put", "/api/getAllUsers/updateUser", event.data, year)
      .then((response) => {
        setSpinnersLoding(false);
        openToastSuccess(response.data.message);

        //alert(response.data);
      })
      .catch((err) => {
        setLastdata(updatedData);
        setSpinnersLoding(false);
        if (err.response) {
          if (err.response.data.name === "ValidationError") {
            openToastError(err.response.data.errors[0]);
          } else {
            openToastError("حدث خطأ ما");
          }

          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          // client never received a response, or request never left
        } else {
          // anything else
        }
      })
      .finally(() => isMutate(data));
  };

  const onEditorValueChange = (props, value) => {
    let updatedlastdata = [...lastdata];

    props.rowData[props.field] = value;
    updatedlastdata[indexOfValue(props.rowData)][props.field] = value;

    //console.log(props,value,updatedlastdata[props.rowIndex][props.field],isEqual(props.rowData,originalRows[props.rowIndex]));
    console.log(updatedlastdata);
    setLastdata(updatedlastdata);
  };

  const inputTextEditor = (props) => {
    return (
      <TextField
        label={props.header}
        value={props.rowData[props.field]}
        onChange={(e) => onEditorValueChange(props, e.target.value)}
        name="numberformat"
        id="formatted-numberformat-input"
      />
    );
  };
  /**************************جسم تحديث البانات في الجدول *********************** */
  const actionBodyTemplate1 = (rowData, props) => {
    const editButton = props.rowEditor.onInitClick;

    const onRowEditInitCh = (e) => {
      editButton(e);
    };

    const consolButton = props.rowEditor.onCancelClick;

    const onRowEditInitconsol = (e) => {
      consolButton(e);
    };

    const saveButton = props.rowEditor.onSaveClick;
    const onRowEditInitSave = (e) => {
      saveButton(e);
    };

    if (props.editing) {
      return (
        <>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={6}>
              <ButtonRed
                variant="outlined"
                color="secondary"
                aria-label="move back"
                onClick={onRowEditInitconsol}
              >
                <ClearTwoToneIcon />
              </ButtonRed>
            </Grid>
            <Grid item xs={6}>
              <ButtonWrapper
                variant="outlined"
                color="secondary"
                aria-label="save edits "
                onClick={onRowEditInitSave}
                disabled={isEqual(
                  props.rowData,
                  originalRows[indexOfValue(rowData)]
                )}
              >
                <CheckTwoToneIcon />
              </ButtonWrapper>
            </Grid>
          </Grid>
        </>
      );
    }
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={4}>
          <ButtonWrapper
            variant="outlined"
            color="primary"
            aria-label="information update "
            onClick={onRowEditInitCh}
          >
            <EditTwoToneIcon />
          </ButtonWrapper>
        </Grid>
        <Grid item xs={4}>
          <ConfirmProvider>
            <ConfiremDeleteDialog
              rowData={rowData}
              onDeleteProduct={deleteProduct}
              message={Message}
            />
          </ConfirmProvider>
        </Grid>
        <Grid item xs={4}>
          <ButtonWrapper
            variant="outlined"
            color="secondary"
            aria-label="save edits "
            onClick={onRowEditInitSave}
            disabled={isEqual(
              props.rowData,
              originalRows[indexOfValue(rowData)]
            )}
          >
            <CheckTwoToneIcon />
          </ButtonWrapper>
        </Grid>
      </Grid>
    );
  };

  /*****************************رأس الجدول***************************** */
  const onYearPicker = (e) => {
    setYear(e);
    router.push(`${e}`);
    //setLoading(true);
  };
  const headarTable = (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item container xs={12} sm={12} md={5} lg={4} spacing={1}>
          <Grid item xs={12} sm={6}>
            <ButtonRed
              variant="outlined"
              color="secondary"
              onClick={handleDeleteSelected}
              disabled={selectedMoassa.length === 0 ? true : false}
              startIcon={<DeleteTwoToneIcon />}
            >
              حذف من القائمة
            </ButtonRed>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<AddTwoToneIcon />}
            >
              أضف الى القائمة
            </ButtonWrapper>
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={6} md={3} lg={3} spacing={1}>
          <Grid item xs={6}>
            <ButtonRed
              variant="outlined"
              color="secondary"
              //onClick={}
              disabled={lastdata.length === 0 ? true : false}
              startIcon={<CloudUploadTwoToneIcon />}
            >
              تصدير
            </ButtonRed>
          </Grid>
          <Grid item xs={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<CloudDownloadTwoToneIcon />}
            >
              إستراد
            </ButtonWrapper>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DateP onChange={onYearPicker} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="component-outlined">بحــث</InputLabel>
            <OutlinedInput
              id="component-outlined"
              onInput={(e) => setGlobalFilter(e.target.value)}
              label="بحــث"
              endAdornment={
                <IconButton aria-label="search ">
                  <SearchIcon />
                </IconButton>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );

  /****************************body App*************************** */
  // const static = lastdata.map((x)=>{

  // })
  // let headerGroup = (
  //   <ColumnGroup>
  //     <Row>
  //       <Column header="Product" rowSpan={3} />
  //       <Column header="Sale Rate" colSpan={4} />
  //     </Row>
  //     <Row>
  //       {lastdata.map((elm) => {
  //         <Column
  //           header={`${elm.specialty}`}
  //           field={`${elm.specialty}`}
  //           colSpan={4}
  //         />;
  //       })}
  //     </Row>
  //     <Row>
  //       <Column header="Last Year" sortable field="lastYearSale" />
  //       <Column header="This Year" sortable field="thisYearSale" />
  //       <Column header="Last Year" sortable field="lastYearProfit" />
  //       <Column header="This Year" sortable field="thisYearProfit" />
  //     </Row>
  //   </ColumnGroup>
  // );
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);
  const [selectedInputStatus, setSelectedInputStatus] = useState(null);
  const statuses = ["ابتدائي", "ثانوي", "متوسط"];
  const statusItemTemplate = (option) => {
    return <span>{option}</span>;
  };
  const onStatusChange = (e) => {
    dt.current.filter(e.value, "educationalPhase", "equals");
    setSelectedStatus(e.value);
  };

  const statusFilter = (
    <Autocomplete
      value={selectedStatusFilter}
      onChange={(event, newValue) => {
        dt.current.filter(newValue, "educationalPhase", "equals");
        setSelectedStatusFilter(newValue);
      }}
      //  inputValue={inputValue}
      //  onInputChange={(event, newInputValue) => {
      //    setInputValue(newInputValue);
      //  }}
      noOptionsText="لا توجد خيارات"
      id="controllable-states-demo"
      options={statuses}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="اختر الطور" />}
    />
  );
  const wilayaFilter = (
    <Autocomplete
      value={selectedInputStatus}
      onChange={(event, newValue) => {
        dt.current.filter(newValue?.value, "wilaya.value", "equals");
        setSelectedInputStatus(newValue);
      }}
      //  inputValue={inputValue}
      //  onInputChange={(event, newInputValue) => {
      //    setInputValue(newInputValue);
      //  }}
      onOpen={() => {
        if (wilayaList.length === 0) {
          fetcher(`/api/getlistwilaya`) //طلب  المديرية  المعنية
            .then(function (response) {
              setWilayaList(response);
            })
            .catch((err) => {});
        }
      }}
      noOptionsText="في الانتظار"
      id="controllable-states-demo"
      options={wilayaList}
      getOptionLabel={(option) => {
        if (option.value === "مديرية التربية للجزائر وسط") {
          return (
            option.value.replace("مديرية التربية للجزائر وسط", "الجزائر و") ||
            ""
          );
        }
        if (option.value === "مديرية التربية للجزائر غرب") {
          return (
            option.value.replace("مديرية التربية للجزائر غرب", "الجزائر غ") ||
            ""
          );
        }
        if (option.value === "مديرية التربية للجزائر شرق") {
          return (
            option.value.replace("مديرية التربية للجزائر شرق", "الجزائر ش") ||
            ""
          );
        }
        return option.value.replace("مديرية التربية لولاية", "") || "";
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="المديرية" />}
    />
  );
  return (
    <>
      {" "}
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
        <div>
          <button onClick={signOut}>Sign out</button>
          <Link color="primary" href="/auth/login">
            <button>login</button>{" "}
          </Link>
          <Link color="primary" href="/choise/2021">
            <Button color="primary" variant="outlined">
              choise
            </Button>
          </Link>
          <Link color="primary" href="/users/2021">
            <Button color="primary" variant="outlined">
              users
            </Button>
          </Link>
        </div>
        {/* <TransferList selectedMoassa={selectedMoassa}></TransferList> */}

        <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
        </Backdrop>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={9}>
            <Paper elevation={3} style={{ padding: 10 }}>
              <Typography variant="h4" component="h1" align="center">
                جدول الحركة التنقلية للموسم {`${year} / ${year + 1}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <DialogMui
              fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              PaperComponent={PaperComponent}
              aria-labelledby="form-dialog-title"
            >
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE,
                }}
                validationSchema={moassaSchema}
                onSubmit={handelSubmit}
              >
                <Form>
                  <DialogTitle id="form-dialog-title">
                    {" "}
                    أضف الى القائمة
                  </DialogTitle>
                  <DialogContent>
                    <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <DialogContentText>
                          اختر الدائرة ثم المؤسسة
                        </DialogContentText>
                      </Grid>
                      <Grid item xs={3}>
                        <Controls.Textfield
                          name={"potentialVacancy"}
                          label={"محتمل الشغور"}
                          type="number"
                          InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }}

                          // InputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Controls.Textfield
                          name={"forced"}
                          label={"مجبر"}
                          type="number"
                          InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }}

                          // InputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Controls.Textfield
                          name={"vacancy"}
                          label={"شاغر"}
                          type="number"
                          InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }}

                          // InputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Controls.Textfield
                          name={"surplus"}
                          label={"فائض"}
                          type="number"
                          InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }}

                          // InputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
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
                      <Grid item xs={12} elevation={6}>
                        <Controls.AutocompleteMui
                          name="educationalPhase"
                          label="الطور"
                          variant="outlined"
                          inputValue={educationalValuePhase}
                          onInputChange={getValueEducationalPhase}
                          options={educationalPhaseList}
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
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

                      {/* <div className="p-field">
                  <Virtualize data={data} onChange={getDaira} />
                </div> */}

                      {/* <Grid item xs={12}>
                        <AutocompleteMui
                          name="daira"
                          label="الدائرة"
                          inputValue={inputValueDaira}
                          onInputChange={getValueDaira}
                          options={dataServer}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <AutocompleteMui
                          name="moassa"
                          label="المؤسسة"
                          loading
                          loadingText={"في الانتظار"}
                          inputValue={inputValueMoassa}
                          onInputChange={getValueMoassa}
                          options={
                            gobalOptions[inputValueDaira]?.moassata || []
                          }
                          getOptionLabel={(option) => {
                            return option.EtabNom || "";
                          }}
                        />
                      </Grid> */}
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <ButtonRed
                      onClick={handleClose}
                      color="secondary"
                      size="large"
                      label="gggg"
                      variant="outlined"
                      startIcon={<ClearTwoToneIcon />}
                    >
                      الغاء
                    </ButtonRed>

                    <Controls.Button
                      color="primary"
                      startIcon={<CheckTwoToneIcon />}
                      variant="outlined"
                    >
                      حفظ
                    </Controls.Button>
                  </DialogActions>
                </Form>
              </Formik>
            </DialogMui>
          </Grid>
        </Grid>

        <Static data={lastdata} loading={isLoading} />
        <DataTable
          ref={dt}
          value={lastdata || []}
          selectionMode="checkbox"
          selection={selectedMoassa}
          onSelectionChange={onSelected}
          dataKey="_id"
          emptyMessage="لا توجد بيانات لعرضها"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          editMode="row"
          onRowEditInit={onRowEditInit}
          onRowEditCancel={onRowEditCancel}
          onRowEditSave={onRowEditSave}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="عرض {first} الى {last} من اصل {totalRecords}"
          editingRows={editingRows}
          onRowEditChange={onRowEditChange}
          globalFilter={globalFilter}
          header={headarTable}
          stripedRows
          removableSort
          loading={isLoading}
          scrollable
          scrollHeight="490px"
          frozenWidth="240px"
        >
          <Column
            selectionMode="multiple"
            style={{ width: 50 }}
            frozen
          ></Column>
          <Column
            field="index"
            header="الرقم"
            body={indexOfValueInDataList}
            headerStyle={{ width: 40, padding: 0, height: 57.38 }}
            bodyStyle={{ height: 81 }}
            frozen
          ></Column>
          <Column
            field="educationalPhase"
            header="الطور"
            filter
            filterElement={statusFilter}
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          <Column
            field="specialty"
            header="مادة التدريس"
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          <Column
            field="workSchool.EtabNom"
            header="المؤسسة"
            sortable
            style={{ width: 300 }}
            body={replaceStrIcon}
          ></Column>

          <Column
            field="wilaya.value"
            header="الولاية"
            body={replaceWilayaBody}
            filter
            filterElement={wilayaFilter}
            headerStyle={{ width: 150 }}
            bodyStyle={{ width: 150 }}
            sortable
            frozen
          ></Column>

          <Column
            field="baldia.valeur"
            header="البلدية"
            sortable
            headerStyle={{ width: 114, padding: 7 }}
          ></Column>
          {/* <Column
            field="workSchool.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column> */}
          <Column
            field="situation"
            header="الوضعية"
            editor={inputTextEditor}
            headerStyle={{ width: 120, padding: 7 }}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            field="employeeId"
            header="الرقم الوظيفي"
            sortable
            editor={inputTextEditor}
            headerStyle={{ width: 200 }}
          >
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column
            field="email"
            header="البريد الالكتروني"
            sortable
            headerStyle={{ width: 200 }}
            editor={inputTextEditor}
          ></Column>
          <Column
            field="lastName"
            header="اللقب"
            sortable
            headerStyle={{ width: 120 }}
            editor={inputTextEditor}
          >
            {/*body={ratingBodyTemplate}*/}
          </Column>
          <Column
            field="firstName"
            header="الاسم"
            sortable
            headerStyle={{ width: 120 }}
            editor={inputTextEditor}
          >
            {/*body={ratingBodyTemplate}*/}
          </Column>

          <Column
            rowEditor
            bodyStyle={{ textAlign: "center", height: 81 }}
            body={actionBodyTemplate1}
            headerStyle={{ width: 250 }}
          >
            {/**/}
          </Column>
        </DataTable>
      </Container>
    </>
  );
};

export async function getServerSideProps({ req, query, res, params }) {
  const urlBass = await process.env.URL_BASE;
  const cookie = await req?.headers.cookie;
  const year = (await years.includes(params.year))
    ? params.year
    : new Date().getFullYear();
  if (!years.includes(params.year)) {
    return {
      redirect: {
        destination: `/users/${year}`,
        permanent: false,
      },
    };
  }
  const response = await fetch(`${urlBass}/api/getAllUsers/${params.year}`, {
    headers: {
      cookie: cookie,
    },
  });

  if (!response.ok) {
    return {
      notFound: true,
    };
  }
  const dataserver = await response.json();
  return {
    props: { dataserver }, // will be passed to the page component as props
  };
}
DataTableCrud.auth = true;

export default DataTableCrud;
