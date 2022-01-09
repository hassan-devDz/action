import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "hassanreact/datatable";
import { Column } from "hassanreact/column";

import { ButtonWrapper } from "../../Components/FormsUi/Button/ButtonNorm";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  FormControl,
  Grid,
  OutlinedInput,
  Paper,
  InputLabel,
} from "@material-ui/core";
import {
  subjects,
  getKeyByValue,
  loop,
  loopforUser,
} from "../../middleware/StudySubjects";
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

import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";
import Draggable from "react-draggable";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { styled, withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import IntegrationNotistack from "../../Components/Notification/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SearchIcon from "@material-ui/icons/Search";
import { withSnackbar } from "notistack";
import Static from "../../Components/static";
import FormInfoInterested from "../../Components/Desires/FormInfoInterested";
import AlertDialog from "../../Components/Notification/ConfiremDeleteDialog";
import DialogOrderOfDesires from "../../Components/Desires/OrderOfDesires";
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../../Components/Notification/Alert";

import Router, { useRouter } from "next/router";
import replaceStrIcon from "../../Components/IconReplaceTxt/IconRepTxt";

const choiseScools = ({ newStructureData }) => {
  console.log(newStructureData);

  /**----------------all useState----------------------- */
  const rouet = useRouter();
  console.log(rouet.query);
  const [loading, setLoading] = useState(true), //جاري التحميل للجدول الرئيسي و احصائيات المدارس
    [listMoassat, setListMoassat] = useState(newStructureData), //قائمة المؤسسات المعنية بالحركة
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
      url: url + "?year=" + query,
      data: values,
    });

    return response;
  };
  /********************* طلب تعديل أو حذف مؤسسة من الجدول *********************end */
  const results = (arr1, arr2) => {
    //دالة للمقارنة بين المصفوفة الجديدة والقديمة واظهار الادخال في تنبيه
    const newMoassa = arr1.filter(
      (idArr1) => !arr2.some((idArr2) => idArr2.id === idArr1.id)
    );

    return newMoassa[0].workSchool.EtabNom;
  };

  const onSelected = (e, d) => {
    /********************استبعاد الفائض************** */
    console.log(e.value[e.value.length - 1], e.value);
    let arr = [];
    e.value.map((elm, i) => {
      if (
        elm.forced === 0 &&
        elm.potentialVacancy === 0 &&
        elm.vacancy === 0 &&
        elm.surplus > 0
      ) {
        openToastError(
          `لايمكن إختيار ${elm.workSchool.EtabNom} لعدم وجود منصب`
        );
      } else {
        arr.push(elm);
      }
    });
    setSelectedMoassa(arr);
  };
  const onRowSelect = (event) => {
    console.log(event);
    openToastSuccess(`تمت اضافة ${event.data.workSchool.EtabNom}`);
  };

  const onRowUnselect = (event) => {
    openToastError(`تمت حذف ${event.data.workSchool.EtabNom}`);
  };
  if (selectedMoassa.length > 5) {
    let _selectedMoassa = selectedMoassa.slice(0, 5);
    setSelectedMoassa(_selectedMoassa);
    openToastError("الحد الأقصى للرغبات هو 5");
  }
  const dt = useRef(null);

  useEffect(() => {
    fetcher("../api/getListMoassatForUser")
      .then((res) => {
        setListMoassat(loopforUser(res));
        setLoading(false);
        console.log(res);
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

  /**********************indexOfValueInDataList************************ */
  const indexOfValue = (value) =>
    listMoassat.findIndex((x) => x.id === value.id);

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
    fetcher(`../api/schools`, { year: e })
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
  const [myChoise, setMyChoise] = useState(false);

  const headarTable = (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography
            variant="h4"
            component="h3"
            style={{ textAlign: "center", fontWeight: 700 }}
          >
            إختـــر الرغبـــات
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ButtonWrapper
              color="secondary"
              disabled={selectedMoassa == false}
              onClick={(e) => setSelectedMoassa([])}
              startIcon={<AutorenewIcon />}
            >
              إعادة اختيار
            </ButtonWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <ButtonWrapper
              color="secondary"
              onClick={(e) => setMyChoise(!myChoise)}
              startIcon={<VisibilityIcon />}
            >
              {!myChoise ? "مشاهدة اختياراتي" : "مشاهدة الكل"}
            </ButtonWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DialogOrderOfDesires
              selectedMoassa={selectedMoassa} //ترتيب الاختيارات
            ></DialogOrderOfDesires>
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
            {/* <TextField
            fullWidth
            label="بحــث"
            variant="outlined"
            color="secondary"
            style={{ backgroundColor: "#fff" }}
            id="start-adornment"
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
          /> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

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
          value={myChoise ? selectedMoassa : listMoassat || []}
          selectionMode="checkbox"
          selection={selectedMoassa}
          onSelectionChange={onSelected}
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          dataKey="id"
          emptyMessage={
            myChoise ? "لم تختر أي مؤسسة بعد" : "لا توجد بيانات لعرضها"
          }
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
            headerStyle={{ width: 40, padding: "0" }}
            style={{ width: 50 }}
            frozen
          ></Column>
          <Column
            columnKey="index"
            field="index"
            header="الرقم"
            body={indexOfValueInDataList}
            headerStyle={{ width: 40, padding: 0 }}
            frozen
          ></Column>
          <Column
            columnKey="workSchool.EtabNom"
            field="workSchool.EtabNom"
            header="المؤسسة"
            sortable
            style={{ width: 300, padding: 7 }}
            body={replaceStrIcon}
          ></Column>
          <Column
            columnKey="educationalPhase"
            field="educationalPhase"
            header="الطور"
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          <Column
            columnKey="specialty"
            field="specialty"
            header="مادة التدريس"
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />

          <Column
            columnKey="baldia.valeur"
            field="baldia.valeur"
            header="البلدية"
            sortable
            frozen
            style={{ padding: 7, height: 81 }}
            headerStyle={{ width: 114, padding: 7 }}
          ></Column>
          {/* <Column
            field="workSchool.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column> */}
          <Column
            columnKey="potentialVacancy"
            field="potentialVacancy"
            header="محتمل الشغور"
            sortable
            headerStyle={{ width: 148, padding: 7 }}
            style={{ padding: 7, height: 81 }}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            columnKey="forced"
            field="forced"
            header="مجبر"
            sortable
            headerStyle={{ width: 120, padding: 7 }}
          >
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column
            columnKey="vacancy"
            field="vacancy"
            header="شاغر"
            sortable
            headerStyle={{ width: 120, padding: 7 }}
          ></Column>
          <Column
            columnKey="surplus"
            field="surplus"
            header="فائض"
            sortable
            headerStyle={{ width: 120, padding: 7 }}
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
  const query = new URLSearchParams(ctx.query).toString();
  const cookie = await ctx.req?.headers.cookie;
  const res = await fetch(`${urlBass}/api/getListMoassatForUser`, {
    headers: {
      cookie: cookie,
    },
  });

  if (!res.ok) {
    return {
      notFound: true,
    };
  }
  console.log(res);
  const data = await res.json();
  console.log(data, "rrrrrrrrrrrrrrr");
  const newStructureData = data.citys ? loopforUser(data) : data;

  return {
    props: { newStructureData }, // will be passed to the page component as props
  };
}
choiseScools.auth = true;
export default choiseScools;
