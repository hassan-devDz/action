import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "@tamerhassan/primereact_test/datatable";
import { Column } from "@tamerhassan/primereact_test/column";
import CloudDownloadTwoToneIcon from '@material-ui/icons/CloudDownloadTwoTone';
import { Button } from "@tamerhassan/primereact_test/button";
import CloudUploadTwoToneIcon from '@material-ui/icons/CloudUploadTwoTone';
import { Rating } from "@tamerhassan/primereact_test/rating";
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import { InputText } from "@tamerhassan/primereact_test/inputtext";
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import AutocompleteMui from "../Components/Autocmplemoassat";
import Controls from "../Components/FormsUi/Control";
import ButtonWrapper from '../Components/FormsUi/Button/buttonNorm';
import Typography from '@material-ui/core/Typography';
import { Container, Grid, Paper } from "@material-ui/core";
import ButtonMui from "@material-ui/core/Button";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import CheckTwoToneIcon from "@material-ui/icons/CheckTwoTone";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";

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


import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import SearchIcon from '@material-ui/icons/Search';
import Static from '../Components/static';

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
  direction:"rtl",
  palette: {
    secondary: {
      main: red.A400,
    },
  },
});
let originalRows = {};
let editorRow = {};
const INITIAL_FORM_STATE = {
  potentialVacancy: 0, //محتمل
  forced: 0, //مجبر
  vacancy: 0, //شاغر
  surplus: 0, //فائض
  moassa: [{ EtabMatricule: null, EtabNom: null, bladia: null }],
  daira: null,
};
const FORM_VALIDATION = Yup.object().shape({
  potentialVacancy: Yup.number().integer().required("حقل الزامي"),
  forced: Yup.number().integer().required("حقل الزامي"),
  vacancy: Yup.number().integer().required("حقل الزامي"),
  surplus: Yup.number().integer().required("حقل الزامي"),
  moassa: Yup.object({
    EtabMatricule: Yup.number().positive().required("حقل الزامي"),
    EtabNom: Yup.string().required("حقل الزامي"),
    bladia: Yup.string().required("حقل الزامي"),
  })
    .nullable()
    .required("حقل الزامي"),
  daira: Yup.string().required("حقل الزامي").nullable(),
});
const DataTableCrud = (res) => {
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
  const postData = async (values) => {
    const res = await axios.post(`/api/postdata`, values);
    console.log(res.data);
    return res;
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
    console.log(e,selectedMoassa);
    setSelectedMoassa(e.value)
  }

  const [globalFilter, setGlobalFilter] = useState(null);

  const dt = useRef(null);

  useEffect(() => {
    fetcher("api/schools").then((res) => {
      
      if (res.length) {
        setProducts(res);
        setLoading(false)
      }
    });
  }, []);
  /*******************EitMoassa********************* */
  const [editMoassa, setEitMoassa] = useState({});

  console.log(editMoassa);
  const confirmDeleteProduct = (product) => {
    setEitMoassa(product);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**-******************************************Submit************************************************************** */

  const handelSubmit = async (values) => {
    const isInProducts = products.findIndex(
      (ele) => ele.moassa.EtabMatricule === values.moassa.EtabMatricule
    );

    if (products.length > 0 && isInProducts < 0) {
      postData(values)
        .then((e) => {
          alert(e.data);
          setProducts((prev) => {
            return [...prev, values];
          });
        })
        .catch((error) => {
          alert(error);
        });
    } else if (isInProducts >= 0) {
      alert("موجود بالفعل");
    } else {
      postData(values)
        .then((e) => {
          alert(e.data);
          setProducts([values]);
        })
        .catch((error) => {
          alert(error);
        });
    }

    // const test =  products&&products.map((word) => {
    //      return word.moassa === values.moassa?[...prev,values]:[...prev,values]})
  };
  /**********************indexOfValueInDataList************************ */

  const indexOfValueInDataList = (data, props) => {
    const indexOfValue = products.findIndex(
      (x) => x.moassa.EtabMatricule === props.rowData.moassa.EtabMatricule
    );
    return <div>{indexOfValue + 1}</div>;
  };
  /**********************indexOfValueInDataList************************ */
  /********************edit Rows**************************** */

  const onRowEditInit = (event) => {
    originalRows[event.index] = { ...products[event.index] };
  };

  const onRowEditCancel = (event) => {
    let _products = [...products];
    _products[event.index] = originalRows[event.index];
    delete originalRows[event.index];

    setProducts(_products);
  };

  const onRowEditSave = (props) => {
    console.log(props, originalRows);
  };
  const onEditorValueChange = (props, value) => {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;

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

  const actionBodyTemplate1 = (rowData, props) => {
    const it = props.rowEditor.onInitClick;
    
    const onRowEditInitCh = (e) => {
      console.log(e, rowData, props.rowIndex, props.editing);

      it(e);
    };
    const con = props.rowEditor.onCancelClick;

    const onRowEditInitconsol = (e) => {
      console.log(e, rowData, props.rowIndex, props.editing);
      props.rowEditor.saveIconClassName = "datatable-crud";

      con(e);
    };
    const sav = props.rowEditor.onSaveClick;
    const onRowEditInitSave = (e) => {
      sav(e);
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
      </MyButton></Grid>
      <Grid item xs={6}>
      <ThemeProvider theme={themebutton}>
      <MyButton
        variant="outlined"
        color="secondary"
        aria-label="information update "
        onClick={() => confirmDeleteProduct(rowData)}
      >
        <DeleteTwoToneIcon />
      </MyButton></ThemeProvider></Grid></Grid>
    );
  };
  /********************************************************** */
  
  const taxtSearch = (
    <>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item container xs={12} sm={12} md={5} lg={3}   spacing={1}>
          <Grid item xs={12}sm={6}>
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
          <Grid item xs={12}sm={6}>
            <MyButton
           
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<AddTwoToneIcon/>}
            >
              أضف الى القائمة
            </MyButton>
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={6} md={3} lg={2} spacing={1}>
          <Grid item xs={6}>
            <ThemeProvider theme={themebutton}>
              <MyButton
             
                variant="outlined"
                color="secondary"
                //onClick={}
                disabled={products.length === 0 ? true : false}
                startIcon={<CloudUploadTwoToneIcon/>}
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
              startIcon={<CloudDownloadTwoToneIcon/>}
            >
               إستراد 
            </MyButton>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <TextField
           
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
const replaceStrIcon = (rowData,parms) => {
  const name = rowData.moassa.EtabNom.replace('المدرسة الابتدائية', '')
  return ( 
    <>
    <Tooltip title={name} placement="top">
    <span style={{display:"flex",gap:12}}><SchoolTwoToneIcon color="primary"/>{name}</span>
    </Tooltip></>
   );
}
 

  return (
    
     <> <Container maxWidth="xl" style={{ marginBottom: 2,marginTop: 12 }}>
       
       <Grid container spacing={2} justifyContent='center'>
         <Grid item xs={12} sm={9}>
      <Paper elevation={3} style={{padding:10}}>
      <Typography variant="h4" component="h1"  align="center">
    الجمهورية الجزائري
      </Typography>
      <Typography variant="h4" component="h1"  align="center">
       جدول الحركة التنقلية للموسم 2021/2022
      </Typography></Paper></Grid>
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
                        To subscribe to this website, please enter your email
                        address here. We will send updates occasionally.
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
                        options={gobalOptions[inputValueDaira]?.moassata || []}
                        getOptionLabel={(option) => {
                          return option.EtabNom || "";
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <ButtonMui
                    onClick={handleClose}
                    color="primary"
                    size="large"
                    variant="contained"
                  >
                    الغاء
                  </ButtonMui>

                  <Controls.Button color="primary">حفظ</Controls.Button>
                </DialogActions>
              </Form>
            </Formik>
          </DialogMui></Grid>
       </Grid> 
      
      {/* <Toast ref={toast} /> */}

      <Static data={products}/>
        <DataTable
          ref={dt}
          value={products || []}
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
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={taxtSearch}
          stripedRows
          removableSort
          loading={loading}
          scrollable scrollHeight="500px" frozenWidth="190px"
        >
          <Column selectionMode="multiple" style={{width:50}} frozen></Column><Column
            field="index"
            header="الرقم"
            body={indexOfValueInDataList}
            headerStyle={{width:40,padding:0}}
            style={{}}
            frozen
          ></Column>          
          <Column field="moassa.EtabNom" header="المؤسسة" sortable style={{width:240}} body={replaceStrIcon} ></Column>

          <Column field="daira" header="الدائرة" headerStyle={{width:100,padding:7}} style={{padding:7,height:81}} sortable frozen></Column>
          

          <Column field="moassa.bladia" header="البلدية" sortable  headerStyle={{width:100,padding:7}}></Column>
          {/* <Column
            field="moassa.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column> */}
          <Column
            field="potentialVacancy"
            header="محتمل الشغور"
            editor={inputTextEditor}
            headerStyle={{width:120,padding:7}}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            field="forced"
            header="مجبر"
            sortable
            editor={inputTextEditor}
            headerStyle={{width:120}}
          >
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column field="vacancy" header="شاغر" sortable headerStyle={{width:120}}editor={inputTextEditor}></Column>
          <Column field="surplus" header="فائض" sortable headerStyle={{width:120}}editor={inputTextEditor}>
            {/*body={ratingBodyTemplate}*/}
          </Column>

        
          <Column
            rowEditor
            headerStyle={{ width: "7rem" }}
            bodyStyle={{ textAlign: "center", height: 81 }}
            body={actionBodyTemplate1}
            headerStyle={{width:170}}
          >
            {/**/}
          </Column>
        </DataTable></Container>
      
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
