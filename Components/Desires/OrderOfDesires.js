import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import { ButtonWrapper, ButtonRed } from "../FormsUi/Button/ButtonNorm";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { List, ListItem, ListItemText, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import axios from "axios";
import Badge from "@material-ui/core/Badge";

import AutorenewIcon from "@material-ui/icons/Autorenew";
import FormatListNumberedRtlIcon from "@material-ui/icons/FormatListNumberedRtl";
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 34,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    fontFamily: "Roboto",
  },
}))(Badge);
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#d4daff" : "#fff",
  color: isDragging ? "red" : "#2b50ed",
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "rgb(221, 234, 255)" : "#f2f4fd",
  padding: grid,
  width: "100%",
});
// const results = (arr1, arr2) => {
//       return arr1.filter(
//         ({ workSchool: id1 }) =>
//           !arr2.some(({ workSchool: id2 }) => id2.EtabMatricule === id1.EtabMatricule)
//       );
//     };
const DailogMui1 = (props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setitems] = useState(props.selectedMoassa);
  const putData = (method, url, values, query = "") => {
    const response = axios({
      method: method,
      url: url + "?" + query,
      data: values,
    });

    return response;
  };
  useEffect(() => {
    setitems(props.selectedMoassa);
  }, [props.selectedMoassa]);

  //this.onDragEnd = this.onDragEnd.bind(this);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const item = reorder(items, result.source.index, result.destination.index);

    setitems(item);
  };
  const handleClose = (e) => {
    console.log(items);
    setOpen(false);
  };

  const query = new URLSearchParams(router.query).toString();
  console.log(query);
  const postData = (e) => {
    putData("post", "/api/choise", { items: items }, query);
    setOpen(false);
  };
  const results = (arr1, arr2) => {
    return arr1.filter(
      ({ workSchool: id1 }) =>
        !arr2.some(
          ({ workSchool: id2 }) => id2.EtabMatricule === id1.EtabMatricule
        )
    );
  };

  return (
    <>
      <ButtonWrapper
        color="secondary"
        disabled={props.selectedMoassa == false}
        onClick={(e) => setOpen(true)}
        startIcon={
          <StyledBadge badgeContent={props.selectedMoassa.length} color="error">
            <FormatListNumberedRtlIcon />
          </StyledBadge>
        }
      >
        {"رتب الرغبات"}
      </ButtonWrapper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
          {"رتب رغباتك عن طريق السحب والافلات "}
        </DialogTitle>

        <DialogContent id="alert-dialog-description">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <List>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Paper
                            elevation={4}
                            style={{ margin: "6px 0" }}
                            component="li"
                          >
                            <ListItem
                              button
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <span
                                style={{ padding: "0 0 0 24px" }}
                              >{`الرغبة رقم ${index + 1} `}</span>
                              <ListItemText
                                style={{ color: "#000" }}
                                primary={item.workSchool.EtabNom}
                              ></ListItemText>
                            </ListItem>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                  </List>
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          </DragDropContext>
        </DialogContent>

        <DialogActions>
          <ButtonRed onClick={handleClose} color="secondary">
            اغلاق
          </ButtonRed>
          <ButtonWrapper onClick={postData} color="secondary" autoFocus>
            موافقة وارسال
          </ButtonWrapper>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DailogMui1;
