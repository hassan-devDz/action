import { useState } from "react";

import CheckIcon from "@material-ui/icons/Check";

import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import { ButtonWrapper, ButtonRed } from "../FormsUi/Button/ButtonNorm";

import useConfirm from "../UiDialog/useConfirm";
import { Typography } from "@material-ui/core";

export default function AlertDialog(props) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);

    console.log(props.rowData);
  };

  const onReject = (e) => {
    console.log(e);
    setOpen(false);
    props.onReject(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleReject = (item) => {
    confirm({
      content: (
        <Typography variant="body1">
          سيتم رفض{" "}
          {item.workSchool
            ? item?.workSchool.EtabNom
            : `${item.firstName} ${item.lastName}`}
          .
        </Typography>
      ),
      confirmationButtonProps: { startIcon: <CheckIcon /> },
    })
      .then(() => props.onReject(item))
      .catch(() => console.log("Deletion cancelled."));
  };
  return (
    <>
      <ButtonRed
        variant="text"
        color="secondary"
        aria-label="reject"
        //onClick={onRowEditInitconsol}
        size="small"
        onClick={() => handleReject(props.rowData)}
      >
        رفض
      </ButtonRed>
    </>
  );
}
