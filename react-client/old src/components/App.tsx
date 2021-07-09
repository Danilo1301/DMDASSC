import * as React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Chat from "./Chat/Chat";
import MouseGame from "./MouseGame";
import { Navbar } from "./Navbar";

//const reactLogo = require("./../assets/img/react_logo.svg");
import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <>
        <Router>
          <Switch>
          <Route path="/login" exact>
              <h1>LOGIN</h1>
            </Route>

            <Route path="/mousegame" exact>
            <Navbar></Navbar>

              <MouseGame></MouseGame>
            </Route>

            <Route path="/chat" exact>
              <Chat></Chat>
            </Route>

            <Route path="/" exact>
              <Navbar></Navbar>
            </Route>

            <Route path="*" exact>
              <Navbar></Navbar>
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
