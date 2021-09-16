import React from "react";
import PropTypes from "prop-types";
import { TextField, MenuItem } from "@material-ui/core";

const SelectField = ({ value, onChange, options }) => (
  <TextField
    id="demo-simple-select"
    value={value}
    onChange={onChange}
    select
    fullWidth
  >
    {options &&
      options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
  </TextField>
);

SelectField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectField;
