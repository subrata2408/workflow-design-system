import produce, { enableMapSet } from "immer";
import * as actions from "../actions/actionTypes";

enableMapSet();

const workFlowDesignerReducer = (
  state = {
    workflowList: new Map([
      ["None", { workflow: [], nodeMap: new Map([[null, new Set()]]) }],
    ]),
  },
  action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.ADD_WORKFLOW:
        draft.workflowList.set(action.payload.name, action.payload.value);
        break;
      case actions.REMOVE_WORKFLOW:
        draft.workflowList.delete(action.payload);
        break;
      default:
        break;
    }
  });

export default workFlowDesignerReducer;
