import React from "react";
import { HashRouter as Router, Route } from "react-keeper";

const App = require("./render/app").default;

export default () => (
  <Router>
    <Route index path="/" component={App}/>
  </Router>
);
