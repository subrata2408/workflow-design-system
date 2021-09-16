import Layout from "./hoc/Layout";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import WorkFlowDesigner from "./containers/WorkflowDesigner";

function App() {
  return (
    <div>
      <Layout>
        <Switch>
          <Route exact path="/workfowdesigner" component={WorkFlowDesigner} />
          <Route path="/" component={Home} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
