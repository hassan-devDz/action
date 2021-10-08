import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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

const App = (props) => {
  const [items, setitems] = useState(props.selectedMoassa);
  const results = (arr1, arr2) => {
    return arr1.filter(
      ({ moassa: id1 }) =>
        !arr2.some(({ moassa: id2 }) => id2.EtabMatricule === id1.EtabMatricule)
    );
  };
  // useEffect(() => {
  //   setitems(props.selectedMoassa);
    
  // }, [results(props.selectedMoassa,items).length>0]);

  //this.onDragEnd = this.onDragEnd.bind(this);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const item = reorder(items, result.source.index, result.destination.index);

    setitems(item);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  
  
  console.log(results(props.selectedMoassa,items),props.selectedMoassa,items);
  return (
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
  );
};
export default App;
