import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";

const TextBoxField = ({
  required,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  helperText,
}) => {
  return (
    <TextField
      required={required}
      id="standard-required"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth
    />
  );
};

TextBoxField.propTypes = {
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default TextBoxField;
