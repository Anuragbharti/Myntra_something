import React, { Component } from "react";
import "./login.css";
import firebase from "./config/fire";
import { Link } from "react-router-dom";
import Toast from "./Toast"
import checkIcon from './resources/check.svg';
import errorIcon from './resources/error.svg';
import infoIcon from './resources/info.svg';
import warningIcon from './resources/warning.svg';
import GoogleLogin from 'react-google-login';
//import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    // this.redirectToHome = this.redirectToHome(this);
    this.state = {
      email: "",
      password: "",
      toastList: []
    };
  }

  showToast(description,type) {
    const id = Math.floor((Math.random() * 101) + 1);
    var toastProperties = null

    var toastListTemp = this.state.toastList

    switch(type) {
      case 'success':
        toastProperties = {
          id,
          title: 'Success',
          description: description,
          backgroundColor: '#5cb85c',
          icon: checkIcon
        }
        break;
      case 'danger':
        toastProperties = {
          id,
          title: 'Danger',
          description: description,
          backgroundColor: '#d9534f',
          icon: errorIcon
        }
        break;
      case 'info':
        toastProperties = {
          id,
          title: 'Info',
          description: description,
          backgroundColor: '#5bc0de',
          icon: infoIcon
        }
        break;
      case 'warning':
        toastProperties = {
          id,
          title: 'Warning',
          description: description,
          backgroundColor: '#f0ad4e',
          icon: warningIcon
        }
        break;

        default:
          this.setState({
            toastList : []
          });
    }
    toastListTemp.push(toastProperties)

    this.setState({
      toastList : toastListTemp
    });
  }

  validatePassword(password) {
    // Do not show anything when the length of password is zero.
    if (password.length <= 7) {
      return false;
    }
    // Create an array and push all possible values that you want in password
    var matchedCase = new Array();
    matchedCase.push("[$@$!%*#?&]"); // Special Charector
    matchedCase.push("[A-Z]"); // Uppercase Alpabates
    matchedCase.push("[0-9]"); // Numbers
    matchedCase.push("[a-z]"); // Lowercase Alphabates

    // Check the conditions
    var ctr = 0;
    for (var i = 0; i < matchedCase.length; i++) {
      if (new RegExp(matchedCase[i]).test(password)) {
        ctr++;
      }
    }
    // Display it
    var strength = "";
    // eslint-disable-next-line default-case
    switch (ctr) {
      case 0:
      case 1:
      case 2:
        strength = "Very Weak";
        break;
      case 3:
        strength = "Medium";
        break;
      case 4:
        strength = "Strong";
        break;
    }
    if (strength === "Strong") return true;
    else return false;
  }

  login(e) {
    if (e) e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        this.props.history.push("/");
        console.log(u);
      })
      .catch((err) => {
        console.log(err);
        this.showToast("Invalid Email or Password","danger");
      });
  }

  signInWithGoogle(e){
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => { 
      firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log(result)

        // Auth.setLoggedIn(true)
        this.props.history.push("/");
      })
      .catch(e => alert(e.message))
    })
  }

  redirectToHome(response) {
    this.props.history.push("/")
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  signup(e) {
    e.preventDefault();
    var validate = this.validatePassword(this.state.password);
    if (validate === true) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
          console.log(u);
          this.props.history.push("/");
        })
        .catch((err) => {
          console.log(err);
          this.showToast(err.message,"danger");
        });
    } else {
      alert(
        "Minimum password length required = 8 \nThe Password must contain atleast: \n- 1 Special Character \n- 1 Upper Case Alphabet \n- 1 Lower Case alphabet \n- 1 Number \n ");
    }
  }

  render() {
    return (
      <div class="lbody">
        <Link to="/" className="llogo">
          <img
            border=""
            alt="ShopEasy"
            src={require("./resources/shopeasy_logo.png")}
          ></img>
        </Link>
        <form className="form-container">
          <h1>Log into your account</h1>
          <h2 className="email-lable">Email address</h2>
          <input
            className="email-box"
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <h2 className="pass-lable">Password</h2>
          <input
            className="pass-box"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          <button class="btn btn-lg btn-google btn-block text-uppercase"  onClick={this.signInWithGoogle}>SIGN IN WITH GOOGLE</button>
          {/* <GoogleLogin
            clientId="396721888537-qlbuku6l8dte7iv7rhb9d4licctgvfem.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            className="btn-google"
            theme="dark"
            onSuccess={this.redirectToHome}
            // onFailure={(resp) => this.showToast("Some error occured","danger")}
          /> */}
        {/* <div class="google-btn" onClick={() => this.signInWithGoogle()}>
          <div class="google-icon-wrapper">
            <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
          </div>
          <p class="btn-text"><b>Sign in with google</b></p>
        </div> */}

          <button onClick={this.login} className="btt-login">
            LOGIN
          </button>
          <button onClick={this.signup} className="btt-signup">
            SIGNUP
          </button>
        </form>
        <Toast
          toastList={this.state.toastList}
          position="bottom-right"
          autoDelete={true}
      />
      </div>
    );
  }
}
export default Login;
