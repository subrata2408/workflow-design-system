import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
  MiniMap,
} from "react-flow-renderer";
import exportFromJSON from "export-from-json";
import _ from "lodash";
import SaveIcon from "@material-ui/icons/Save";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import GetAppIcon from "@material-ui/icons/GetApp";
import ClearIcon from "@material-ui/icons/Clear";

import Sidebar from "./Sidebar";

import EntityNode from "./EntityNode";
import { Button, Grid, makeStyles, Paper } from "@material-ui/core";
import PopUp from "../../components/PopUp";

import { metadata } from "./metadata";
import SelectField from "../../components/SelectField";
import { getHandlerBindedMetaData, verifyFormState } from "../../utils/common";
import AlertBox from "../../components/AlertBox";
import VerticalAlignedFields from "../../components/VerticalAlignedFields";
import HorizontalAlignedButtons from "../../components/HorizontalAlignedButtons";
import {
  addWorkflow,
  removeWorkflow,
} from "../../store/actions/workflowDesignerAction";

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  gridPadding: {
    padding: theme.spacing(1),
  },
  topMargin: {
    marginTop: theme.spacing(1),
  },
}));

let id = 0;
const getId = () => `node ${id++}`;

const WorkflowDesigner = () => {
  const classes = useStyles();

  const workflowList = useSelector((state) => state.workflowList);
  const dispatch = useDispatch();

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [elements, setElements] = useState([]);
  const [popUp, setPopUp] = useState({ open: false, content: {} });
  const [selectType, setSelectType] = useState(null);
  const [alertBox, setAlertBox] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const nodeMapData = useRef(new Map([[null, new Set()]]));
  const reactFlowWrapper = useRef(null);
  const nodePosition = useRef();
  const refState = useRef({});
  const selectTypeRef = useRef(null);
  const editEntityId = useRef(null);

  const nodeTypes = _.mapValues(metadata.entities, () => EntityNode);

  const onChangeHandler = (path, event) => {
    updateFormElementState(
      path,
      event.target.name,
      "value",
      event.target.value
    );
  };

  const onBlurHandler = () => {};

  const [state, setState] = useState(() =>
    getHandlerBindedMetaData.call({ onChangeHandler, onBlurHandler }, metadata)
  );

  useEffect(() => {
    refState.current = _.cloneDeep(state);
  }, [state]);

  const updateFormElementState = (path, name, propName, value) => {
    setState((prevState) => {
      const shallowClonedState = { ...prevState };
      const clonedField = _.clone(
        _.get(shallowClonedState, `${path}.${name}`, true)
      );

      _.set(clonedField, propName, value);
      _.set(shallowClonedState, `${path}.${name}`, clonedField);
      refState.current = shallowClonedState;
      return shallowClonedState;
    });
  };

  const onConnect = (params) => {
    setElements((els) =>
      addEdge(
        {
          ...params,
          type: "edge",
          arrowHeadType: "arrowclosed",
          style: { strokeWidth: 3 },
        },
        els
      )
    );
    if (nodeMapData.current.has(params.source)) {
      nodeMapData.current.get(params.source).add(params.target);
    } else {
      nodeMapData.current.set(params.source, new Set([params.target]));
    }
    nodeMapData.current.get(null).delete(params.target);
  };

  const onElementsRemove = (elementsToRemove) => {
    setElements((els) => removeElements(elementsToRemove, els));
    _.forEachRight(elementsToRemove, (el) => {
      if (el.type === "edge") {
        nodeMapData.current.get(el.source).delete(el.target);
        if (nodeMapData.current.get(el.source).size === 0) {
          nodeMapData.current.delete(el.source);
        }
        nodeMapData.current.get(null).add(el.target);
      } else {
        nodeMapData.current.get(null).delete(el.id);
      }
    });
  };

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onEntityClick = async (data) => {
    setSelectType(data.type);
    selectTypeRef.current = data.type;
    editEntityId.current = data.id;

    setState((prev) => {
      const copyState = _.cloneDeep(prev);
      _.set(copyState, data.type, data.details);
      refState.current = copyState;
      return copyState;
    });

    setPopUp({
      open: true,
      content: {
        title: "Enter Entity Properties",
        actionItems: actionItemsEditEntity,
      },
    });
  };

  const onEditEntity = () => {
    if (
      !verifyFormState.call(
        { state: refState.current, updateFormElementState },
        selectTypeRef.current
      )
    ) {
      return;
    }
    setPopUp({ open: false });
    setElements((els) =>
      els.map((el) => {
        if (el.id === editEntityId.current) {
          el.data.details = refState.current[selectTypeRef.current];
        }
        return el;
      })
    );
  };
  const onAddNewEntity = () => {
    if (
      !verifyFormState.call(
        { state: refState.current, updateFormElementState },
        selectTypeRef.current
      )
    ) {
      return;
    }
    setPopUp({ open: false });
    const id = getId();
    const newNode = {
      id,
      type: selectTypeRef.current,
      position: nodePosition.current,
      data: {
        label: `${selectTypeRef.current} ${id}`,
        type: selectTypeRef.current,
        id,
        details: refState.current[selectTypeRef.current],
        onEntityClickHandler: onEntityClick,
      },
    };
    setState(() =>
      getHandlerBindedMetaData.call(
        { onChangeHandler, onBlurHandler },
        metadata
      )
    );

    setElements((es) => es.concat(newNode));
    nodeMapData.current.set(null, nodeMapData.current.get(null).add(id));
  };

  const onDrop = async (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    nodePosition.current = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const type = event.dataTransfer.getData("application/reactflow");
    setSelectType(type);
    selectTypeRef.current = type;

    setPopUp({
      open: true,
      content: {
        title: "Enter Entity Properties",
        actionItems: actionItemsAddEntity,
      },
    });
  };

  const onSaveClick = async () => {
    if (!validateWorkflow()) {
      return;
    }

    setSelectType("saveField");
    selectTypeRef.current = "saveField";

    setPopUp({
      open: true,
      content: {
        title: "Save Workflow",
        actionItems: actionItemsSaveWorkflow,
      },
    });
  };

  const onSaveWorkflow = () => {
    const workflowName =
      _.get(refState.current, "saveField.workflowName.value", "") ||
      "SampleReport";

    let newNodeMapData = new Map([[null, new Set()]]);
    nodeMapData.current.forEach((value, key) => {
      newNodeMapData.set(key, new Set(value));
    });

    dispatch(
      addWorkflow({
        name: workflowName,
        value: { workflow: elements, nodeMap: newNodeMapData },
      })
    );

    setAlertBox({
      show: true,
      message: `Successfully saved the workflow: ${workflowName}`,
      severity: "success",
    });
  };

  const validateWorkflow = () => {
    if (_.size(nodeMapData.current.get(null)) > 1) {
      setAlertBox({
        show: true,
        message:
          "Entities are to be connected in any given model for a meaningful Transaction workflow",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const onDownoadClick = async () => {
    if (!validateWorkflow()) {
      return;
    }

    setSelectType("exportField");
    selectTypeRef.current = "exportField";

    setPopUp({
      open: true,
      content: {
        title: "Download Workflow",
        actionItems: actionItemsDownloadWorkflow,
      },
    });
  };

  const printPreorder = (node, data) => {
    if (nodeMapData.current.has(node)) {
      const values = nodeMapData.current.get(node);
      _.forEach(Array.from(values), (n) => {
        const element = elements.find((el) => el.id === n);
        if (element) {
          data.push(_.mapValues(element.data.details, "value"));
        }
        printPreorder(n, data);
      });
    }
    return;
  };

  const onDownloadWorkflow = () => {
    const downloadFileName =
      _.get(refState.current, "exportField.fileName.value", "") ||
      "SampleReport";
    const exportType = "json";
    const data = [];
    printPreorder(null, data);
    exportFromJSON({
      data: { transactionWorkflow: data },
      fileName: downloadFileName,
      exportType,
    });
  };

  const onDeleteWorkFlow = () => {
    dispatch(removeWorkflow(selectedWorkflow));
    onClear();

    setAlertBox({
      show: true,
      message: `Successfully deleted the workflow: ${selectedWorkflow}`,
      severity: "success",
    });
  };

  const onClear = () => {
    setSelectedWorkflow("");
    setElements([]);
    nodeMapData.current = new Map([[null, new Set()]]);
  };

  const handleAllWorkflowSelectChange = (event) => {
    setSelectedWorkflow(event.target.value);
    const fetchData = workflowList.get(event.target.value);
    if (fetchData) {
      setElements(_.cloneDeep(fetchData.workflow) || []);
      let newNodeMapData = new Map([[null, new Set()]]);

      fetchData.nodeMap.forEach((value, key) => {
        newNodeMapData.set(key, new Set(value));
      });
      nodeMapData.current = newNodeMapData;
    }
  };

  const popUpFrom = useCallback(
    () => <VerticalAlignedFields formState={state[selectType]} />,
    [state, selectType]
  );

  const actionItemsTopButtons = useMemo(
    () => [
      {
        actionHandler: onClear,
        name: "Clear",
        actionType: "primary",
        variant: "contained",
        size: "small",
        startIcon: <ClearIcon />,
      },
      {
        actionHandler: onSaveClick,
        name: "Save",
        actionType: "primary",
        variant: "outlined",
        size: "small",
        startIcon: <SaveIcon />,
        disabled: _.size(elements) === 0,
      },
      {
        actionHandler: onDownoadClick,
        name: "Export",
        actionType: "primary",
        variant: "outlined",
        size: "small",
        startIcon: <GetAppIcon />,
        disabled: _.size(elements) === 0,
      },
    ],
    [elements]
  );
  const actionItemsAddEntity = [
    {
      actionHandler: () => {
        setPopUp({ open: false });
      },
      name: "Cancel",
      actionType: "primary",
      variant: "outlined",
    },
    {
      actionHandler: onAddNewEntity,
      name: "Ok",
      actionType: "primary",
      variant: "contained",
      disableElevation: "true",
      autoFocus: true,
    },
  ];

  const actionItemsEditEntity = [
    {
      actionHandler: () => {
        setPopUp({ open: false });
      },
      name: "Cancel",
      actionType: "primary",
      variant: "outlined",
    },
    {
      actionHandler: onEditEntity,
      name: "Ok",
      actionType: "primary",
      variant: "contained",
      disableElevation: "true",
      autoFocus: true,
    },
  ];
  const actionItemsSaveWorkflow = [
    {
      actionHandler: () => {
        setPopUp({ open: false });
      },
      name: "Cancel",
      actionType: "primary",
      variant: "outlined",
    },
    {
      actionHandler: () => {
        setPopUp({ open: false });
        onSaveWorkflow();
      },
      name: "Ok",
      actionType: "primary",
      variant: "contained",
      disableElevation: "true",
      autoFocus: true,
    },
  ];
  const actionItemsDownloadWorkflow = [
    {
      actionHandler: () => {
        setPopUp({ open: false });
      },
      name: "Cancel",
      actionType: "primary",
      variant: "outlined",
    },
    {
      actionHandler: () => {
        setPopUp({ open: false });
        onDownloadWorkflow();
      },
      name: "Ok",
      actionType: "primary",
      variant: "contained",
      disableElevation: "true",
      autoFocus: true,
    },
  ];

  return (
    <>
      {popUp.open && (
        <PopUp
          id="popUp"
          open={popUp.open}
          setOpen={(value) => setPopUp({ open: value })}
          actionItems={popUp.content.actionItems || []}
          title={popUp.content.title}
        >
          {popUpFrom()}
        </PopUp>
      )}
      {alertBox.show && (
        <AlertBox setAlert={(value) => setAlertBox(value)} {...alertBox} />
      )}
      <Grid container className={classes.gridPadding} alignItems="center">
        <Grid item xs={2}>
          <SelectField
            label="All Workflows"
            value={selectedWorkflow}
            onChange={handleAllWorkflowSelectChange}
            options={Array.from(workflowList.keys())}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            className={classes.button}
            onClick={onDeleteWorkFlow}
            color="primary"
            variant="outlined"
            disabled={!selectedWorkflow}
            size="small"
            startIcon={<DeleteForeverIcon />}
          >
            Delete
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Grid container justifyContent="flex-end">
            <HorizontalAlignedButtons actionItems={actionItemsTopButtons} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} className={classes.topMargin}>
            <ReactFlowProvider>
              <Grid container>
                <Grid
                  item
                  xs={10}
                  ref={reactFlowWrapper}
                  style={{
                    height: "75vh",
                  }}
                >
                  <ReactFlow
                    elements={elements}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onLoad={onLoad}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    deleteKeyCode={46}
                  >
                    <MiniMap />
                    <Background variant="lines" gap={20} size={1} />
                    <Controls />
                  </ReactFlow>
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{
                    borderLeft: "1px solid black",
                  }}
                >
                  <Sidebar />
                </Grid>
              </Grid>
            </ReactFlowProvider>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default WorkflowDesigner;
