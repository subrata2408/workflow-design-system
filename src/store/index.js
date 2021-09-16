import { createStore } from "redux";
import workFlowDesignerReducer from "./reducers/workFlowDesignerReducer";

const store = createStore(workFlowDesignerReducer);

export default store;
