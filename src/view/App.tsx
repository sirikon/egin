import React from "react";
import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";

import Book from "./components/Book/Book";
import Home from "./components/Home/Home"

export default () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/:backend/:name">
          <Book />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  );
};
