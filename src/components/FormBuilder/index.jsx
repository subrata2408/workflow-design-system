import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

import TextBoxField from "../TextBoxField";
import NumberField from "../NumberField";
import SelectFields from "../SelectField";

const fieldTypeComponentMap = {
  text: TextBoxField,
  number: NumberField,
  select: SelectFields,
};

function FormBuilder({ fields }) {
  return _.map(fields, (field) => {
    const FieldComponent = fieldTypeComponentMap[field.type];
    return <FieldComponent key={field.name} {...field} />;
  });
}

FormBuilder.propTypes = {
  fields: PropTypes.object.isRequired,
};
export default FormBuilder;
