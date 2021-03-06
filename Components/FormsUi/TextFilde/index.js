import React from "react";
import { TextField } from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const TextfieldWrapper = ({ name,  ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, mata] = useField(name);
  const handleChange = (evt) => {
    
    const onlyNums = evt.target.value;
    const { value } = evt.target;
    console.log(value);
    if (otherProps.type === "number") {
      setFieldValue(name, +value);
    } else {
      setFieldValue(name, value.replace(/\s+/g, " ").trim());
    }
  }

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
