import React, { Component } from "react";
import API from "../API";
import { withRouter, Link } from "react-router-dom";
import "../css/expertCard.css";
import defaultPic from "../public/defaultpic.png";

class ExpertCard extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.faved);
    this.state = {
      faved: this.props.faved,
    };
    this.handleFav = this.handleFav.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage() {
    this.props.history.push({
      pathname: "/chats",
      data: this.props.expert._id,
    });
  }

  async handleFav(evt) {
    evt.preventDefault();
    this.setState({ faved: !this.state.faved });
    const data = await API.post("/expert/wishlist", {
      expertId: this.props.expert._id,
      userId: this.props.user._id,
    });
    console.log(data);
  }

  render() {
    let usertype = false;
    if (this.props.user === undefined) usertype = true;
    else if (this.props.user.type === "USER") usertype = true;
    const { expert, slot_ready } = this.props;
    return (
      <div className="Expert-Card">
        <div className="info">
          <img
            src={expert.pic === "defaultpic" ? defaultPic : expert.pic}
            alt="profpic"
          />
          <h3>{expert.name}</h3>
          <h3>{expert.institution}</h3>
          <h3>{expert.branch}</h3>
          {!usertype ? null : (
            <div className="btn-container">
              {!slot_ready ? (
                <button
                  className="book-slot-btn"
                  onClick={(e) => this.props.trigger(e, expert._id)}
                >
                  VIEW DETAILS
                </button>
              ) : (
                <button className="book-slot-btn" onClick={this.handleMessage}>
                  MESSAGE
                </button>
              )}

              <button className="fav-btn" onClick={this.handleFav}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 65.54 65.81"
                >
                  
                  <g>
                    <g>
                      <path
                        
                        className={
                          !this.state.faved ? "cls-1-uncheck" : "cls-1-check"
                        }
                        d="M12.75,6.57c14.33-10.9,34.91-7.93,46,6.62s8.41,35.17-5.91,46.06-34.91,7.92-46-6.62S-1.58,17.46,12.75,6.57Z"
                      />
                      <path
                        
                        className="cls-2"
                        d="M45,21.81a8,8,0,0,0-11,.62L32.85,23.6l-1.14-1.21a8,8,0,0,0-10.94-1A8.43,8.43,0,0,0,19.7,33.28c.09.11.18.22.28.32L31.14,45.53a1.85,1.85,0,0,0,2.6.1l.06-.06L45.36,34a8.42,8.42,0,0,0,0-11.92Z"
                      />
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(ExpertCard);
