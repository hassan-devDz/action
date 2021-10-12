import Link from 'next/link'
import {Link as Lin} from '@material-ui/core'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel
  } from '@material-ui/core';
  import { useField, useFormikContext } from 'formik';
  import { makeStyles } from "@material-ui/core/styles";
  const useStyles = makeStyles((theme) => ({
  centerItem:{
      flexDirection:'row',
      alignItems:'center'
  }
  }))
  const CheckboxWrapper = ({
    name,
    label,
    legend,
    ...otherProps
  }) => {
      const classes = useStyles()
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
  
    const handleChange = evt => {
      const { checked } = evt.target;
      setFieldValue(name, checked);
    };
  
    const configCheckbox = {
      ...field,
      onChange: handleChange
    };
  
    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
      configFormControl.error = true;
    }
    
  legend=`شروط استخدام`
    return (
      <FormControl {...configFormControl} className={classes.centerItem}>
        
        
          <FormControlLabel
            control={<Checkbox {...configCheckbox} />}
            label={label}
            
          />
        <FormLabel component="legend">بإنشائك لهذا الحساب أنت توافق على <Link href='/'><Lin href="/">{legend}</Lin></Link> المنصة .</FormLabel>
      </FormControl>
    );
  };
  
  export default CheckboxWrapper;