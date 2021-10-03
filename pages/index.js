import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";

import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";

import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";

import AutocompleteMui from "../Components/Autocmplemoassat";
import Controls from "../Components/FormsUi/Control";
import ButtonWrapper from "../Components/FormsUi/Button/ButtonNorm";
import Typography from "@material-ui/core/Typography";
import { Container, Grid, Paper } from "@material-ui/core";

import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";

import ScaleLoader from "react-spinners/ScaleLoader";

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

import axios from "axios";
import Draggable from "react-draggable";

import { styled } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import IntegrationNotistack from '../Components/Notification/Alert';
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import {  withSnackbar } from 'notistack';
import Static from "../Components/static";

import AlertDialog from "../Components/Notification/ConfiremDeleteDialog";
import {openToastSuccess,openToastError} from '../Components/Notification/Alert';
import { moassaSchema } from "../schemas/schemas_moassa";

import replaceStrIcon from "../Components/IconReplaceTxt/IconRepTxt";
import DateP from '../Components/date';

const MyButton = styled(ButtonWrapper)({
  minWidth: 40,
  padding: "5px 6px",
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

const themebutton = createTheme({
  direction: "rtl",
  palette: {
    secondary: {
      main: red.A700,
    },
  },

  typography: {
    fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif"',
    h6: {
      fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif""',
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    body1: {
      fontFamily: '"Cairo" ,"Roboto", "Helvetica", "Arial", "sans-serif""',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
  },
});
let arr = [];
arr[24] = "none";
const spinners = createTheme({
  direction: "rtl",
  palette: {
    background: {
      paper: "transparent",
    },
  },
  shadows: arr,
});

const INITIAL_FORM_STATE = {
  potentialVacancy: 0, //محتمل
  forced: 0, //مجبر
  vacancy: 0, //شاغر
  surplus: 0, //فائض
  moassa: [{ EtabMatricule: null, EtabNom: null, bladia: null }],
  daira: null,
};

let originalRows = {};
const DataTableCrud = (res) => {
  /**----------------all useState----------------------- */
  
  const [loading, setLoading] = useState(true), //جاري التحميل للجدول الرئيسي و احصائيات المدارس
    [data, setdata] = useState([...res.data]), //قائمة الدوائر بالولاية
    [listMoassat, setListMoassat] = useState([]), //قائمة المؤسسات المعنية بالحركة
    [selectedMoassa, setSelectedMoassa] = useState([]), //المؤسسات التي تم تحديدها للحذف
    [globalFilter, setGlobalFilter] = useState(null), //الكلمة التي سيتم البحث عنها في الجدول
    [inputValueDaira, setInputValueDaira] = useState(""), //ادخال اسم الدائرة
    [inputValueMoassa, setInputValueMoassa] = useState(""), //ادخال اسم المؤسسة
    [gobalOptions, setGobalOptions] = useState([]), //اختيارات المؤسسات التابعة للدائرة
    [open, setOpen] = useState(false), //فتح النافذة المنبثقة لإضافة مدرسة في جدول الحركة
    [spinnersLoding, setSpinnersLoding] = useState(false), //سبينر في انتظار رد السرفر على طلب اضافة مدرسة
    [editingRows, setEditingRows] = useState({}); //تعديل الداتا في صف معين من الجدول
    const [year, setYear] = useState(new Date().getFullYear())
    /**----------------all useState----------------------- */
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  /************************getMoassat********************************* */
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

  const putData = (method, url, values,query='') => {
    const response = axios({
      method: method,
      url: url+'?Year='+query,
      data: values
      
          
        
      
    });

    return response;
  };
  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************end */

  const onSelected = (e) => {
    setSelectedMoassa(e.value);
  };

  const dt = useRef(null);

  useEffect(() => {
    fetcher("api/schools",{ Year: new Date().getFullYear() }).then((res) => {
      setListMoassat(res);
      setLoading(false);
    });
  }, []);
  /*******************ازالة مؤسسة من القائمة**********start******** */
const [Message, setMessage] = useState(false)
  const deleteProduct = (rowData,e,t) => {
    console.log(rowData,e,t);
    setSpinnersLoding(true);
    putData("put", "/api/delete", rowData,year)
      .then((response) => {
        setSpinnersLoding(false);

        const newlistMoassat = listMoassat.filter(
          (element) => ![rowData].includes(element)
        );
        setListMoassat(newlistMoassat);
        openToastSuccess(response.data.message)
          

        //alert(response.data.message);
      })
      .catch((err) => {
        fetcher("api/schools").then((res) => {
          setListMoassat(res);
          setSpinnersLoding(false);
        });
        if (err.response) {
          
          alert(err.response.data.message || err.response.data);
          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          
          // client never received a response, or request never left
        } else {
          // anything else
        }
      });

    //setConfirmDeleteDailog(rowData);
    //setDeleteProductDialog(true);
  };
  /*******************ازالة مؤسسة من القائمة**********end******** */

  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------بداية----- */

  const getValueDaira = (event, newInputValue) => {
    setInputValueDaira(newInputValue);

    if (data.includes(newInputValue)) {
      if (!gobalOptions[newInputValue]) {
        fetcher(`/api/hello`, { daira_name: newInputValue }) //طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية
          .then(function (response) {
            setGobalOptions((prev) => {
              return {
                ...prev,
                [newInputValue]: prev[response.daira_name]
                  ? { ...prev[response.daira_name] }
                  : response,
              };
            });
          });
      }
    }
  };
  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------نهاية------ */

  const getValueMoassa = (event, newInputValue) => {
    setInputValueMoassa(newInputValue);
  };

  /************start**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  /************end**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  const handleDeleteSelected = () => {
    setSpinnersLoding(true);
    let newlistMoassat = listMoassat.filter(
      (val) => !selectedMoassa.includes(val)
    );

    let _listMoassat = listMoassat
      .filter((val) => selectedMoassa.includes(val))
      .map((ele) => ele.moassa.EtabMatricule);
    putData("put", "/api/deletMany", { arrayEtabMatricule: _listMoassat },year)
      .then((response) => {
        
        setSpinnersLoding(false);
        setSelectedMoassa([]);
        setListMoassat(newlistMoassat);

        
        openToastSuccess(response.data.message)
        //alert(response.data.message);
      })
      .catch((err) => {
        fetcher("api/schools").then((res) => {
          setListMoassat(res);
          setSpinnersLoding(false);
        });
        if (err.response) {
          openToastSuccess(response.data.message)
          alert(err.response.data.message || err.response.data);
          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          console.log(err.request,"https://action-six.vercel.app/");
          // client never received a response, or request never left
        } else {
          // anything else
        }
      });
  };
  /**-******************************************Submit************************************************************** */

  const handelSubmit = async (values) => {
    const isInlistMoassat = listMoassat.findIndex(
      (ele) => ele.moassa.EtabMatricule == values.moassa.EtabMatricule
    );
    
    if (isInlistMoassat < 0) {
      setSpinnersLoding(true);
      
      putData("post","/api/postdata", values,year)
        .then((response) => {
          
          setSpinnersLoding(false);
          //alert(response.data);
          openToastSuccess(response.data.message)
          
          setListMoassat((prev) => {
            return [...prev, values];
          });
        })
        .catch((err) => {
          setSpinnersLoding(false);
          if (err.response) {
            
            alert(err.response.data.message || err.response.data);
            // client received an error response (5xx, 4xx)
          } else if (err.request) {
            
            // client never received a response, or request never left
          } else {
            // anything else
          }
        });
    } else {
      alert("موجود بالفعل");
    }
    // else {
    //   postData("/api/postdata",values)
    //     .then((response) => {
    //       alert(response.data);
    //       setListMoassat([values]);
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     });
    // }

    // const test =  listMoassat&&listMoassat.map((word) => {
    //      return word.moassa === values.moassa?[...prev,values]:[...prev,values]})
  };
  /**********************indexOfValueInDataList************************ */
  const indexOfValue = (value) =>
    listMoassat.findIndex(
      (x) => x.moassa.EtabMatricule === value.moassa.EtabMatricule
    );
  const indexOfValueInDataList = (data, props) => {
    return <div>{indexOfValue(data) + 1}</div>;
  };
  /**********************indexOfValueInDataList************************ */
  /********************edit Rows**************************** */
  const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
  };

  const onRowEditChange = (event) => {
    setEditingRows(event.data);
  };
  const onRowEditInit = (event) => {
    

    originalRows[indexOfValue(event.data)] = {
      ...listMoassat[indexOfValue(event.data)],
    };
  };
 
  const onRowEditCancel = (event) => {
    let _listMoassat = [...listMoassat];
    _listMoassat[indexOfValue(event.data)] =
      originalRows[indexOfValue(event.data)];
    delete originalRows[indexOfValue(event.data)];

    setListMoassat(_listMoassat);
  };

  const onRowEditSave = (event) => {
    setSpinnersLoding(true);
    putData("put", "/api/update", event.data,year)
      .then((response) => {
        
        setSpinnersLoding(false);
        openToastSuccess(response.data.message)
        //alert(response.data);
      })
      .catch((err) => {
        setSpinnersLoding(false);
        if (err.response) {
          if (err.response.data.name === "ValidationError") {
            let _listMoassat = [...listMoassat];
            _listMoassat[indexOfValue(event.data)] =
              originalRows[indexOfValue(event.data)];
            delete originalRows[indexOfValue(event.data)];

            setListMoassat(_listMoassat);
            
            alert(err.response.data.errors[0]);
          } else {
            alert(err.response.data);
            
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
    let updatedlistMoassat = [...listMoassat];

    props.rowData[props.field] = value;
    updatedlistMoassat[indexOfValue(props.rowData)][props.field] = value;
    console.log(props.rowData.moassa.EtabMatricule);
    //console.log(props,value,updatedlistMoassat[props.rowIndex][props.field],isEqual(props.rowData,originalRows[props.rowIndex]));
    setListMoassat(updatedlistMoassat);
  };

  const inputTextEditor = (props) => {
    return (
      <TextField
        label={props.header}
        value={props.rowData[props.field]}
        onChange={(e) => onEditorValueChange(props, +e.target.value)}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: Controls.NumberFormatCustom,
        }}
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
              <ThemeProvider theme={themebutton}>
                <MyButton
                  variant="outlined"
                  color="secondary"
                  aria-label="move back"
                  onClick={onRowEditInitconsol}
                >
                  <ClearTwoToneIcon />
                </MyButton>
              </ThemeProvider>
            </Grid>
            <Grid item xs={6}>
              <MyButton
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
              </MyButton>
            </Grid>
          </Grid>
        </>
      );
    }
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={6}>
          <MyButton
            variant="outlined"
            color="primary"
            aria-label="information update "
            onClick={onRowEditInitCh}
          >
            <EditTwoToneIcon />
          </MyButton>
        </Grid>
        <Grid item xs={6}>
          <ThemeProvider theme={themebutton}>
            <AlertDialog rowData={rowData} onDeleteProduct={deleteProduct} message={Message} />
          </ThemeProvider>
        </Grid>
      </Grid>
    );
  };

  /*****************************رأس الجدول***************************** */
 const onYearPicker = (e) => {
   setYear(e)
  
   setLoading(true);
  fetcher(`api/schools`,{ Year: e }).then((res) => {
    setListMoassat(res);
    setSpinnersLoding(false)
    setLoading(false);
  });
    console.log(e)
  }
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
            <ThemeProvider theme={themebutton}>
              <MyButton
                variant="outlined"
                color="secondary"
                onClick={handleDeleteSelected}
                disabled={selectedMoassa.length === 0 ? true : false}
                startIcon={<DeleteTwoToneIcon />}
              >
                حذف من القائمة
              </MyButton>
            </ThemeProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            
            <MyButton
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<AddTwoToneIcon />}
            >
              أضف الى القائمة
            </MyButton>
          </Grid>
         
        </Grid>
        <Grid item container xs={12} sm={6} md={3} lg={3} spacing={1}>
          <Grid item xs={6}>
            <ThemeProvider theme={themebutton}>
              <MyButton
                variant="outlined"
                color="secondary"
                //onClick={}
                disabled={listMoassat.length === 0 ? true : false}
                startIcon={<CloudUploadTwoToneIcon />}
              >
                تصدير
              </MyButton>
            </ThemeProvider>
          </Grid>
          <Grid item xs={6}>
            <MyButton
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<CloudDownloadTwoToneIcon />}
            >
              إستراد
            </MyButton>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}md={4} lg={2}>
            <DateP onChange={onYearPicker}/>
            
          </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="بحــث"
            variant="outlined"
            color="primary"
            style={{ backgroundColor: "#fff" }}
            id="standard-start-adornment"
            
            onInput={(e) => setGlobalFilter(e.target.value)}
            //className={clsx(classes.margin, classes.textField)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="search ">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  );

 
  /****************************body App*************************** */
  
  return (
    <>
      {" "}
     
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
       
        <ThemeProvider theme={spinners}>
          <DialogMui open={spinnersLoding}>
            <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
          </DialogMui>
        </ThemeProvider>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={9}>
            <Paper elevation={3} style={{ padding: 10 }}>
              <Typography variant="h4" component="h1" align="center">
                جدول الحركة التنقلية للموسم 2021/2022
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
                          InputProps={{
                            inputComponent: Controls.NumberFormatCustom,
                          }}

                          // InputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                      </Grid>

                      {/* <div className="p-field">
                  <Virtualize data={data} onChange={getDaira} />
                </div> */}

                      <Grid item xs={12}>
                        <AutocompleteMui
                          name="daira"
                          label="الدائرة"
                          inputValue={inputValueDaira}
                          onInputChange={getValueDaira}
                          options={data}
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
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <ThemeProvider theme={themebutton}>
                      <MyButton
                        onClick={handleClose}
                        color="secondary"
                        size="large"
                        variant="outlined"
                        startIcon={<ClearTwoToneIcon />}
                      >
                        الغاء
                      </MyButton>
                    </ThemeProvider>

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

        <Static data={listMoassat} loading={loading} />
        <DataTable
          ref={dt}
          value={listMoassat || []}
          selectionMode="checkbox"
          selection={selectedMoassa}
          onSelectionChange={onSelected}
          dataKey="moassa.EtabMatricule"
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
          loading={loading}
          scrollable
          scrollHeight="500px"
          frozenWidth="190px"
        >
          <Column
            columnKey="multiple"
            selectionMode="multiple"
            style={{ width: 50 }}
            frozen
          ></Column>
          <Column
            columnKey="index"
            field="index"
            header="الرقم"
            body={indexOfValueInDataList}
            headerStyle={{ width: 40, padding: 0 }}
            style={{}}
            frozen
          ></Column>
          <Column
            columnKey="moassa.EtabNom"
            field="moassa.EtabNom"
            header="المؤسسة"
            sortable
            style={{ width: 300 }}
            body={replaceStrIcon}
          ></Column>

          <Column
            columnKey="daira"
            field="daira"
            header="الدائرة"
            headerStyle={{ width: 100, padding: 7 }}
            style={{ padding: 7, height: 81 }}
            sortable
            frozen
          ></Column>

          <Column
            columnKey="moassa.bladia"
            field="moassa.bladia"
            header="البلدية"
            sortable
            headerStyle={{ width: 100, padding: 7 }}
          ></Column>
          {/* <Column
            field="moassa.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column> */}
          <Column
            columnKey="potentialVacancy"
            field="potentialVacancy"
            header="محتمل الشغور"
            editor={inputTextEditor}
            headerStyle={{ width: 120, padding: 7 }}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            columnKey="forced"
            field="forced"
            header="مجبر"
            sortable
            editor={inputTextEditor}
            headerStyle={{ width: 120 }}
          >
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column
            columnKey="vacancy"
            field="vacancy"
            header="شاغر"
            sortable
            headerStyle={{ width: 120 }}
            editor={inputTextEditor}
          ></Column>
          <Column
            columnKey="surplus"
            field="surplus"
            header="فائض"
            sortable
            headerStyle={{ width: 120 }}
            editor={inputTextEditor}
          >
            {/*body={ratingBodyTemplate}*/}
          </Column>

          <Column
            columnKey="actionBodyTemplate1"
            rowEditor
            bodyStyle={{ textAlign: "center", height: 81 }}
            body={actionBodyTemplate1}
            headerStyle={{ width: 170 }}
          >
            {/**/}
          </Column>
        </DataTable>
      </Container>
    </>
  );
};

export async function getServerSideProps() {
  const urlBass = await process.env.URL_BASE;
  
  const res = await fetch(`${urlBass}api/hello`);
  const data = await res.json();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
export default DataTableCrud;
