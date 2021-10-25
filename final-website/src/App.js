import React, { Component  } from "react";
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

class App extends Component {

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
                  src={require("./resources/logo.png")}
                  alt="MFR"
                />
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
                src={require("./resources/logo.png")}
                width="3%"
                alt="MFR"
                className="main-page-logo"
              ></img>
              <div className="logo">Myntra For Retailers</div>

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
                          </div>
                        </ResultCard.Description>
                      </ResultCard>
                    ))}
                  </ReactiveList.ResultCardsWrapper>
                )}
              />
            </div>
          </div>

        </ReactiveBase>

      </div>
    );

  }
}

export default App;
