import PropTypes from "prop-types";
import _ from "lodash";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const HorizontalAlignedButtons = ({ actionItems }) => {
  const classes = useStyles();
  return (
    <>
      {_.map(actionItems, (item) => (
        <Button
          className={classes.button}
          onClick={item.actionHandler}
          id={item.name}
          key={item.name}
          color={item.actionType}
          variant={item.variant}
          disabled={item.disabled}
          autoFocus={item.autoFocus}
          startIcon={item.startIcon}
          size="small"
        >
          {item.name}
        </Button>
      ))}
    </>
  );
};

HorizontalAlignedButtons.propTypes = {
  actionItems: PropTypes.array.isRequired,
};

export default HorizontalAlignedButtons;
