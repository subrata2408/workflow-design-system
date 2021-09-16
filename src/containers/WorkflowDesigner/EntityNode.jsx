import React, { memo, useRef } from "react";
import { Handle } from "react-flow-renderer";

import { IconButton } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import DescriptionIcon from "@material-ui/icons/Description";

export default memo(({ data, isConnectable }) => {
  const ref = useRef(null);
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Card ref={ref} variant="outlined" style={{ borderColor: "#0f1f84" }}>
        <CardActions>
          <Typography gutterBottom component="h2">
            {data.label}
          </Typography>
          <IconButton
            aria-label="details"
            size="small"
            onClick={() => data.onEntityClickHandler(data)}
          >
            <DescriptionIcon color="primary" />
          </IconButton>
        </CardActions>
      </Card>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
