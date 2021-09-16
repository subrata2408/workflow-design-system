import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const PopUp = ({ id, open, children, actionItems, title }) => {
  return (
    <Dialog
      disableEnforceFocus
      id={id}
      open={open}
      PaperComponent={PaperComponent}
      //maxWidth={maxWidth}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography gutterBottom id="alert-dialog-description" component="div">
          {children}
        </Typography>
      </DialogContent>

      {actionItems && actionItems.length > 0 && (
        <DialogActions>
          {_.map(actionItems, (item) => (
            <Button
              onClick={item.actionHandler}
              id={item.name}
              key={item.name}
              color={item.actionType}
              variant={item.variant}
              disabled={item.disabled}
              autoFocus={item.autoFocus}
            >
              {item.name}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

PopUp.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  actionItems: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default PopUp;
