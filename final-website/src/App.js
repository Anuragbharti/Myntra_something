import React, { Component, useState } from "react";
import MediaQuery from "react-responsive";
import {
  ReactiveBase,
  DataSearch,
  MultiList,
  RangeSlider,
  SelectedFilters,
  ResultCard,
  ReactiveList,
} from "@appbaseio/reactivesearch";
import "./App.css";
import { css } from "emotion";
import fire from "./config/fire";
import Toast from "./Toast";
import { Link } from "react-router-dom";
import checkIcon from "./resources/check.svg";
import errorIcon from "./resources/error.svg";
import infoIcon from "./resources/info.svg";
import warningIcon from "./resources/warning.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isLogin: false,
      toastList: [],
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    fire.auth().signOut();
  }

  componentDidMount() {
    this.authLister();
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

  authLister() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user, isLogin: true });
      } else this.setState({ user: null, isLogin: false });
    });
  }

  addToWishList(e, item) {
    e.preventDefault();
    console.log("user id: " + fire.auth().currentUser.uid);
    var user_id = fire.auth().currentUser.uid;
    var item_id = item._id;
    var userRef = fire
      .firestore()
      .collection("users")
      .doc(user_id)
      .collection("wishlist")
      .doc(item_id);

    userRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        this.showToast(
          "This element is already present in the wishlist",
          "info"
        );
      } else {
        userRef
          .set({
            name: item.product_name,
            image_url: item.image,
            source: item.source,
            price: item.price,
            product_url: item.url,
          })
          .then(function() {
            console.log("Document successfully written!");
          }, this.showToast("Item successfully added to wishlist", "success"))
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    });
  }

  render() {
    return (
      <div>
        <ReactiveBase
          app="fashion-intelligence-system"
          credentials="lx04G0Z0r:fa7788a7-efdd-47fb-97c6-fad302fd0574"
        >
          <MediaQuery maxWidth={600} className="media-query">
            <div className="navbar-mobile">
              <div className="navbar-mobile-column">
                <img
                  className="logo-img-mobile"
                  src={require("./resources/hummingbird.svg")}
                  alt="FIS"
                />
                <div className="navbar-mobile-buttons">
                  {this.state.user ? (
                    <Link to="/Wishlist">
                      <button className="bt-mobile home-login">WISHLIST</button>
                    </Link>
                  ) : null}

                  {this.state.user ? (
                    <button
                      className="bt-mobile home-login"
                      onClick={this.logout}
                    >
                      LOGOUT
                    </button>
                  ) : (
                    <Link to="/Login">
                      <button className="bt-mobile home-login">
                        LOGIN / SIGNUP
                      </button>
                    </Link>
                  )}
                  <Link to="Contact">
                    <button className="bt-mobile home-login">CONTACT US</button>
                  </Link>
                </div>
              </div>

              <div className="search-bar">
                <DataSearch
                  className="datasearch"
                  componentId="mainSearch"
                  dataField={["product_name", "product_name.search"]}
                  queryFormat="and"
                  placeholder="Search for a product"
                  innerClass={{
                    input: "mobilebox",
                    list: "suggestionlist",
                  }}
                  autosuggest={false}
                  iconPosition="left"
                  filterLabel="search"
                />
              </div>
            </div>
          </MediaQuery>

          <MediaQuery minDeviceWidth={600}>
            <div className="navbar">
              <img
                src={require("./resources/hummingbird.svg")}
                width="3%"
                className="main-page-logo"
              ></img>
              <div className="logo">FIS</div>

              <DataSearch
                className="datasearch"
                componentId="mainSearch"
                dataField={["Title", "Title.search"]}
                queryFormat="and"
                placeholder="Search for a product or category"
                innerClass={{
                  input: "searchbox",
                  list: "suggestionlist",
                }}
                autosuggest={false}
                iconPosition="left"
                filterLabel="search"
              />

              {/* {this.state.user ? (
                <Link to="/Wishlist">
                  <button className="navbar-buttons">WISHLIST</button>
                </Link>
              ) : null} */}

              {/* {this.state.user ? (
                <button className="navbar-buttons" onClick={this.logout}>
                  LOGOUT
                </button>
              ) : (
                <Link to="/Login">
                  <button className="navbar-buttons">LOGIN / SIGNUP</button>
                </Link>
              )} */}
              <Link to="Contact">
                <button className="navbar-buttons">CONTACT US</button>
              </Link>
            </div>
          </MediaQuery>

          <div className={"display"}>
            <div className={"leftSidebar"}>
              <RangeSlider
                componentId="priceFilter"
                dataField="Price"
                title="Price Range"
                filterLabel="prices"
                range={{
                  start: 9,
                  end: 5300,
                }}
                rangeLabels={{
                  start: "\u00A3 0",
                  end: "\u00A3 5300",
                }}
                interval={100}
              />
              <RangeSlider
                componentId="currenttrendFilter"
                dataField="Current_trend"
                title="Current Trend Range"
                filterLabel="current trend"
                range={{
                  start: 1.5,
                  end: 77,
                }}
                rangeLabels={{
                  start: "0",
                  end: "100",
                }}
                interval={10}
              />
              <RangeSlider
                componentId="forecasttrendFilter"
                dataField="Forecast_trend"
                title="Forecast Trend Range"
                filterLabel="forecast trend"
                range={{
                  start: 0.5,
                  end: 88,
                }}
                rangeLabels={{
                  start: "0",
                  end: "100",
                }}
                interval={10}
              />
              <MultiList
                componentId="Categories"
                dataField="Category"
                class="filter"
                title="Select Category"
                selectAllLabel="All Category"
              />
              <MultiList
                componentId="Source"
                dataField="Brand"
                class="filter"
                title="Select Brand"
                selectAllLabel="All Brands"
              />

              <MultiList
                componentId="Site"
                dataField="Site"
                class="filter"
                title="Select Site"
                selectAllLabel="All Sites"
              />
            </div>
            <div className={"mainBar"}>
              <MediaQuery minDeviceWidth={600}>
                <SelectedFilters />
              </MediaQuery>
              <ReactiveList
                componentId="SearchResult"
                dataField={["Title", "Title.search"]}
                size={10}
                pagination
                Loader="Loading..."
                noResults="No results were found..."
                sortOptions={[
                  {
                    dataField: "Current_trend",
                    sortBy: "desc",
                    label: "Sort by Current leading trend \u00A0",
                  },
                  {
                    dataField: "Current_trend",
                    sortBy: "asc",
                    label: "Sort by Current lagging trend\u00A0 \u00A0",
                  },
                  {
                    dataField: "Forecast_trend",
                    sortBy: "desc",
                    label: "Sort by Future leading trend \u00A0",
                  },
                  {
                    dataField: "Forecast_trend",
                    sortBy: "asc",
                    label: "Sort by Future lagging trend\u00A0 \u00A0",
                  },
                ]}
                innerClass={{
                  sortOptions: "sort-options",
                  poweredBy: css({
                    display: "none !important",
                  }),
                }}
                react={{
                  and: [
                    "mainSearch",
                    // "ratingsFilter",
                    "priceFilter",
                    "currenttrendFilter",
                    "forecasttrendFilter",
                    "Source",
                    "Categories",
                    "Site",
                  ],
                }}
                render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                    {data.map((item) => (
                      <ResultCard key={item._id} href={item.Title_URL}>
                        <ResultCard.Image src={item.Image} />
                        <ResultCard.Title>
                          <div
                            className="product-title"
                            dangerouslySetInnerHTML={{
                              __html: item.Title,
                            }}
                          />
                        </ResultCard.Title>

                        <ResultCard.Description>
                          <div className="flex column justify-space-between">
                            <div className="ratings-list flex align-center">
                              <span className="price">
                                <span>&#163;</span> {item.Price}
                              </span>
                            </div>
                            <span className="source">Website: {item.Site}</span>
                            {/* <div className="add-to-wishlist">
                              {this.state.user ? (
                                <button
                                  className="bt-wishlist"
                                  onClick={(e) => this.addToWishList(e, item)}
                                >
                                  ADD TO WISHLIST
                                </button>
                              ) : (
                                <Link to="/Login">
                                  <button className="bt-wishlist">
                                    {" "}
                                    ADD TO WISHLIST
                                  </button>
                                </Link>
                              )}
                            </div> */}
                          </div>
                        </ResultCard.Description>
                      </ResultCard>
                    ))}
                  </ReactiveList.ResultCardsWrapper>
                )}
              />
            </div>
          </div>
          <div> {console.log(this.state.isLogin)}</div>
        </ReactiveBase>
        <div> {console.log(this.state.toastList)}</div>

        <Toast
          toastList={this.state.toastList}
          position="bottom-right"
          autoDelete={true}
        />
      </div>
    );
  }
}

export default App;
