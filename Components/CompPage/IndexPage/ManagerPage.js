import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";
import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";
import { nanoid } from "nanoid";
import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";
import { Alert, AlertTitle } from "@material-ui/lab";
import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Controls from "../../FormsUi/Control";
import { ButtonWrapper, ButtonRed } from "../../FormsUi/Button/ButtonNorm";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import CheckIcon from "@material-ui/icons/Check";

import DateFnsUtils from "@date-io/dayjs";
import { RuLocalizedUtils } from "../../FormsUi/DatePicker/index";
import arDz from "dayjs/locale/ar-dz";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ar-dz";
import localizedFormat from "dayjs/plugin/localizedFormat";
import toObject from "dayjs/plugin/toObject";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import SendTwoToneIcon from "@material-ui/icons/SendTwoTone";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";
import RedoIcon from "@material-ui/icons/Redo";
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
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";

import SearchIcon from "@material-ui/icons/Search";
import HeadInfoForSchoolManager from "../../HeadInfoForSchoolManager";

import AmendmentRequest from "../../Notification/AmendmentRequest";
import ConfiremRejectDialog from "../../Notification/ConfiremRejectDialog";
import ConfiremApprovedDialog from "../../Notification/ConfiremApprovedDialog";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../../Notification/Alert";
import { AddUserFromManger } from "../../../schemas/schemas_moassa";
import { subjects } from "../../../middleware/StudySubjects";
import DateP from "../../date";
import { useUser, useUsers } from "../../../middleware/Hooks/fetcher";
import ConfirmProvider from "../../UiDialog/ConfirmProvider";
import ConfirmProviderFormik from "../../UiDialog/ConfirmProviderFormik";
import { useRouter } from "next/router";
import Link from "../../Ui/Link";
import * as Yup from "yup";
import { dateFormaNow } from "../../FormsUi/DatePicker";
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
const postionChoise = ["مجبر", "فائض"];
const now = new Date().getUTCFullYear() - 10;
const years = Array(now - (now - 20))
  .fill("")
  .map((v, idx) => (now + idx).toString());
const INITIAL_FORM_STATE = {
  firstName: "", //الاسم
  lastName: "", //اللقب
  dateOfBirth: "",
  //maritalStatus: null,
  //phone: "",
  //numberOfChildren: null, //عدد الاولاد
  //degree: null, //اختيار الدرجة الحالية
  employeeId: "",
  email: "",
  //movemenType: null,
  situation: null, //الوضعية

  specialty: null,
};
const INITIAL_FORM_STATE_DIALOUG_FOR_SEND_TO_BOSS = {
  send: "",
};
const FORM_VALIDATION_DIALOUG_FOR_SEND_TO_BOSS = Yup.object({
  send: Yup.string().required(),
});
let originalRows = {};

const _educationalPhase = ["ابتدائي", "متوسط", "ثانوي"];

