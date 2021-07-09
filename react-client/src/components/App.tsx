import * as React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//const reactLogo = require("./../assets/img/react_logo.svg");
//import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <>
        <Router>
          <Switch>
            <Route path="/" exact>
              <span>Home</span>
            </Route>

            <Route path="*" exact>
              <h1 className="mt-5 text-center">Page not found</h1>
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
