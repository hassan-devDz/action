import React from "react";
import { TextField } from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const TextfieldWrapper = ({ name, type, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, mata] = useField(name);
  const handleChange = (evt) => {
    console.log(evt);
    const onlyNums = evt.target.value;
    const { value } = evt.target;
    console.log(type);
    if (type === "number") {
      setFieldValue(name, +value);
    } else {
      setFieldValue(name, value.replace(/\s+/g, " "));
    }
  };

  const configTextfield = {
    ...field,

    onBlur: handleChange,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  if (mata && mata.touched && mata.error) {
    configTextfield.error = true;
    configTextfield.helperText = mata.error;
  }

  return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;