const ManagerPage = ({ dataserver }) => {
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
  const [approvedOrReject, setApprovedOrReject] = useState(null); // اما رفض او قبول الاستاذ في الارضية الرقمية
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

  const [
    openDialogMuiForBodySeeInfoForUsers,
    setOpenDialogMuiForBodySeeInfoForUsers,
  ] = useState(false);
  const [
    rowDataDialogMuiForBodySeeInfoForUsers,
    setRowDataDialogMuiForBodySeeInfoForUsers,
  ] = useState("");
  const [inputValuePostion, setInputValuePostion] = useState(""); //اختيار الوضعية
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
  useEffect(() => {
    if (user.educationalPhase === "ابتدائي") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(subjects.primary);
    }
    if (user.educationalPhase === "متوسط") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(subjects.middle);
    }
    if (user.educationalPhase === "ثانوي") {
      //طلب قائمة المؤسسات و مواد التدريس بعد اختيار الطور
      setSpecialtyList(subjects.secondary);
    }
  }, []);

  const getValuePostion = (event, newInputValue) => {
    //اختيار الوضعية تجاه الحركة  راغب مجبر....الخ
    setInputValuePostion(newInputValue);
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

  // const { data, error } = useSWR('/api/user', fetcher)
  /********************* طلب إضافة مؤسسة للجدول *********************start */

  /********************* طلب إضافة مؤسسة للجدول *********************end */

  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************start */

  const putData = (method, url, values, query = "") => {
    const response = axios({
      method: method,
      url: url + (query ? "?year=" + query : ""),
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
    setInputValuePostion("");

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
    return lastdata.findIndex((x) => x?._id === value?._id);
  };
  const handelSubmit = async (values, ...arg) => {
    /**
     * دالة أضف الى القائمة
     * هذه الدالة سمح للمدير باضافة أستاذ لم يصرح بالرغبة أو استاذ فائض
     *
     *
     */
    console.log(values);
    if (indexOfValue(values) < 0) {
      setSpinnersLoding(true);
      putData("post", "/api/Manager/addUser", {
        ...values,
      })
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

    setLastdata(updatedlastdata);
  };
  const formaDate = (rowData, prop) => {
    //شكل التاريخ سنة/شهر/ يوم
    return dateFormaNow(rowData[prop.field]);
  };
  const rowClass = (data) => {
    //لون الصف
    return {
      "row-mojbar": data?.situation === "مجبر",
      "row-raghib": data?.situation === "راغب",
    };
  };
  const approved = null;
  const bodyApproved = (rowData, props) => {
    function onReject(rowData) {
      setSpinnersLoding(true);
      putData(
        "delete",
        "/api/getAllUsers/updateUser",
        { _id: rowData._id },
        year
      )
        .then((response) => {
          setSpinnersLoding(false);

          openToastSuccess(response.data.message);

          //alert(response.data.message);
        })
        .catch((err) => {
          if (err.response) {
            setSpinnersLoding(false);
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
    }
    function onApproved() {
      setSpinnersLoding(true);
      putData(
        "put",
        "/api/getAllUsers/updateUsers",
        { _id: rowData._id, approved: true },
        year
      )
        .then((response) => {
          setSpinnersLoding(false);

          openToastSuccess(response.data.message);

          //alert(response.data.message);
        })
        .catch((err) => {
          if (err.response) {
            setSpinnersLoding(false);
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
    }
    if (rowData?.approved) {
      return (
        <ButtonWrapper variant="text" color="secondary" size="small" fullWidth>
          مقبول
        </ButtonWrapper>
      );
    }
    if (rowData?.approved === false) {
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
    if (rowData?.approved === null) {
      return (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={6}>
            <ConfirmProvider>
              <ConfiremRejectDialog
                rowData={rowData}
                onReject={onReject}
                message={Message}
              >
                رفض
              </ConfiremRejectDialog>
            </ConfirmProvider>
          </Grid>
          <Grid item xs={6}>
            <ConfirmProvider>
              <ConfiremApprovedDialog
                rowData={rowData}
                onApproved={onApproved}
                message={Message}
              >
                قبول
              </ConfiremApprovedDialog>
            </ConfirmProvider>
          </Grid>
        </Grid>
      );
    }
  };
  const bodyApproved1 = (rowData, props) => {
    if (rowData?.addFromManger) {
      return (
        <div style={{ color: "red", backgroundColor: "#fff5f5" }}>
          <Button variant="text" size="small" color="inherit" fullWidth>
            من المدير
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="text"
        color="secondary"
        fullWidth
        size="small"
        style={{ backgroundColor: "rgba(17, 203, 95, 0.04)" }}
      >
        المعني
      </Button>
    );
  };
  const DialogMuiForBodySeeInfoForUsers = () => {
    function closeDialogMuiForBodySeeInfoForUsers() {
      setOpenDialogMuiForBodySeeInfoForUsers(false);
    }

    return (
      <DialogMui
        fullScreen={fullScreen}
        open={openDialogMuiForBodySeeInfoForUsers}
        onClose={closeDialogMuiForBodySeeInfoForUsers}
        PaperComponent={PaperComponent}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          {" "}
          معلومات الأستاذ (ة) :
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                name="firstName"
                label="الاسم"
                value={rowDataDialogMuiForBodySeeInfoForUsers.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={rowDataDialogMuiForBodySeeInfoForUsers.lastName}
                name="lastName"
                label="اللقب"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={dateFormaNow(
                  rowDataDialogMuiForBodySeeInfoForUsers.createdAt
                )}
                name={"createdAt"}
                label="تاريخ التسجيل"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={dateFormaNow(
                  rowDataDialogMuiForBodySeeInfoForUsers.dateOfBirth
                )}
                name={"dateOfBirth"}
                label="تاريخ الميلاد"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={rowDataDialogMuiForBodySeeInfoForUsers.employeeId}
                name="employeeId"
                label="رقم التعريف الوظيفي"
              />
            </Grid>{" "}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={rowDataDialogMuiForBodySeeInfoForUsers.specialty}
                name="specialty"
                label="مادة التدريس"
              />
            </Grid>
            <Grid item xs={12} sm={6} elevation={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={rowDataDialogMuiForBodySeeInfoForUsers.situation}
                name="situation"
                label="الوضعية"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                value={rowDataDialogMuiForBodySeeInfoForUsers.email}
                label="البريد الالكتروني"
                name="email"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonRed
            onClick={closeDialogMuiForBodySeeInfoForUsers}
            color="secondary"
            size="large"
            label="gggg"
            variant="outlined"
            startIcon={<ClearTwoToneIcon />}
          >
            اغلاق
          </ButtonRed>
        </DialogActions>
      </DialogMui>
    );
  };
  const bodySeeInfoForUsers = (rowData, props) => {
    function handleClickOpenInfo() {
      setOpenDialogMuiForBodySeeInfoForUsers(true);
      setRowDataDialogMuiForBodySeeInfoForUsers(rowData);
    }
    return (
      <Typography
        color="primary"
        onClick={handleClickOpenInfo}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        {rowData.firstName}
      </Typography>
    );
  };

  function DateOfBirthPicker(props) {
    dayjs.locale("ar-dz");
    return (
      <>
        <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={"ar-dz"}>
          <KeyboardDatePicker
            fullWidth
            format="YYYY-MM-DD"
            label="السنة"
            value={props.rowData[props.field]}
            onChange={(event, newValue) => {
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
    //جسم الوضعية  راغب مجبر ... الخ في الجدول
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
      if (rowData) {
        editButton(e);
      }
    };

    const consolButton = props.rowEditor.onCancelClick;

    const onRowEditInitconsol = (e) => {
      console.log(rowData);
      if (rowData) {
        consolButton(e);
      }
    };

    const saveButton = props.rowEditor.onSaveClick;
    const onRowEditInitSave = (e) => {
      saveButton(e);
    };

    return (
      <Grid container justifyContent="center" spacing={2}>
        {props.editing ? (
          <>
            {" "}
            <Grid item xs={6}>
              <ButtonRed
                variant="outlined"
                color="secondary"
                aria-label="move back"
                disabled={!rowData}
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
                disabled={
                  rowData
                    ? isEqual(
                        props.rowData,
                        originalRows[indexOfValue(rowData)]
                      )
                    : !rowData
                }
                onClick={onRowEditInitSave}
              >
                <CheckTwoToneIcon />
              </ButtonWrapper>
            </Grid>
          </>
        ) : (
          <Grid item xs={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              aria-label="information update "
              onClick={onRowEditInitCh}
              disabled={rowData?.approved}
            >
              <EditTwoToneIcon />
            </ButtonWrapper>
          </Grid>
        )}
      </Grid>
    );
  };
  const [reasonOfEdit, setReasonOfEdit] = useState("");
  const [
    openDialogMuiForBodySendDataToBoss,
    setOpenDialogMuiForBodySendDataToBoss,
  ] = useState(false);
  // نافذة حوار وتأكيد ارسال طلب تعديل بيانات استاذ الى رئيس المصلحة من طرف المدير المدير
  const DialougForSenToBoss = () => {
    const handelSubmit = (values) => {
      setOpenDialogMuiForBodySendDataToBoss(false);
      console.log(values, rowDataDialogMuiForBodySeeInfoForUsers);
    };
    function closeDialogMuiForBodySeeInfoForUsers() {
      setOpenDialogMuiForBodySendDataToBoss(false);
    }

    return (
      <DialogMui
        fullScreen={fullScreen}
        open={openDialogMuiForBodySendDataToBoss}
        onClose={closeDialogMuiForBodySeeInfoForUsers}
        PaperComponent={PaperComponent}
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={{
            ...INITIAL_FORM_STATE_DIALOUG_FOR_SEND_TO_BOSS,
          }}
          validationSchema={FORM_VALIDATION_DIALOUG_FOR_SEND_TO_BOSS}
          onSubmit={handelSubmit}
        >
          <Form>
            <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
              {" "}
              معلومات الأستاذ (ة) :
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={1}>
                {" "}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    {` ارسال طلب الى رئيس المكتب لفتح التعديل على ملف الاستاذ ${rowDataDialogMuiForBodySeeInfoForUsers.firstName} ${rowDataDialogMuiForBodySeeInfoForUsers.lastName} .`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography subtitle1="body1" color="error">
                    {" "}
                    سبب التعديل :
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Controls.Textfield
                    name="send"
                    fullWidth
                    id="outlined-multiline-static"
                    label="سبب التعديل"
                    multiline
                    aria-label="سبب التعديل"
                    rows={4}
                    variant="outlined"
                    placeholder="أذكر هنا سبب التعديل بدقة "
                  />
                  {/* <TextareaAutosize
              style={{ width: "100%", maxWidth: "100%", minWidth: "100%" }}
             
              
              minRows={6}
              
            /> */}
                </Grid>
              </Grid>
            </DialogContent>{" "}
            <DialogActions>
              <ButtonRed
                onClick={closeDialogMuiForBodySeeInfoForUsers}
                color="secondary"
                size="medium"
                label="gggg"
                variant="text"
                startIcon={<RedoIcon />}
              >
                تراجع
              </ButtonRed>
              <Controls.Button
                fullWidth
                variant="text"
                color="secondary"
                size="medium"
                startIcon={<CheckIcon />}
              >
                تأكيد
              </Controls.Button>
            </DialogActions>{" "}
          </Form>
        </Formik>
      </DialogMui>
    );
  };
  //فتح النافذة الى فوق وايقونة الارسال في الجدول
  const bodySendToBoss = (rowData, props) => {
    function handleClickOpenInfo() {
      setOpenDialogMuiForBodySendDataToBoss(true);
      setRowDataDialogMuiForBodySeeInfoForUsers(rowData);
    }
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <ButtonWrapper
            variant="outlined"
            color="secondary"
            size="small"
            disabled={!rowData.approved}
            onClick={handleClickOpenInfo}
            style={{ transform: "rotate(180deg)" }}
          >
            <SendTwoToneIcon />
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

  console.log(inputValuePostion);
  /****************************body App*************************** */

  return (
    <>
      {" "}
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
        {/* <TransferList selectedMoassa={selectedMoassa}></TransferList> */}
        <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
        </Backdrop>
        <ButtonWrapper
          color="secondary"
          onClick={(e) => setSeeApprovedOrReject(!seeApprovedOrReject)}
          startIcon={<VisibilityIcon />}
        >
          {!seeApprovedOrReject ? "مشاهدة اختياراتي" : "مشاهدة الكل"}
        </ButtonWrapper>
        <Grid container spacing={2} justifyContent="center">
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
                validationSchema={AddUserFromManger}
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
                        <DialogContentText component={"div"}>
                          <Alert component={"div"} severity="warning">
                            <Typography component={"p"} variant="body2">
                              {" "}
                              تحذير : لا تستخدم هذه الخانة الا في حالتين :
                            </Typography>
                            <Typography component={"p"} variant="body2">
                              -1- المجبر الذي رفض التصريح بالرغبة .
                            </Typography>
                            <Typography component={"p"} variant="body2">
                              -2- الفائض .
                            </Typography>
                          </Alert>
                        </DialogContentText>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controls.Textfield name="firstName" label="الاسم" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controls.Textfield name="lastName" label="اللقب" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controls.MaterialUIPickers
                          name={"dateOfBirth"}
                          label="تاريخ الميلاد"
                          format="YYYY-MM-DD"
                          defVlue={new Date().getTime() - 567993600000}
                          max={new Date().getTime() - 567993600000}
                          //views={["year", "month", "date"]}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controls.Textfield
                          name="employeeId"
                          label="رقم التعريف الوظيفي"
                        />
                      </Grid>{" "}
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
                      <Grid item xs={12} sm={6} elevation={6}>
                        <Controls.AutocompleteMui
                          name="situation"
                          label="الوضعية"
                          variant="outlined"
                          inputValue={inputValuePostion}
                          onInputChange={getValuePostion}
                          options={postionChoise}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controls.Textfield
                          id="email"
                          label="البريد الالكتروني"
                          name="email"
                          autoComplete="off"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label="email">
                                  <AlternateEmailIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        >
                          {" "}
                        </Controls.Textfield>
                      </Grid>
                      <Grid item xs={12}>
                        <Alert severity="info">
                          ضع أي بريد الكتروني مؤقتا و سيتم تغييره مستقبلا في
                          حالة طلب الاستاذ الدخول الى المنصة لإختيار الرغبات .
                        </Alert>
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
        <DialogMuiForBodySeeInfoForUsers />
        <DialougForSenToBoss />
        <HeadInfoForSchoolManager loading={isLoading} />
        {!seeApprovedOrReject ? (
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
            frozenWidth="210px"
          >
            <Column selectionMode="multiple" style={{ width: 50 }} frozen />
            <Column
              field="index"
              header="الرقم"
              body={indexOfValueInDataList}
              headerStyle={{ width: 40, padding: 0, height: 57.38 }}
              bodyStyle={{ height: 81 }}
              frozen
            />
            <Column
              field="lastName"
              header="اللقب"
              sortable
              headerStyle={{ width: 120 }}
              editor={inputTextEditor}
            />
            <Column
              field="firstName"
              header="الاسم"
              body={bodySeeInfoForUsers}
              sortable
              headerStyle={{ width: 120 }}
              editor={inputTextEditor}
              frozen
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />
            <Column
              field="specialty"
              header="مادة التدريس"
              headerStyle={{ width: 150, padding: 7 }}
              sortable
            />

            <Column
              field="situation"
              header="الوضعية"
              editor={choiseBody}
              headerStyle={{ width: 150, padding: 7 }}
            />
            <Column
              field="employeeId"
              header="الرقم الوظيفي"
              sortable
              editor={inputTextEditor}
              headerStyle={{ width: 200 }}
            />
            <Column
              field="email"
              header="البريد الالكتروني"
              sortable
              headerStyle={{ width: 200 }}
              editor={inputTextEditor}
            />
            <Column
              header="حالة الحساب"
              headerStyle={{ width: 180 }}
              body={bodyApproved1}
            />
            <Column
              field="dateOfBirth"
              header="تاريخ الميلاد"
              sortable
              headerStyle={{ width: 180 }}
              editor={DateOfBirthPicker}
              body={formaDate}
            />
            <Column
              field="createdAt"
              header="تاريخ التسجيل"
              sortable
              headerStyle={{ width: 180 }}
              body={formaDate}
            />

            <Column
              header="إرسال طلب"
              bodyStyle={{ textAlign: "center", height: 81 }}
              body={bodySendToBoss}
              headerStyle={{ width: 120 }}
            />

            <Column
              header="العمليات"
              rowEditor
              bodyStyle={{ textAlign: "center", height: 81 }}
              body={actionBodyTemplate1}
              headerStyle={{ width: 170 }}
            />

            <Column
              header="تأكيد حساب"
              headerStyle={{ width: 120 }}
              body={bodyApproved}
            />
          </DataTable>
        ) : null}
      </Container>
    </>
  );
};

export default ManagerPage;
