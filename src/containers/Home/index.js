import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "100px",
    maxWidth: 500,
  },
  loginCardHeader: {
    color: theme.palette.primary.main,
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center">
      <Card className={classes.root} elevation={0}>
        <CardHeader
          className={classes.loginCardHeader}
          title="WORKFLOW DESIGN SYSTEM"
          variant="h4"
          color="primary"
        />

        <CardContent>
          <Typography variant="body1" color="primary" component="p">
            Tool for faster and easier workflow design.
          </Typography>
          <Typography variant="body1" color="primary" component="p">
            Build and dowload your own workflow in few easy steps.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            component={Link}
            color="primary"
            variant="outlined"
            to="/workfowdesigner"
          >
            Get started
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Home;
