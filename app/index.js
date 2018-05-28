import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './app.global.css';
import { HashRouter as Router, Route } from "react-keeper";
import App from './render/app'
import './custom.less'

render(
  <AppContainer>
    <Router>
      <Route index path="/" component={App}/>
    </Router>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept("./render/app", () => {
    const NextRoot = require("./render/app").default; // eslint-disable-line global-require
    render(
      <AppContainer>
        <Router>
          <Route index path="/" component={NextRoot}/>
        </Router>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
