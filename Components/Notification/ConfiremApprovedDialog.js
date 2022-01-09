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

  const onApproved = (e) => {
    console.log(e);
    setOpen(false);
    props.onApproved(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleApproved = (item) => {
    confirm({
      content: (
        <Typography variant="body1">
          سيتم قبول{" "}
          {item.workSchool
            ? item?.workSchool.EtabNom
            : `${item.firstName} ${item.lastName}`}
          .
        </Typography>
      ),
      confirmationButtonProps: { startIcon: <CheckIcon /> },
    })
      .then(() => props.onApproved(item))
      .catch(() => console.log("Deletion cancelled."));
  };
  return (
    <>
      <ButtonWrapper
        variant="text"
        color="secondary"
        aria-label="approved"
        //onClick={onRowEditInitconsol}
        size="small"
        onClick={() => handleApproved(props.rowData)}
      >
        قبول
      </ButtonWrapper>
    </>
  );
}
