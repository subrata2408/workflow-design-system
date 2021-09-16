import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function Layout(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              component={Link}
              to="/"
            >
              <HomeIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title}>
              Workflow Design System
            </Typography>
            <Button component={Link} color="inherit" to="/workfowdesigner">
              Draw Workflow
            </Button>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Box my={2}>{props.children}</Box>
    </React.Fragment>
  );
}

export default Layout;
