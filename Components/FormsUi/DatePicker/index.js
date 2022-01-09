import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ar-dz";
import localizedFormat from "dayjs/plugin/localizedFormat";
import toObject from "dayjs/plugin/toObject";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/dayjs";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import arDz from "dayjs/locale/ar-dz";
import { useField, useFormikContext } from "formik";
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(toObject);
export function parseDateString(value, originalValue) {
  if (originalValue && originalValue.length === 4) {
    const parsedDate = dayjs(originalValue, "YYYY").toDate();

    return parsedDate;
  }
  const parsedDate = dayjs(originalValue, "DD-MM-YYYY").toDate();

  return parsedDate;
}
export class RuLocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date) {
    return dayjs(date).locale(arDz).format("MMMM YYYY");
  }

  getDatePickerHeaderText(date) {
    return dayjs(date).locale(arDz).format("dddd D MMMM ");
  }
}

export function dateFormaNow(date = new Date()) {
  //تحويل فورما التاريخ الى DD-MM-YYYY
  return dayjs(date).locale(arDz).format("DD-MM-YYYY");
}

export default function MaterialUIPickers({
  name,
  defVlue,
  max,
  ...otherProps
}) {
  dayjs.locale("ar-dz");
  const [selectedDate, setSelectedDate] = React.useState(defVlue);

  const { setFieldValue } = useFormikContext();
  const handleDateChange = (date, e) => {
    setFieldValue(name, e);

    setSelectedDate(date);
  };

  const [field, meta] = useField(name);

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    onChange: handleDateChange,

    InputLabelProps: {
      shrink: true,
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  // The first commit of Material-UI

  return (
    <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={"ar-dz"}>
      <KeyboardDatePicker
        {...configDateTimePicker}
        autoOk
        cancelLabel={"الغاء"}
        okLabel="موافق"
        //showTodayButton
        //todayLabel="اليوم"
        inputVariant="outlined"
        fullWidth
        //initialFocusedDate={dayjs()}
        //helperText={null}
        //margin="normal"
        //id="date-picker-dialog"
        //label="Date picker dialog"
        value={selectedDate}
        invalidDateMessage={null}
        minDateMessage={null}
        maxDateMessage={null}
        minDate={new Date("1958")}
        // disableFuture
        maxDate={max || new Date()}
        //inputValue='10/20'

        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
