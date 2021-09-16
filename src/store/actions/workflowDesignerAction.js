import * as actions from "./actionTypes";

export const addWorkflow = (payload) => {
  return {
    type: actions.ADD_WORKFLOW,
    payload: payload,
  };
};

export const removeWorkflow = (payload) => {
  return {
    type: actions.REMOVE_WORKFLOW,
    payload,
  };
};
