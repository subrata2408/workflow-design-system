import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  makeStyles,
} from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { metadata } from "./metadata";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <Card className={classes.root}>
        <CardHeader subheader="Drag below entities to the pane on the right to create a workflow" />
        <Divider />
        <CardContent>
          <Grid container spacing={1}>
            {Object.keys(metadata.entities).map((entity) => (
              <Grid key={entity} item xs={12}>
                <Chip
                  icon={<DragIndicatorIcon />}
                  label={entity}
                  onDragStart={(event) => onDragStart(event, entity)}
                  draggable
                  variant="outlined"
                  color="primary"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default Sidebar;
