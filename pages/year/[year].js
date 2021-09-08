import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import { DataTable } from "primereact-test/datatable";
import { Column } from "primereact-test/column";

import { Button } from "primereact-test/button";

import { Rating } from "primereact-test/rating";

import { InputText } from "primereact-test/inputtext";

import AutocompleteMui from "../../Components/Autocmplemoassat";
import Controls from "../../Components/FormsUi/Control";

import { Container, Grid, Paper } from "@material-ui/core";
import ButtonMui from "@material-ui/core/Button";

import DialogMui from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";
import axios from "axios";
import Draggable from 'react-draggable';
import { useRouter } from "next/router";


function PaperComponent(props) {
  return (
    <Draggable handle="#form-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const INITIAL_FORM_STATE = {
  potential_vacancy: 0, //محتمل
  forced: 0, //مجبر
  vacancy: 0, //شاغر
  surplus: 0, //فائض
  moassa: [{ EtabMatricule: null, EtabNom: null, bladia: null }],
  daira: null,
};
const FORM_VALIDATION = Yup.object().shape({
  potential_vacancy: Yup.number().integer().required("حقل الزامي"),
  forced: Yup.number().integer().required("حقل الزامي"),
  vacancy: Yup.number().integer().required("حقل الزامي"),
  surplus: Yup.number().integer().required("حقل الزامي"),
  moassa: Yup.mixed().required("حقل الزامي").nullable(),
  daira: Yup.string().required("حقل الزامي").nullable(),
});
const DataTableCrud = (res) => {
    const rouet = useRouter();
    console.log(rouet);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [data, setdata] = useState([...res.data]);
/************************getMoassat********************************* */
  const fetcher = async (param) => {
    const res = await axios.get(`/api/hello`, {
      params: {
        ...param,
      },
    });
    const data = await res.data;

    return data;
  };
  const postData = async (values) => {
    const res = await axios.post(`/api/hello`, values);
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

  const [selectedMoassa, setSelectedMoassa] = useState(null);

  const [globalFilter, setGlobalFilter] = useState(null);

  
  const dt = useRef(null);
 

 

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

 

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Products</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="بحث..."
        />
      </span>
    </div>
  );

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
        fetcher({ daira_name: newInputValue })
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
      postData(values).then((e)=>{
        alert(e.data)
        setProducts((prev) => {
          return [...prev, values];
        });
      }).catch((error)=>{
        alert(error)
      })
     
    } else if (isInProducts >= 0) {
      alert("موجود بالفعل");
    } else {
      postData(values).then((e)=>{
        alert(e.data)
        setProducts([values]);
      }).catch((error)=>{
        alert(error)
      })
    }

    // const test =  products&&products.map((word) => {
    //      return word.moassa === values.moassa?[...prev,values]:[...prev,values]})
  };
/**********************lengthList************************ */
const lengthList = (data,index) =>  <div>{index.rowIndex+1}</div>

/**********************lengthList************************ */
  return (
    <div className="datatable-crud">
      <div>
        <ButtonMui variant="outlined" color="primary" onClick={handleClickOpen}>
          أضف الى القائمة
        </ButtonMui>

        <Container maxWidth="md" style={{ marginBottom: 2 }}>
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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DialogContentText>
                        To subscribe to this website, please enter your email
                        address here. We will send updates occasionally.
                      </DialogContentText>
                    </Grid>
                    <Grid item xs={3}>
                      <Controls.Textfield
                        name={"potential_vacancy"}
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
          </DialogMui>
        </Container>
      </div>
      {/* <Toast ref={toast} /> */}

      <div className="card">
        <DataTable
          ref={dt}
          value={products}
          selection={selectedMoassa}
          onSelectionChange={(e) => setSelectedMoassa(e.value)}
          dataKey="id"
          emptyMessage="لا توجد بيانات لعرضها"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          stripedRows
          removableSort
          autoLayout
        >
          <Column selectionMode="multiple"></Column>
          <Column field="daira" header="الدائرة"></Column>
          <Column field='len' header="الرقم" body={lengthList}></Column>

          <Column field="moassa.bladia" header="البلدية"></Column>
          <Column field="moassa.EtabNom" header="المؤسسة" sortable></Column>
          <Column
            field="moassa.EtabMatricule"
            header="رقم المؤسسة"
            sortable
          ></Column>
          <Column field="potential_vacancy" header="محتمل الشغور">
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column field="forced" header="مجبر" sortable>
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column field="vacancy" header="شاغر" sortable></Column>
          <Column field="surplus" header="فائض" sortable>
            {/*body={ratingBodyTemplate}*/}
          </Column>

          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`https://harak.vercel.app/api/hello`);
  const data = await res.json();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
export default DataTableCrud;
