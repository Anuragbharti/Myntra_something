import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Login";
import Contact from "./Contact";
import Wishlist from "./Wishlist";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/Login" component={Login} />
      <Route path="/Contact" component={Contact} />
      <Route path="/Wishlist" component={Wishlist}/>
    </div>
  </Router>,
  document.getElementById("root")
);
