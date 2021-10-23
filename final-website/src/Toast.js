import React, { Component,useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './Toast.css';


class Toast extends Component {
    constructor(props) {
      super(props);
      const toastList = props.toastList;
      const position = props.position;
      this.state = {
        list : toastList,
        position : position
      }
    }

    deleteToast(id) {
        var list = this.state.list
        const listItemIndex = list.findIndex(e => e.id === id);
        list.splice(listItemIndex, 1);
        this.setState({
            list : list
        })
      }
  
    componentDidMount() {
      const interval = setInterval(() => {
          if (this.state.list.length) {
              this.deleteToast(this.state.list[0].id);
          }
      },7000);
  
      return () => {
          clearInterval(interval);
      }
    }

    render() {
      return (
              <div className={`notification-container ${this.state.position}`}>
                  <div>{console.log(this.state.list)}</div>
                  {
                      this.state.list.map((toast, i) =>
                          <div
                              key={i}
                              className={`notification toast ${this.state.position}`}
                              style={{ backgroundColor: toast.backgroundColor }}
                          >
  
                              <button onClick={() => this.deleteToast(toast.id)}>
                                  X
                              </button>
                              <div className="notification-image">
                                  <img src={toast.icon} alt="" />
                              </div>
                              <div>
                                  <p className="notification-title">{toast.title}</p>
                                  <p className="notification-message">
                                      {toast.description}
                                  </p>
                              </div>
                          </div>
                      )
                  }
              </div>
      );
    }
  }



export default Toast;
