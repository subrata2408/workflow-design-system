import _ from "lodash";

export function showConfirmPopUp(form, title) {
  return new Promise((resolve) => {
    const actionItems = [
      {
        actionHandler: () => {
          this.setPopUp({ open: false });
          resolve(false);
        },
        name: "Cancel",
        actionType: "primary",
        variant: "outlined",
      },
      {
        actionHandler: () => {
          this.setPopUp({ open: false });
          resolve(true);
        },
        name: "Ok",
        actionType: "primary",
        variant: "contained",
        disableElevation: "true",
        autoFocus: true,
      },
    ];

    this.setPopUp({
      open: true,
      content: {
        form,
        title,
        actionItems,
      },
    });
  });
}

export function isValidFormField(path, name) {
  let valid = true;
  const field = _.get(this.state, `${path}.${name}`, {});
  if (field && field.required && _.isEmpty(String(field.value))) {
    this.updateFormElementState(path, name, "error", true);
    this.updateFormElementState(
      path,
      name,
      "helperText",
      `${field.label} is Mandatory`
    );
    valid = false;
  } else if (
    field.lengthRequired &&
    _.size(field.value) !== field.lengthRequired
  ) {
    this.updateFormElementState(path, name, "error", true);
    this.updateFormElementState(
      path,
      name,
      "helperText",
      `${field.label} should be a ${field.lengthRequired} digits number`
    );
    valid = false;
  }
  if (valid) {
    this.updateFormElementState(path, name, "error", false);
    this.updateFormElementState(path, name, "helperText", "");
  }
  return valid;
}

export function getHandlerBindedMetaData(metadata) {
  let finalComponentMetaData = {};
  _.forEach(Object.keys(metadata), (mpath) => {
    _.forEach(Object.keys(_.get(metadata, mpath)), (key) => {
      let dumbComponentMetaData = _.mapValues(
        _.get(metadata[mpath], key),
        (field) => {
          return {
            ...field,
            onChange: (event) => this.onChangeHandler.call({}, key, event),
            onBlur: (event) => this.onBlurHandler.call({}, key, event),
          };
        }
      );
      finalComponentMetaData = {
        ...finalComponentMetaData,
        [key]: dumbComponentMetaData,
      };
    });
  });

  return finalComponentMetaData;
}

export function verifyFormState(path) {
  let valid = true;
  _.forEach(Object.keys(_.get(this.state, path)), (key) => {
    valid = isValidFormField.call(
      {
        state: this.state,
        updateFormElementState: this.updateFormElementState,
      },
      path,
      key
    );
    if (!valid) {
      return false;
    }
  });

  return valid;
}
