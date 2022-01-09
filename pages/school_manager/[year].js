import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";
import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";

import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";

import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";

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
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/dayjs";
import { RuLocalizedUtils } from "../../Components/FormsUi/DatePicker/index";
import arDz from "dayjs/locale/ar-dz";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ar-dz";
import localizedFormat from "dayjs/plugin/localizedFormat";
import toObject from "dayjs/plugin/toObject";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import SendTwoToneIcon from "@material-ui/icons/SendTwoTone";
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
import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import IconButton from "@material-ui/core/IconButton";

import SearchIcon from "@material-ui/icons/Search";
import HeadInfoForSchoolManager from "../../Components/HeadInfoForSchoolManager";

import ConfiremDeleteDialog from "../../Components/Notification/ConfiremDeleteDialog";
import ConfiremRejectDialog from "../../Components/Notification/ConfiremRejectDialog";
import ConfiremApprovedDialog from "../../Components/Notification/ConfiremApprovedDialog";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../../Components/Notification/Alert";
import { moassaSchema } from "../../schemas/schemas_moassa";
import { subjects } from "../../middleware/StudySubjects";
import DateP from "../../Components/date";
import { useUser, useUsers } from "../../middleware/Hooks/fetcher";
import ConfirmProvider from "../../Components/UiDialog/ConfirmProvider";
import { useRouter } from "next/router";
import Link from "../../Components/Ui/Link";
import { dateFormaNow } from "../../Components/FormsUi/DatePicker";
const Autocomplete = dynamic(() => import("@material-ui/lab/Autocomplete"), {
  ssr: false,
});

/**
 * لوحة التحكم المدير
 * @param {*} props
 * @returns
 */
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(toObject);
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
const postionChoise = [
  "راغب",
  "مجبر",
  "فائض",
  "محال على الاستيداع",
  "منتدب",
  "تحت التصرف",
  "عطلة طويلة الأمد",
];
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

