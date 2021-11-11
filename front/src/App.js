import React, { useEffect ,useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./comp/header/Header";
import ConfirmEmail from "./pages/ConfirmEmail";
import Home from "./pages/Home";
import { connect } from "react-redux";
import axios from "axios";
import { Component } from "react";

import ConnectedHome from "./pages/ConnectedHome";

class App extends Component {
  state = {
    message: "",
    error: "",
    eee: "",
    text: ""
  };

  

  render() {
    return (
      <Router>
        <Route path="/auth/register/emailconfirmation">
          <Header />
          <ConfirmEmail />
        </Route>
        <div className="app">
          <Switch>
            {!this.props.isAuth ? (
              <>
                <Route path="/" exact>
                  <Header />
                  <Home />
                </Route>
              </>
            ) : (
              <Route path="/" exact>
                <Header />
                <ConnectedHome />
              </Route>
            )}
          </Switch>
        </div>
      </Router>
    );
  }
}
function mapStateToProps(state) {
  return {
    isAuth: state.auth,
  };
}
export default connect(mapStateToProps)(App);
