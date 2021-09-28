import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";
import { Button } from "hassanreact/button";
import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";
import { Rating } from "hassanreact/rating";
import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";
import Tooltip from "@material-ui/core/Tooltip";
import { InputText } from "hassanreact/inputtext";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";
import AutocompleteMui from "../Components/Autocmplemoassat";
import Controls from "../Components/FormsUi/Control";
import ButtonWrapper from "../Components/FormsUi/Button/buttonNorm";
import Typography from "@material-ui/core/Typography";
import { Container, Grid, Paper } from "@material-ui/core";
import ButtonMui from "@material-ui/core/Button";
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
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import * as Yup from "yup";
import axios from "axios";
import Draggable from "react-draggable";

import { styled } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";

import SearchIcon from "@material-ui/icons/Search";
import Static from "../Components/static";
import useStyles from "../Components/FormsUi/StyleForm";
import AlertDialog from '../Components/Notification/ConfiremDeleteDialog';
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
});
let arr=[]
arr[24]='none'
const spinners = createTheme({
  direction: "rtl",
  palette: {
    background: {
      paper: 'transparent',
    },
  },
  shadows: 
  arr
  
  
});
let editorRow = {};
const INITIAL_FORM_STATE = {
  potentialVacancy: 0, //محتمل
  forced: 0, //مجبر
  vacancy: 0, //شاغر
  surplus: 0, //فائض
  moassa: [{ EtabMatricule: null, EtabNom: null, bladia: null }],
  daira: null,
};

