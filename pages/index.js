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

import AutocompleteMui from "../Components/Autocmplemoassat";
import Controls from "../Components/FormsUi/Control";
import {
  ButtonWrapper,
  ButtonRed,
} from "../Components/FormsUi/Button/ButtonNorm";
import Typography from "@material-ui/core/Typography";
import {
  Container,
  Grid,
  Button,
  Paper,
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
import IntegrationNotistack from "../Components/Notification/Alert";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import { withSnackbar } from "notistack";
import Static from "../Components/static";

import ConfiremDeleteDialog from "../Components/Notification/ConfiremDeleteDialog";
import {
  openToastSuccess,
  openToastError,
  openToastInfo,
} from "../Components/Notification/Alert";
import { moassaSchema } from "../schemas/schemas_moassa";
import { subjects, getKeyByValue, loop } from "../middleware/StudySubjects";
import replaceStrIcon from "../Components/IconReplaceTxt/IconRepTxt";
import replaceWilayaBody from "../Components/IconReplaceTxt/WilayaBody";
import DateP from "../Components/date";
import { useUser, useData } from "../middleware/Hooks/fetcher";
import ConfirmProvider from "../Components/UiDialog/ConfirmProvider";
import { Dropdown } from "hassanreact/dropdown";
import router, { useRouter } from "next/router";
import Link from "../Components/Ui/Link";
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

const INITIAL_FORM_STATE = {
  wilaya: null,
  baldia: null, //??????????????
  educationalPhase: null, //??????????
  specialty: null,
  workSchool: null, //?????????? ??????????
  potentialVacancy: 0, //??????????
  forced: 0, //????????
  vacancy: 0, //????????
  surplus: 0, //????????
};

let originalRows = {};

const _educationalPhase = ["??????????????", "??????????", "??????????"];
let arrt = [];
const DataTableCrud = ({ newStructureData }) => {
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
  const [user, { mutate }] = useUser();
  const { data, isLoading, isError, isMutate } = useData();
  const [loading, setLoading] = useState(true), //???????? ?????????????? ???????????? ?????????????? ?? ???????????????? ??????????????
    [listMoassat, setListMoassat] = useState([]), //?????????? ???????????????? ?????????????? ??????????????
    [selectedMoassa, setSelectedMoassa] = useState([]), //???????????????? ???????? ???? ?????????????? ??????????
    [globalFilter, setGlobalFilter] = useState(null), //???????????? ???????? ???????? ?????????? ???????? ???? ????????????
    [open, setOpen] = useState(false), //?????? ?????????????? ???????????????? ???????????? ?????????? ???? ???????? ????????????
    [spinnersLoding, setSpinnersLoding] = useState(false), //?????????? ???? ???????????? ???? ???????????? ?????? ?????? ?????????? ??????????
    [editingRows, setEditingRows] = useState({}); //?????????? ???????????? ???? ???? ???????? ???? ????????????
  const [year, setYear] = useState(new Date().getFullYear());
  /**
   * !!! *******************************new useState**********************************
   */

  const [wilayaList, setWilayaList] = useState([]); // ?????????? ???? ??????????????????
  const [baldiaList, setBaldiaList] = useState([]); //?????????? ???????????????? ?????????????? ???????????????? ????????????????
  const [specialtyList, setSpecialtyList] = useState([]); //?????????? ???????? ??????????????
  const [moassaList, setMoassaList] = useState([]); //?????????? ???????????????? ?????????????? ??????????????
  const [educationalPhaseList, setEducationalPhaseList] = useState([]); //?????????? ??????????????
  const [inputValueWilaya, setInputValueWilaya] = useState(""); //???????????? ????????????????
  const [inputValueBaldia, setInputValueBaldia] = useState(""); //?????????? ?????? ??????????????
  const [educationalValuePhase, setEducationalValuePhase] = useState(""); //??????????
  const [inputValueSpecialty, setInputValueSpecialty] = useState(""); //???????? ??????????????
  const [inputValueMoassa, setInputValueMoassa] = useState(""); //???????????? ??????????????
  const [lastdata, setLastdata] = useState(newStructureData);
  const updatedData = isLoading ? newStructureData : loop(data);

  useEffect(() => {
    setLastdata(isLoading ? newStructureData : loop(data));
  }, [data]);

  const getValueWilaya = (event, newInputValue) => {
    /**
     *!???????????? ????????????????
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
      //?????? ?????????? ???????????????? ?????? ???????????? ???????????????? ??????????????
      fetcher(`/api/getlistbaldia`, {
        key: isChoiseOfWilayaInList[0].key,
      }).then((response) => {
        setBaldiaList(response.citys);
      });
    }
  };

  const getValueBaldia = (event, newInputValue) => {
    //???????????? ??????????????
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
      //?????? ?????????? ?????????????? ?????? ???????????? ??????????????
      setEducationalPhaseList(_educationalPhase);
    }
  };
  const getValueEducationalPhase = (event, newInputValue) => {
    //???????????? ??????????
    /**
     * ! ???????????? ???? ?????????? ????????????????
     *
     */
    setInputValueMoassa("");
    setInputValueSpecialty("");

    setSpecialtyList([]);
    setMoassaList([]);
    //!?????????? ??????????????

    setEducationalValuePhase(newInputValue);

    if (_educationalPhase.includes(newInputValue)) {
      const body = {
        cle: baldiaList.filter((elm) => elm.valeur == inputValueBaldia)[0].cle,
        value: newInputValue,
      };
      fetcher(`/api/getlistmoassat`, body).then((res) => {
        setMoassaList(res);
      });
    }
    if (newInputValue === "??????????????") {
      //?????? ?????????? ???????????????? ?? ???????? ?????????????? ?????? ???????????? ??????????
      setSpecialtyList(subjects.primary);
    }
    if (newInputValue === "??????????") {
      //?????? ?????????? ???????????????? ?? ???????? ?????????????? ?????? ???????????? ??????????
      setSpecialtyList(subjects.middle);
    }
    if (newInputValue === "??????????") {
      //?????? ?????????? ???????????????? ?? ???????? ?????????????? ?????? ???????????? ??????????
      setSpecialtyList(subjects.secondary);
    }
  };
  const getValueMoassa = (event, newInputValue) => {
    //???????????? ?????????? ??????????
    setInputValueMoassa(newInputValue);
  };

  const getValueSpecialty = (event, newInputValue) => {
    //???????? ??????????????
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
  /** **************************** ???????? ???????????? ********************* */
  const signOut = async () => {
    const res = await fetch("/api/authusers/logout");

    if (res.status === 204) {
      mutate({ user: null });
      router.push("/auth/login");
    }
  };
  // const { data, error } = useSWR('/api/user', fetcher)
  /********************* ?????? ?????????? ?????????? ???????????? *********************start */

  /********************* ?????? ?????????? ?????????? ???????????? *********************end */

  /********************* ?????? ?????????? ???? ?????? ?????????? ???? ???????????? *********************start */

  const putData = (method, url, values, query = "") => {
    const response = axios({
      method: method,
      url: url + "?year=" + query,
      data: values,
    });

    return response;
  };
  /********************* ?????? ?????????? ???? ?????? ?????????? ???? ???????????? *********************end */

  const onSelected = (e, d) => {
    setSelectedMoassa(e.value);
  };

  const dt = useRef(null);

  /*******************?????????? ?????????? ???? ??????????????**********start******** */
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
  /*******************?????????? ?????????? ???? ??????????????**********end******** */

  /*------------------?????? ?????????? ???????????????? ???? ???????? ???????????? ?????????????? ??????????????---------??????????----- */

  /*------------------?????? ?????????? ???????????????? ???? ???????? ???????????? ?????????????? ??????????????---------??????????------ */

  /************start**********?????? ????????????  ?????????? ?????????? ?????????? ?? ?????????? ?????????? ??????????*********** */

  const handleClickOpen = () => {
    if (wilayaList.length === 0) {
      fetcher(`/api/getlistwilaya`) //??????  ????????????????  ??????????????
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
  /************end**********?????? ????????????  ?????????? ?????????? ?????????? ?? ?????????? ?????????? ??????????*********** */

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
          openToastError("?????? ?????? ????");

          // client received an error response (5xx, 4xx)
        } else if (err.request) {
          setSpinnersLoding(false);
          openToastError("???? ???????? ?????????? ??????????");
          // client never received a response, or request never left
        } else {
          // anything else
          setSpinnersLoding(false);
          openToastError("?????? ?????? ????");
        }
      })
      .finally(() => {
        isMutate(data);
      });
  };
  /**-******************************************Submit************************************************************** */
  const indexOfValue = (value) => {
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
      openToastInfo("?????????? ????????????");
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
    isMutate(data);
    setLastdata(updatedData);
    console.log(data, updatedData);
  };

  const onRowEditSave = (event) => {
    setSpinnersLoding(true);
    putData("put", "/api/update", event.data, year)
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
            openToastError("?????? ?????? ????");
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
        onChange={(e) => onEditorValueChange(props, +e.target.value)}
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: Controls.NumberFormatCustom,
        }}
      />
    );
  };
  /**************************?????? ?????????? ?????????????? ???? ???????????? *********************** */
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
        <Grid item xs={6}>
          <ButtonWrapper
            variant="outlined"
            color="primary"
            aria-label="information update "
            onClick={onRowEditInitCh}
          >
            <EditTwoToneIcon />
          </ButtonWrapper>
        </Grid>
        <Grid item xs={6}>
          <ConfirmProvider>
            <ConfiremDeleteDialog
              rowData={rowData}
              onDeleteProduct={deleteProduct}
              message={Message}
            />
          </ConfirmProvider>
        </Grid>
      </Grid>
    );
  };

  /*****************************?????? ????????????***************************** */
  const onYearPicker = (e) => {
    setYear(e);

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
              ?????? ???? ??????????????
            </ButtonRed>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<AddTwoToneIcon />}
            >
              ?????? ?????? ??????????????
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
              ??????????
            </ButtonRed>
          </Grid>
          <Grid item xs={6}>
            <ButtonWrapper
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<CloudDownloadTwoToneIcon />}
            >
              ????????????
            </ButtonWrapper>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DateP onChange={onYearPicker} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="component-outlined">??????????</InputLabel>
            <OutlinedInput
              id="component-outlined"
              onInput={(e) => setGlobalFilter(e.target.value)}
              label="??????????"
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
  const statuses = ["??????????????", "??????????", "??????????"];
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
      noOptionsText="???? ???????? ????????????"
      id="controllable-states-demo"
      options={statuses}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="???????? ??????????" />}
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
          fetcher(`/api/getlistwilaya`) //??????  ????????????????  ??????????????
            .then(function (response) {
              setWilayaList(response);
            })
            .catch((err) => {});
        }
      }}
      noOptionsText="???? ????????????????"
      id="controllable-states-demo"
      options={wilayaList}
      getOptionLabel={(option) => {
        if (option.value === "???????????? ?????????????? ?????????????? ??????") {
          return (
            option.value.replace("???????????? ?????????????? ?????????????? ??????", "?????????????? ??") ||
            ""
          );
        }
        if (option.value === "???????????? ?????????????? ?????????????? ??????") {
          return (
            option.value.replace("???????????? ?????????????? ?????????????? ??????", "?????????????? ??") ||
            ""
          );
        }
        if (option.value === "???????????? ?????????????? ?????????????? ??????") {
          return (
            option.value.replace("???????????? ?????????????? ?????????????? ??????", "?????????????? ??") ||
            ""
          );
        }
        return option.value.replace("???????????? ?????????????? ????????????", "") || "";
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="????????????????" />}
    />
  );
  return (
    <>
      {" "}
      <Container maxWidth="xl" style={{ marginBottom: 2, marginTop: 12 }}>
        {/* <TransferList selectedMoassa={selectedMoassa}></TransferList> */}

        <Backdrop open={spinnersLoding} style={{ zIndex: 1301 }}>
          <ScaleLoader color="#dbdbdb" loading={spinnersLoding} size={50} />
        </Backdrop>

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
                validationSchema={moassaSchema}
                onSubmit={handelSubmit}
              >
                <Form>
                  <DialogTitle id="form-dialog-title">
                    {" "}
                    ?????? ?????? ??????????????
                  </DialogTitle>
                  <DialogContent>
                    <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <DialogContentText>
                          ???????? ?????????????? ???? ??????????????
                        </DialogContentText>
                      </Grid>
                      <Grid item xs={3}>
                        <Controls.Textfield
                          name={"potentialVacancy"}
                          label={"?????????? ????????????"}
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
                          label={"????????"}
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
                          label={"????????"}
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
                          label={"????????"}
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
                          label="???????????? ??????????????"
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
                          label="??????????????"
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
                          label="??????????"
                          variant="outlined"
                          inputValue={educationalValuePhase}
                          onInputChange={getValueEducationalPhase}
                          options={educationalPhaseList}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controls.AutocompleteMui
                          name="specialty"
                          label="???????? ??????????????"
                          loading
                          loadingText={"???? ????????????????"}
                          inputValue={inputValueSpecialty}
                          onInputChange={getValueSpecialty}
                          options={specialtyList || []}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controls.AutocompleteMui
                          name="workSchool"
                          label="?????????? ??????????"
                          loading
                          loadingText={"???? ????????????????"}
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
                          label="??????????????"
                          inputValue={inputValueDaira}
                          onInputChange={getValueDaira}
                          options={dataServer}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <AutocompleteMui
                          name="moassa"
                          label="??????????????"
                          loading
                          loadingText={"???? ????????????????"}
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
                      ??????????
                    </ButtonRed>

                    <Controls.Button
                      color="primary"
                      startIcon={<CheckTwoToneIcon />}
                      variant="outlined"
                    >
                      ??????
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
          dataKey="id"
          emptyMessage="???? ???????? ???????????? ????????????"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          editMode="row"
          onRowEditInit={onRowEditInit}
          onRowEditCancel={onRowEditCancel}
          onRowEditSave={onRowEditSave}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="?????? {first} ?????? {last} ???? ?????? {totalRecords}"
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
            columnKey="multiple"
            selectionMode="multiple"
            style={{ width: 50 }}
            frozen
          ></Column>
          <Column
            columnKey="index"
            field="index"
            header="??????????"
            body={indexOfValueInDataList}
            headerStyle={{ width: 40, padding: 0, height: 57.38 }}
            bodyStyle={{ height: 81 }}
            frozen
          ></Column>
          <Column
            columnKey="educationalPhase"
            field="educationalPhase"
            header="??????????"
            filter
            filterElement={statusFilter}
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          <Column
            columnKey="specialty"
            field="specialty"
            header="???????? ??????????????"
            headerStyle={{ width: 150, padding: 7 }}
            sortable
          />
          <Column
            columnKey="workSchool.EtabNom"
            field="workSchool.EtabNom"
            header="??????????????"
            sortable
            style={{ width: 300 }}
            body={replaceStrIcon}
          ></Column>

          <Column
            columnKey="wilaya.value"
            field="wilaya.value"
            header="??????????????"
            body={replaceWilayaBody}
            filter
            filterElement={wilayaFilter}
            headerStyle={{ width: 150 }}
            bodyStyle={{ width: 150 }}
            sortable
            frozen
          ></Column>

          <Column
            columnKey="baldia.valeur"
            field="baldia.valeur"
            header="??????????????"
            sortable
            headerStyle={{ width: 114, padding: 7 }}
          ></Column>
          {/* <Column
            field="workSchool.EtabMatricule"
            header="?????? ??????????????"
            sortable
          ></Column> */}
          <Column
            columnKey="potentialVacancy"
            field="potentialVacancy"
            header="?????????? ????????????"
            editor={inputTextEditor}
            headerStyle={{ width: 120, padding: 7 }}
          >
            {/* body={imageBodyTemplate}*/}
          </Column>
          <Column
            columnKey="forced"
            field="forced"
            header="????????"
            sortable
            editor={inputTextEditor}
            headerStyle={{ width: 120 }}
          >
            {/*body={priceBodyTemplate}*/}
          </Column>
          <Column
            columnKey="vacancy"
            field="vacancy"
            header="????????"
            sortable
            headerStyle={{ width: 120 }}
            editor={inputTextEditor}
          ></Column>
          <Column
            columnKey="surplus"
            field="surplus"
            header="????????"
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

export async function getServerSideProps(ctx) {
  const urlBass = await process.env.URL_BASE;
  const cookie = await ctx.req?.headers.cookie;
  const co = await { ...ctx.req.cookies };
  const res = await fetch(`${urlBass}/api/getNationalAnnualMovementData`, {
    headers: {
      cookie: cookie,
    },
  });

  if (!res.ok) {
    return {
      notFound: true,
    };
  }
  const dataserver = await res.json();
  const newStructureData = await loop(dataserver);
  return {
    props: { newStructureData }, // will be passed to the page component as props
  };
}
DataTableCrud.auth = true;

export default DataTableCrud;
