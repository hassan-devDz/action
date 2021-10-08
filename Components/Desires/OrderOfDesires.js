import {useState,useEffect} from 'react';
import { Dialog ,DialogContent,DialogTitle,DialogActions,DialogContentText} from "@material-ui/core";
import ButtonWrapper from "../FormsUi/Button/ButtonNorm";
import Drogble from '../TransferList/drag';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { List, ListItem, ListItemText, Paper } from "@material-ui/core";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

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
//         ({ moassa: id1 }) =>
//           !arr2.some(({ moassa: id2 }) => id2.EtabMatricule === id1.EtabMatricule)
//       );
//     };
const DailogMui1 = (props) => {
    const [open, setOpen] = useState(false)
    const [items, setitems] = useState(props.selectedMoassa);
    
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
    setOpen(false)
  }
  const postData = (e) => {
    console.log(items);
  setOpen(false)
}
  return ( 
      <>
       <ButtonWrapper
            color="secondary"
            disabled={props.selectedMoassa == false}
            onClick={(e) => setOpen(true)}
          >
            {"ترتيب الاختيارات"}
          </ButtonWrapper>
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{"رتب رغباتك عن طريق السحب والافلات "}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
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
                  key={item.moassa.EtabMatricule}
                  draggableId={`${item.moassa.EtabMatricule}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Paper elevation={4} style={{ margin: "6px 0" }}>
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
                        <span style={{ padding: "0 0 0 24px" }}>{`الرغبة رقم ${
                          index + 1
                        } `}</span>
                        <ListItemText
                          style={{ color: "#000" }}
                          primary={item.moassa.EtabNom}
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
      
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <ButtonWrapper onClick={handleClose} color="primary">
        اغلاق
      </ButtonWrapper>
      <ButtonWrapper onClick={postData} color="primary" autoFocus>
        موافقة وارسال
      </ButtonWrapper>
    </DialogActions>
  </Dialog></>
   );
}
export default DailogMui1;