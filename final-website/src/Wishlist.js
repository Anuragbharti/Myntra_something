import React, { Component } from "react";
import firebase from "./config/fire";
import "./wishlist.css";
import { Link } from "react-router-dom";
import App from "./App";
class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlistData: [],
      user_id: null,
      user_email: "",
    };
  }

  componentDidMount() {
    this.authLister();
    // this.getWishlist();
  }

  logout() {
    firebase.auth().signOut();
  }

  authLister() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user_id: user.uid, user_email: user.email });
        var data = [];
        var uid;

        firebase
          .firestore()
          .collection("users")
          .doc(this.state.user_id)
          .collection("wishlist")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              var newData = JSON.stringify(doc.data());
              var json_doc = JSON.parse(newData);
              json_doc.id = doc.id;
              data.push(json_doc);
            });

            this.setState({
              wishlistData: data,
            });
            console.log(data);
          });
      }
    });
  }

  refreshPage() {
    window.location.reload(false);
  }

  removeFromWishlist(e, doc_id) {
    e.preventDefault();
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user_id)
      .collection("wishlist")
      .doc(doc_id)
      .delete()
      .then(() => {
        this.authLister();
      })
      .catch(function(err) {
        console.log("FAIL" + err);
      });
  }

  render() {
    return (
      <div className="wishlist-body">
        <div className="top">
          <div className="left">
            <a href="/">
              {" "}
              {/*homepage link*/}
              {/* <img border="" alt="ShopEasy" src={require("./resources/shopeasy_logo.png")}></img> if image not visible use this*/}
              <img
                alt="ShopEasy"
                src={require("./resources/shopeasy_logo_xs.png")}
                style={{ width: "100px", margin: "1%" }}
                width="100px"
              />
            </a>
            <h1>Your Wishlist</h1>
          </div>
          <div className="right">
            <h3>{this.state.user_email}</h3>
            <Link to="/">
              <button onClick={this.logout} className="bt-login">
                LOGOUT
              </button>
            </Link>
          </div>
        </div>
        {this.state.wishlistData.length ? (
          <div className="list">
            {this.state.wishlistData.map((data) => (
              <div className="product">
                <div> {console.log(data)}</div>
                <a href={data.product_url}>
                  <div className="product-con">
                    <img
                      src={data.image_url}
                      alt="Image Unavailable"
                      className="product-image"
                    />
                  </div>
                  <div className="details">
                    <h2>{data.name}</h2>
                    <p className="price">Price : Rs. {data.price} </p>
                    <p className="source-website">
                      <span>Website : </span>
                      <span>{data.source}</span>
                    </p>
                  </div>
                </a>
                <button>
                  <a rel="stylesheet" href="#">
                    <img
                      src={require("./resources/cross.png")}
                      alt="Remove item"
                      className="close"
                      onClick={(e) => this.removeFromWishlist(e, data.id)}
                    />
                  </a>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="wishlist-heading ">
            Your Wishlist is empty right now !
          </h1>
        )}
      </div>
    );
  }
}

export default Wishlist;
