import React, { Component } from "react";
import fire from "./config/fire";
import "./contact.css";
import { Link } from "react-router-dom";
import Toast from "./Toast";
import checkIcon from "./resources/check.svg";
import errorIcon from "./resources/error.svg";
import infoIcon from "./resources/info.svg";
import warningIcon from "./resources/warning.svg";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.sendtofire = this.sendtofire.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      name: "",
      query: "",
      toastList: [],
    };
  }

  showToast(description, type) {
    const id = Math.floor(Math.random() * 101 + 1);
    var toastProperties = null;

    var toastListTemp = this.state.toastList;

    switch (type) {
      case "success":
        toastProperties = {
          id,
          title: "Success",
          description: description,
          backgroundColor: "#5cb85c",
          icon: checkIcon,
        };
        break;
      case "danger":
        toastProperties = {
          id,
          title: "Danger",
          description: description,
          backgroundColor: "#d9534f",
          icon: errorIcon,
        };
        break;
      case "info":
        toastProperties = {
          id,
          title: "Info",
          description: description,
          backgroundColor: "#5bc0de",
          icon: infoIcon,
        };
        break;
      case "warning":
        toastProperties = {
          id,
          title: "Warning",
          description: description,
          backgroundColor: "#f0ad4e",
          icon: warningIcon,
        };
        break;

      default:
        this.setState({
          toastList: [],
        });
    }
    toastListTemp.push(toastProperties);

    this.setState({
      toastList: toastListTemp,
    });
  }

  sendtofire(e) {
    e.preventDefault();
    fire
      .firestore()
      .collection("ContactForm")
      .add({
        Email: this.state.email,
        Name: this.state.name,
        Query: this.state.query,
      });
    this.setState({
      email: "",
      name: "",
      query: "",
    });
    this.showToast("Thank You for submitting!", "success");
  }
  /*
  fire
      .firestore()
      .collection("WishList")
      .add(user)

  */

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="contact-body">
        <div class="ctop">
          <Link to="/">
            <img
              alt="FIS"
              className="clogo"
              src={require("./resources/hummingbird.svg")}
            ></img>
          </Link>
          <p>
            <h3>Team Name: FlipBlitz</h3>
            <h3>Team Leader: Pratyush Goel</h3>
            <h3>Team Member: Shrey Shah and Aditya Vishwakarma</h3>
          </p>
        </div>

        <div className="crest">
          <div className="cform-container">
            <h1 classname="contact-h1">Drop us a line.</h1>
            <form id="contact-us-form" onSubmit={this.sendtofire}>
              <label for="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                name="name"
                placeholder="Enter Name"
                onChange={this.handleChange}
                value={this.state.name}
                required
              />
              <label for="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                name="email"
                placeholder="Enter Email Address"
                onChange={this.handleChange}
                value={this.state.email}
                required
              />
              <label for="query">Message</label>
              <textarea
                name="query"
                id="query"
                cols="45"
                rows="8"
                placeholder="Enter Your Query Here"
                onChange={this.handleChange}
                value={this.state.query}
                required
              ></textarea>

              <input type="submit" value="SUBMIT" />
            </form>
          </div>
          <img src={require("./resources/test.png")} alt="" class="cill"></img>
        </div>
        <Toast
          toastList={this.state.toastList}
          position="bottom-right"
          autoDelete={true}
        />
      </div>
    );
  }
}

export default Contact;
