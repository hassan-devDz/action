import React, {
  useState,
  useEffect,
  forwardRef,
  useContext,
  createContext,
  useRef,
  cloneElement,
  isValidElement,
} from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
//import Autocomplete from "@material-ui/lab/Autocomplete";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList } from "react-window";

import Checkbox from "@material-ui/core/Checkbox";

import { useField, useFormikContext } from "formik";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import dynamic from "next/dynamic";

const Autocomplete = dynamic(() => import("@material-ui/lab/Autocomplete"), {
  ssr: false,
});

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  return cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 48 : 56;

  const getChildSize = (child) => {
    if (isValidElement(child) && child.type === ListSubheader) {
      return 20;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const useStyles = makeStyles({
  listbox: {
    direction: "inherit !important",
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
const checkedIcon = <CheckBoxIcon fontSize="medium" />;

export default function Virtualize({ name, label, ...otherProps }) {
  const classes = useStyles();
  const { setFieldValue } = useFormikContext(null);

  const [field, mata, helpers] = useField(name);

  const handelChange = (e, value) => {
    if (name === "wilaya") {
      setFieldValue("baldia", null);
      setFieldValue("educationalPhase", null);
      setFieldValue("specialty", null);
      setFieldValue("workSchool", null);
    }
    if (name === "baldia") {
      setFieldValue("educationalPhase", null);
      setFieldValue("specialty", null);
      setFieldValue("workSchool", null);
    }
    if (name === "educationalPhase") {
      setFieldValue("specialty", null);
      setFieldValue("workSchool", null);
    }

    setFieldValue(name, value);
  };

  const configAutoComple = {
    ...field,
    noOptionsText: "???? ???????? ????????????",

    ...otherProps,

    //

    classes: classes,
    ListboxComponent: ListboxComponent,
    onChange: handelChange,
    renderOption: (option, { selected }) => (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />

        {option.EtabNom || option.value || option.valeur || option}
      </React.Fragment>
    ),
    renderInput: (params) => (
      <TextField
        {...params}
        variant="outlined"
        error={Boolean(mata && mata.touched && mata.error)}
        helperText={mata && mata.touched && mata.error}
        name={name}
        label={label}
        placeholder="???????? ???? ??????????????"
      />
    ),
  };

  if (mata && mata.touched && mata.error) {
    configAutoComple.error = true;
    configAutoComple.helperText = mata.error;
  }

  return <Autocomplete {...configAutoComple} />;
}
// <FormControl fullWidth variant="outlined">
//   <InputLabel htmlFor="component-outlined">{label}</InputLabel>
//   <OutlinedInput
//     id="component-outlined"
//     {...params}
//     name={name}
//     label={label}
//     aria-describedby="component-text"
//     placeholder="???????? ???? ??????????????"
//   />
//   <FormHelperText id="component-text">
//     {mata && mata.touched && mata.error}
//   </FormHelperText>
// </FormControl>;