const isNotEquZero = ["vacancy", "surplus"];
const FORM_VALIDATION = Yup.object().shape(
  {
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
      EtabMatricule: Yup.number().positive().required("حقل الزامي"),
      EtabNom: Yup.string().required("حقل الزامي"),
      bladia: Yup.string().required("حقل الزامي"),
    })
      .nullable()
      .required("حقل الزامي"),
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
let originalRows = {};
const DataTableCrud = (res) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [data, setdata] = useState([...res.data]);
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
  // const fetcher = async url => {
  //   const res = await fetch(url)

  //   // If the status code is not in the range 200-299,
  //   // we still try to parse and throw it.
  //   if (!res.ok) {
  //     const error = new Error('An error occurred while fetching the data.')
  //     // Attach extra info to the error object.
  //     error.info = await res.json()
  //     error.status = res.status
  //     throw error
  //   }

  //   return res.json()
  // }

  // // ...
  // const { data, error } = useSWR('/api/user', fetcher)
  const postData =  (url,values) => {
    
   const response =  axios.post(url, values)
    console.log(values);
    return response;
  };
  const putData =  (method,url,values) => {
    const response = axios({
      method: method,
      url: url,
      data: values
    });
   
     
     return response;
   };

  const [fetcher1, setfetcher1] = useState({});

  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  const [products, setProducts] = useState([]);

  const [selectedMoassa, setSelectedMoassa] = useState([]);
  const onSelected = (e) => {
    setSelectedMoassa(e.value);
  };

  const [globalFilter, setGlobalFilter] = useState(null);

  const dt = useRef(null);

  useEffect(() => {
    fetcher("api/schools").then((res) => {
      
        setProducts(res);
        setLoading(false);
      
    });
  }, []);
  /*******************EitMoassa********************* */
  const [confirmDeleteDailog, setConfirmDeleteDailog] = useState(false);

  const deleteProduct = (rowData) => {
  
    setSpinnersLoding(true)
    putData("put","/api/delete",rowData).then((response) => {
      setSpinnersLoding(false)
      const newProducts = products.filter((item) => item.moassa.EtabMatricule !== rowData.moassa.EtabMatricule);
        setProducts(newProducts);
        
    
      console.log(response);
     
        alert(response.data);
    
      
    })
    
   
    //setConfirmDeleteDailog(rowData);
    //setDeleteProductDialog(true);
  };

  /*--------------------start Dropdown---------------*/

  /*--------------------end Dropdown---------------*/
  /*----------------------getDairaè---------------------- */

  const [inputValueDaira, setInputValueDaira] = useState("");
  const [inputValueMoassa, setInputValueMoassa] = useState("");
  const [gobalOptions, setGobalOptions] = useState([]);

  const [disble, setDisble] = useState(true);

  const getValueDaira = (event, newInputValue) => {
    setInputValueDaira(newInputValue);
    setDisble(true);
    if (data.includes(newInputValue)) {
      if (!gobalOptions[newInputValue]) {
        fetcher(`/api/hello`, { daira_name: newInputValue })
          .then(function (response) {
            setGobalOptions((prev) => {
              return {
                ...prev,
                [newInputValue]: prev[response.daira_name]
                  ? { ...prev[response.daira_name] }
                  : response,
              };
            });
          })
          .then(function () {
            setDisble(false);
          });
      }
      if (gobalOptions[newInputValue]) {
        setDisble(false);
      }
    }
  };

  const getValueMoassa = (event, newInputValue, h) => {
    setInputValueMoassa(newInputValue);
  };

  /*****************************dialugMui*********** */
  const [open, setOpen] = useState(false);
  const [spinnersLoding, setSpinnersLoding] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**-******************************************Submit************************************************************** */

  const handelSubmit = async (values) => {
    const isInProducts = products.findIndex(
      (ele) => ele.moassa.EtabMatricule == values.moassa.EtabMatricule
    );
      console.log(isInProducts);
    if (isInProducts < 0) {
      // try {
      //   const res = await postData(values)
      //   console.log(res);
      //   if (res.ok) {
      //     const responseOk = await res.json()
      //     console.log(responseOk);
      //        alert(res.data)
      //    setProducts((prev) => {
      //     return [...prev, values];
      //   });
      //   }else{
      //     const error = await res.json();
      //   throw new Error(error.message)
      //   }

      // } catch (error) {
      //   console.error(error.message);
      //   alert(error);
      // }
      setSpinnersLoding(true)
      postData("/api/postdata",values)
        .then((response) => {
          console.log(response);
          setSpinnersLoding(false)
            alert(response.data);
          setProducts((prev) => {
            return [...prev, values];
          });
          
          
        })
        .catch((err) => {
          setSpinnersLoding(false)
          if (err.response) {
            console.log(err.response);
            alert(err.response.data.message||err.response.data);
            // client received an error response (5xx, 4xx)
          } else if (err.request) {
            console.log(err.request);
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
    //       setProducts([values]);
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     });
    // }

    // const test =  products&&products.map((word) => {
    //      return word.moassa === values.moassa?[...prev,values]:[...prev,values]})
  };
  /**********************indexOfValueInDataList************************ */
  const indexOfValue = (value) =>
    products.findIndex(
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
  
  
  
  
  const [editingRows, setEditingRows] = useState({});
  const onRowEditChange = (event) => {
    setEditingRows(event.data);
}
  const onRowEditInit = (event) => {
    console.log(event);
    
    
    
    originalRows[indexOfValue(event.data)] = {
      ...products[indexOfValue(event.data)],
    };
  };
console.log(editingRows);
  const onRowEditCancel = (event) => {
   
    
    
    let _products = [...products];
    _products[indexOfValue(event.data)] =
      originalRows[indexOfValue(event.data)];
    delete originalRows[indexOfValue(event.data)];

    setProducts(_products);
  };

  const onRowEditSave = (event) => {
    setSpinnersLoding(true)
   putData("put","/api/update",event.data).then((response) => {
    console.log(response);
    setSpinnersLoding(false)
      alert(response.data);
  
    
  })
  .catch((err) => {
    setSpinnersLoding(false)
    if (err.response) {  

      if (err.response.data.name==="ValidationError") {
            let _products = [...products];
    _products[indexOfValue(event.data)] =
      originalRows[indexOfValue(event.data)];
    delete originalRows[indexOfValue(event.data)];

    setProducts(_products);
      console.log(err.response);
      alert(err.response.data.errors[0]);
      }else{
        alert(err.response.data);
        console.log(err.response);
      }
      
      // client received an error response (5xx, 4xx)
    } else if (err.request) {
      console.log(err.request);
      // client never received a response, or request never left
    } else {
      // anything else

    }
  });
  };
  
  const onEditorValueChange = (props, value) => {
    
    
    let updatedProducts = [...products];

    props.rowData[props.field] = value;
    updatedProducts[indexOfValue(props.rowData)][props.field] = value;
    console.log(props.rowData.moassa.EtabMatricule);
    //console.log(props,value,updatedProducts[props.rowIndex][props.field],isEqual(props.rowData,originalRows[props.rowIndex]));
    setProducts(updatedProducts);
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
            <AlertDialog rowData={rowData} onDeleteProduct={deleteProduct}/>
          </ThemeProvider>
        </Grid>
      </Grid>
    );
  };
 
  /*****************************رأس الجدول***************************** */

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
                onClick={handleClickOpen}
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
                disabled={products.length === 0 ? true : false}
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="بحــث"
            variant="outlined"
            color="primary"
            style={{ backgroundColor: "#fff" }}
            id="standard-start-adornment"
            onChange={(e, d) => console.log(e, d)}
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

/**--------------------ايقونة المدرسة في الجدول------------------------- */
  const replaceStrIcon = (rowData, parms) => {
    const name = rowData.moassa.EtabNom.replace("المدرسة الابتدائية", "");
    return (
      <>
        <Tooltip title={name} placement="top">
          <span style={{ display: "flex", gap: 12 }}>
            <SchoolTwoToneIcon color="primary" />
            {name}
          </span>
        </Tooltip>
      </>
    );
  };
 /****************************start App*************************** */
  return (
    <>
      {" "}
      <AlertDialog/>
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
        <ThemeProvider theme={spinners}>
        <DialogMui
        open={spinnersLoding}
        
        >
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding}  size={50} />
        </DialogMui></ThemeProvider>
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
                validationSchema={FORM_VALIDATION}
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
                          disabled={disble}
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
                    <Paper className={classes.buttonPapersubmit}>
                      <ButtonMui
                        className={classes.submit}
                        onClick={handleClose}
                        color="primary"
                        size="large"
                        variant="contained"
                      >
                        الغاء
                      </ButtonMui>
                    </Paper>

                    <Controls.Button color="primary">حفظ</Controls.Button>
                  </DialogActions>
                </Form>
              </Formik>
            </DialogMui>
          </Grid>
        </Grid>

        {/* <Toast ref={toast} /> */}

        <Static data={products} loading={loading}/>
        <DataTable
          ref={dt}
          value={products || []}
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
            style={{ width: 240 }}
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
            headerStyle={{ width: "7rem" }}
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
  console.log(urlBass);
  const res = await fetch(`${urlBass}api/hello`);
  const data = await res.json();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
export default DataTableCrud;
