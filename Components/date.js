
import React, { Fragment, useState } from "react";
import { DatePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/dayjs";
import dayjs from "dayjs";
function YearPicker(props) {
  const [selectedDate, setDateChange] = useState(new Date());
  console.log(dayjs(selectedDate).year())
  
  const onChange = (e) => {
      console.log(e,props);
      setDateChange(e)
      props.onChange(dayjs(e).year())
      
    
  }
  return (
    <>
     <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
      fullWidth
        views={["year"]}
        label="السنة"
        value={selectedDate}
        onChange={onChange}
        autoOk
        cancelLabel={"الغاء"}
        okLabel="موافق"
        id="date"
        minDateMessage={null}
       maxDateMessage={null}


      />
      </MuiPickersUtilsProvider>

      {/* <DatePicker
        views={["year", "month"]}
        label="Year and Month"
        helperText="With min and max"
        minDate={new Date("2018-03-01")}
        maxDate={new Date("2018-06-01")}
        value={selectedDate}
        onChange={handleDateChange}
      />

      <DatePicker
        variant="inline"
        openTo="year"
        views={["year", "month"]}
        label="Year and Month"
        helperText="Start from year selection"
        value={selectedDate}
        onChange={handleDateChange}
      /> */}
    </>
  );
}

export default YearPicker;
// import { useState } from "react";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import "dayjs/locale/ar-dz";
// import localizedFormat from "dayjs/plugin/localizedFormat";
// import toObject from 'dayjs/plugin/toObject'
// import React from "react";
// import Grid from "@material-ui/core/Grid";
// import DateFnsUtils from "@date-io/dayjs";
// import {
//   DatePicker,
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from "@material-ui/pickers";
// import arDz from "dayjs/locale/ar-dz";
// import { useField, useFormikContext } from "formik";
// dayjs.extend(localizedFormat);
// dayjs.extend(customParseFormat);
// dayjs.extend(toObject)
// export function parseDateString(value, originalValue) {
  
//  if (originalValue&& originalValue.length===4) {
//   const parsedDate = dayjs(originalValue, "YYYY").toDate();
  
//   return parsedDate;
//  }
//   const parsedDate = dayjs(originalValue, "DD-MM-YYYY").toDate();
  
//   return parsedDate;
// }
// class RuLocalizedUtils extends DateFnsUtils {
//   getCalendarHeaderText(date) {
//     return dayjs(date).locale(arDz).format("MMMM YYYY");
//   }

//   getDatePickerHeaderText(date) {
//     return dayjs(date).locale(arDz).format("dddd D MMMM ");
//   }
// }

// export function dateFormaNow(date = new Date()) {
//   return dayjs(date).locale(arDz).format("DD-MM-YYYY");
// }

// export default function MaterialUIPickers({ name, ...otherProps }) {
//   dayjs.locale("ar-dz");
//   const [selectedDate, setSelectedDate] = React.useState();

//   const { setFieldValue } = useFormikContext();
//   const handleDateChange = (date, e) => {

   

//  setSelectedDate(date); 
//  console.log(e,name);
  
    
//   };
 
//   const [field, meta] = useField(name);

//   const configDateTimePicker = {
//     ...field,
//     ...otherProps,
//     onChange: handleDateChange,
    
//     InputLabelProps: {
//       shrink: true,
//     },
//   };

//   if (meta && meta.touched && meta.error) {
//     configDateTimePicker.error = true;
//     configDateTimePicker.helperText = meta.error;
//   }

//   // The first commit of Material-UI

//   return (
//     <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={"ar-dz"}>
//       <KeyboardDatePicker
//         {...configDateTimePicker}
//         autoOk
//         cancelLabel={"الغاء"}
//         okLabel="موافق"
//         showTodayButton
//         todayLabel="اليوم"
//         inputVariant="outlined"
//         fullWidth
//         //initialFocusedDate={dayjs()}
//         //helperText={null}
//         //margin="normal"
//         //id="date-picker-dialog"
//         //label="Date picker dialog"
//         value={selectedDate}
//         invalidDateMessage={null}
//        minDateMessage={null}
//        maxDateMessage={null}
//        minDate={new Date('1970')}
//       // disableFuture
//       maxDate={new Date()}
//         //inputValue='10/20'

//         KeyboardButtonProps={{
//           "aria-label": "change date",
//         }}
//       />
//     </MuiPickersUtilsProvider>
//   );
// }
