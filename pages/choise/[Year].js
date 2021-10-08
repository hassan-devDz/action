import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";

import CloudUploadTwoToneIcon from "@material-ui/icons/CloudUploadTwoTone";

import AddTwoToneIcon from "@material-ui/icons/AddTwoTone";

import AutocompleteMui from "../../Components/Autocmplemoassat";
import Controls from "../../Components/FormsUi/Control";
import ButtonWrapper from "../../Components/FormsUi/Button/ButtonNorm";
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

import AlertDialog from "../../Components/Notification/ConfiremDeleteDialog";
import DialogOrderOfDesires from '../../Components/Desires/OrderOfDesires';
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../../Components/Notification/Alert";
import { moassaSchema } from "../../schemas/schemas_moassa";
import Router, { useRouter } from "next/router";
import replaceStrIcon from "../../Components/IconReplaceTxt/IconRepTxt";
import DateP from "../../Components/date";
import TransferList from "../../Components/TransferList/indexTransfert.js";
import Drogble from "../../Components/TransferList/drag";
const MyButton = styled(ButtonWrapper)({
  minWidth: 40,
  padding: "5px 6px",
});

function PaperComponent() {
  return (
    <Draggable
      handle="#form-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const DataTableCrud2 = (props) => {
  console.log(props);
  /**----------------all useState----------------------- */
  const rouet = useRouter();
  console.log(rouet.query);
  const [loading, setLoading] = useState(true), //جاري التحميل للجدول الرئيسي و احصائيات المدارس
    [listMoassat, setListMoassat] = useState([]), //قائمة المؤسسات المعنية بالحركة
    [selectedMoassa, setSelectedMoassa] = useState([]), //المؤسسات التي تم تحديدها للحذف
    [globalFilter, setGlobalFilter] = useState(null), //الكلمة التي سيتم البحث عنها في الجدول
    [spinnersLoding, setSpinnersLoding] = useState(false); //سبينر في انتظار رد السرفر على طلب اضافة مدرسة

  const [year, setYear] = useState(new Date().getFullYear());
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

  const putData = (method, url, values, query = "") => {
    const response = axios({
      method: method,
      url: url + "?Year=" + query,
      data: values,
    });

    return response;
  };
  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************end */
  const results = (arr1, arr2) => {
    return arr1.filter(
      ({ moassa: id1 }) =>
        !arr2.some(({ moassa: id2 }) => id2.EtabMatricule === id1.EtabMatricule)
    )[0].moassa.EtabNom;
  };
  const onSelected = (e, d) => {
    if (e.value.length > selectedMoassa.length) {
      openToastSuccess(`تمت اضافة ${results(e.value, selectedMoassa)}`);
    }
    if (e.value.length < selectedMoassa.length) {
      openToastError(`تمت حذف ${results(selectedMoassa, e.value)}`);
    }
    if (
      e.value.length > 0 &&
      e.value[e.value.length - 1].forced === 0 &&
      e.value[e.value.length - 1].potentialVacancy === 0 &&
      e.value[e.value.length - 1].vacancy === 0 &&
      e.value[e.value.length - 1].surplus > 0
    ) {
      console.log(e.value[e.value.length - 1]);
      openToastError("لايمكن");
    }else{
       setSelectedMoassa(e.value);
    }
   

   
  };

  const dt = useRef(null);

  useEffect(() => {
    fetcher("../api/schools", rouet.query)
      .then((res) => {
        setListMoassat(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  /*******************ازالة مؤسسة من القائمة**********start******** */

  /*******************ازالة مؤسسة من القائمة**********end******** */

  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------بداية----- */

  /*------------------طلب قائمة المؤسسات من خلال اختيار الدائرة المعنية---------نهاية------ */

  /************start**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  /************end**********فتح واغلاق  نافذة اضافة مؤسسة و نافذة تأكيد الحذف*********** */

  /**-******************************************Submit************************************************************** */
  console.log(selectedMoassa);

  if (selectedMoassa.length > 5) {
    let _selectedMoassa = selectedMoassa.slice(0, 5);
    setSelectedMoassa(_selectedMoassa);
    openToastError("لايمكن");
  }

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

  /*****************************رأس الجدول***************************** */
  const onYearPicker = (e) => {
    setYear(e);
    setSelectedMoassa([]);
    setLoading(true);
    fetcher(`../api/schools`, { Year: e })
      .then((res) => {
        setListMoassat(res);
        setSpinnersLoding(false);
        setLoading(false);
      })
      .catch((err) => {
        rouet.push(`./${e}`);
        console.log(err);
      });
    console.log(e);
  };
  const [myChoise, setMyChoise] = useState(false)

  const headarTable = (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MyButton
            color="secondary"
            disabled={selectedMoassa == false}
            onClick={(e) => setSelectedMoassa([])}
          >
            إعادة اختيار
          </MyButton>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MyButton
            color="secondary"
            
            onClick={(e) => setMyChoise(!myChoise)}
          >
            {!myChoise?"مشاهدة اختياراتي":"مشاهدة الكل"}
          </MyButton>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DialogOrderOfDesires selectedMoassa={selectedMoassa}></DialogOrderOfDesires>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DateP onChange={onYearPicker} />
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
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
const DailogMui1 = () => {
  
  return ( 
    <DialogMui
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{"رتب رغباتك عن طريق السحب والافلات "}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
      <Drogble selectedMoassa={selectedMoassa} />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <MyButton onClick={handleClose} color="primary">
        Disagree
      </MyButton>
      <MyButton onClick={handleClose} color="primary" autoFocus>
        Agree
      </MyButton>
    </DialogActions>
  </DialogMui>
   );
}
 

  /****************************body App*************************** */
  // const static = listMoassat.map((x)=>{

  // })
  return (
    <>
      {" "}
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
        {/* <TransferList selectedMoassa={selectedMoassa}></TransferList> */}

        <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
        </Backdrop>

        <DataTable
          ref={dt}
          value={myChoise?selectedMoassa:listMoassat || []}
          selectionMode="checkbox"
          selection={selectedMoassa}
          onSelectionChange={onSelected}
         
          
          dataKey="moassa.EtabMatricule"
          emptyMessage={myChoise?"لم تختر أي مؤسسة بعد":"لا توجد بيانات لعرضها"}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="عرض {first} الى {last} من اصل {totalRecords}"
          globalFilter={globalFilter}
          header={headarTable}
          stripedRows
          removableSort
          loading={loading}
          scrollable
          scrollHeight="500px"
          frozenWidth="204px"
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
            headerStyle={{ width: 114 }}
            style={{ padding: 7, height: 81 }}
            sortable
            frozen
          ></Column>

          <Column
            columnKey="moassa.bladia"
            field="moassa.bladia"
            header="البلدية"
            sortable
            style={{ padding: 7, height: 81 }}
            headerStyle={{ width: 114, padding: 7 }}
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
            sortable
            headerStyle={{ width: 148, padding: 7 }}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            columnKey="forced"
            field="forced"
            header="مجبر"
            sortable
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
          ></Column>
          <Column
            columnKey="surplus"
            field="surplus"
            header="فائض"
            sortable
            headerStyle={{ width: 120 }}
          >
            {/*body={ratingBodyTemplate}*/}
          </Column>
        </DataTable>
       
      </Container>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const urlBass = await process.env.URL_BASE;

  const res = await fetch(`${urlBass}/api/schools?Year=${ctx.query.Year}`);

  if (res.status === 404) {
    return {
      notFound: true,
    };
  }

  const data = await res.json();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
export default DataTableCrud2;