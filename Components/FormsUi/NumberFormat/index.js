import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';



export const NumberFormatCustom=(props)=> {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        
        lang="en"
        
        type={'number'}
        allowNegative={false}
        getInputRef={inputRef}
        onValueChange={(values) => {
         
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator=''
        isNumericString
        //prefix="$"
      />
    );
  }
  
  NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };