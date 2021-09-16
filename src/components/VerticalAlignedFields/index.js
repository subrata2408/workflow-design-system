import PropTypes from "prop-types";
import _ from "lodash";
import { Grid } from "@material-ui/core";
import FormBuilder from "../FormBuilder";

const VerticalAlignedFields = ({ formState }) => {
  return (
    <>
      {formState && (
        <Grid container spacing={2}>
          {_.map(Object.keys(formState), (field) => (
            <Grid item key={field} xs={12}>
              <FormBuilder
                fields={{
                  [field]: {
                    ...formState[field],
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

VerticalAlignedFields.propTypes = {
  formState: PropTypes.object.isRequired,
};

export default VerticalAlignedFields;