const DataTableCrud = ({ dataserver }) => {
  /**----------------all useState----------------------- */
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const { data, isLoading, isError, isMutate } = useUsers(
    "/api/getListForSchoolManager/"
  );
  const [selectedMoassa, setSelectedMoassa] = useState([]), //المؤسسات التي تم تحديدها للحذف
    [globalFilter, setGlobalFilter] = useState(null), //الكلمة التي سيتم البحث عنها في الجدول
    [open, setOpen] = useState(false), //فتح النافذة المنبثقة لإضافة مدرسة في جدول الحركة
    [spinnersLoding, setSpinnersLoding] = useState(false), //سبينر في انتظار رد السرفر على طلب اضافة مدرسة
    [editingRows, setEditingRows] = useState({}); //تعديل الداتا في صف معين من الجدول
  const [year, setYear] = useState(
    years.includes(router.query.year)
      ? router.query.year
      : new Date().getFullYear()
  );

  const [seeApprovedOrReject, setSeeApprovedOrReject] = useState(false); //شاهدة اما المقبولين او المرفوضين
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
    if (!years.includes(router.query.year)) {
      router.push(`${new Date().getFullYear()}`);
    }
  }, [router.query.year]);
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
  const deleteUser = (rowData, e, t) => {
    setSpinnersLoding(true);
    putData("delete", "/api/getAllUsers/updateUser", rowData, year)
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
  const rejectUser = (rowData, e, t) => {};
  const approvedUser = (rowData, e, t) => {};

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
    // let newlistMoassat = listMoassat.filter((val) => !selectedMoassa.includes(val));

    // let _listMoassat = listMoassat
    //   .filter((val) => selectedMoassa.includes(val))
    //   .map((ele) => ele._id);
    let _lastdata = lastdata
      .filter((val) => selectedMoassa.includes(val))
      .map((ele) => ele._id);

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
    return lastdata.findIndex((x) => x._id === value._id);
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
  function originalData(event) {
    let _data = [...data];
    _data[event.index] = originalRows[event.index];
    delete originalRows[event.index];

    isMutate(_data);
    setLastdata(_data);
    return;
  }
  const onRowEditCancel = (event) => {
    originalData(event);
    console.log(data, updatedData);
  };

  const onRowEditSave = (event) => {
    setSpinnersLoding(true);

    putData("put", "/api/getAllUsers/updateUser", event.data, year)
      .then((response) => {
        setSpinnersLoding(false);
        openToastSuccess(response.data.message);
        isMutate(data);
        //alert(response.data);
      })
      .catch((err) => {
        originalData(event);
        console.log(err, err.response);
        setSpinnersLoding(false);
        if (err.response) {
          if (err.response.data.name === "ValidationError") {
            openToastError(err.response.data.errors[0]);
          } else {
            openToastError(err.response.data.message);
          }

          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          // client never received a response, or request never left
        } else {
          // anything else
        }
      });
  };

  const onEditorValueChange = (props, value) => {
    let updatedlastdata = [...lastdata];

    props.rowData[props.field] = value;
    updatedlastdata[indexOfValue(props.rowData)][props.field] = value;

    //console.log(props,value,updatedlastdata[props.rowIndex][props.field],isEqual(props.rowData,originalRows[props.rowIndex]));
    console.log(updatedlastdata);
    setLastdata(updatedlastdata);
  };
  const formaDate = (rowData, prop) => {
    return dateFormaNow(rowData[prop.field]);
  };
  const rowClass = (data) => {
    return {
      "row-mojbar": data.situation === "مجبر",
      "row-raghib": data.situation === "راغب",
    };
  };
  const bodyApproved = (rowData, prop) => {
    const approved = null;
    if (approved) {
      return (
        <ButtonWrapper variant="text" color="secondary" fullWidth>
          مقبول
        </ButtonWrapper>
      );
    }
    if (approved === false) {
      return (
        <ButtonRed
          variant="outlined"
          color="secondary"
          fullWidth
          style={{ fontWeight: 500 }}
        >
          مرفوض
        </ButtonRed>
      );
    }
    if (approved === null) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <ConfirmProvider>
              <ConfiremRejectDialog
                rowData={rowData}
                onReject={rejectUser}
                message={Message}
              />
            </ConfirmProvider>
          </Grid>
          <Grid item xs={6}>
            <ConfirmProvider>
              <ConfiremApprovedDialog
                rowData={rowData}
                onApproved={approvedUser}
                message={Message}
              />
            </ConfirmProvider>
          </Grid>
        </Grid>
      );
    }
  };

  function DateOfBirthPicker(props) {
    dayjs.locale("ar-dz");
    return (
      <>
        <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={"ar-dz"}>
          <KeyboardDatePicker
            fullWidth
            format="DD-MM-YYYY"
            label="السنة"
            value={props.rowData[props.field]}
            onChange={(event, newValue) => {
              console.log(props, newValue, new Date(event).toISOString());
              onEditorValueChange(props, new Date(event).toISOString());
              //setSelectedInputStatus(newValue);
            }}
            autoOk
            minDate={"1958-01-01"}
            maxDate={"2004-01-01"}
            cancelLabel={"الغاء"}
            okLabel="موافق"
            id="dateOfBirth"
            minDateMessage={null}
            maxDateMessage={null}
          />
        </MuiPickersUtilsProvider>
      </>
    );
  }

  const choiseBody = (props) => {
    //جسم الوضعية في الجدول
    return (
      <Autocomplete
        value={props.rowData[props.field]}
        onChange={(event, newValue) => {
          onEditorValueChange(props, newValue);
          //setSelectedInputStatus(newValue);
        }}
        //  inputValue={inputValue}
        //  onInputChange={(event, newInputValue) => {
        //    setInputValue(newInputValue);
        //  }}

        noOptionsText="في الانتظار"
        id="choise"
        disableClearable
        options={postionChoise}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={props.header} />}
      />
    );
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
    const sendToBoss = () => {
      //ارسال معلومات ورغبات الاساتذة المشاركين في الحركة
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
              onDeleteProduct={deleteUser}
              message={Message}
            />
          </ConfirmProvider>
        </Grid>
        <Grid item xs={4}>
          <ButtonWrapper
            variant="outlined"
            color="secondary"
            aria-label="send to boss"
            onClick={sendToBoss}
            disabled={isEqual(
              props.rowData,
              originalRows[indexOfValue(rowData)]
            )}
          >
            <SendTwoToneIcon style={{ transform: "rotateZ(180deg)" }} />
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
          {/* <Grid item xs={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<CloudDownloadTwoToneIcon />}
            >
              إستراد
            </ButtonWrapper>
          </Grid> */}
          <Grid item xs={6}>
            <ButtonWrapper
              color="secondary"
              onClick={(e) => setSeeApprovedOrReject(!seeApprovedOrReject)}
              startIcon={<VisibilityIcon />}
            >
              {!seeApprovedOrReject ? "مشاهدة اختياراتي" : "مشاهدة الكل"}
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
                جدول الحركة التنقلية للموسم {`${year} / ${+year + 1}`}
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

        <HeadInfoForSchoolManager loading={isLoading} />
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
          rowClassName={rowClass}
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
            field="specialty"
            header="مادة التدريس"
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          {/* <Column
            field="workSchool.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column> */}
          <Column
            field="situation"
            header="الوضعية"
            editor={choiseBody}
            headerStyle={{ width: 150, padding: 7 }}
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
            field="dateOfBirth"
            header="تاريخ الميلاد"
            sortable
            headerStyle={{ width: 180 }}
            editor={DateOfBirthPicker}
            body={formaDate}
          >
            {/*body={createdAt}*/}
          </Column>
          <Column
            field="createdAt"
            header="تاريخ التسجيل"
            sortable
            headerStyle={{ width: 180 }}
            body={formaDate}
          >
            {/*body={createdAt}*/}
          </Column>
          <Column
            header="العمليات"
            rowEditor
            bodyStyle={{ textAlign: "center", height: 81 }}
            body={actionBodyTemplate1}
            headerStyle={{ width: 250 }}
          ></Column>
          <Column
            field="approved"
            header="قبول الطلب"
            sortable
            headerStyle={{ width: 180 }}
            body={bodyApproved}
          >
            {/*body={createdAt}*/}
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
        destination: `/school_manager/${year}`,
        permanent: false,
      },
    };
  }

  const response = await fetch(
    `${urlBass}/api/getListForSchoolManager/${year}`,
    {
      headers: {
        cookie: cookie,
      },
    }
  );

  if (!response.ok) {
    return {
      notFound: true,
    };
  }
  const dataserver = await response.json();

  console.log(dataserver);
  return {
    props: { dataserver }, // will be passed to the page component as props
  };
}
DataTableCrud.auth = true;
export default DataTableCrud;
