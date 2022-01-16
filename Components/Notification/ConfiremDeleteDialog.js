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

  const onDeleteProduct = (e) => {
    console.log(e);
    setOpen(false);
    props.onDeleteProduct(props.rowData);
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleDelete = (item) => {
    confirm({
      content: (
        <Typography variant="body1">
          سيتم حذف{" "}
          {item.workSchool
            ? item?.workSchool.EtabNom
            : `${item.firstName} ${item.lastName}`}
          .
        </Typography>
      ),
      confirmationButtonProps: { startIcon: <CheckIcon /> },
    })
      .then(() => props.onDeleteProduct(item))
      .catch(() => console.log(" cancelled."));
  };
  return (
    <>
      <ButtonRed
        variant="outlined"
        color="secondary"
        aria-label="information Delete "
        onClick={() => handleDelete(props.rowData)}
      >
        <DeleteTwoToneIcon />
      </ButtonRed>
    </>
  );
}
