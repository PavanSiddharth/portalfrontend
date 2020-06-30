import React, { Component } from "react";
import API from "../API";
import { withRouter } from "react-router-dom";

import isEmpty from "../utils/isEmpty";
import getCurrentUser from "../utils/getCurrentUser";

import "../css/AddSlots.css";

let selectedDate = null;

class AddSlots extends Component {
  constructor() {
    super();
    this.state = {
      bookedSlots: {},
      slots: {},
      dates: [],
      currDate: null,
      timeFrom: "00:00",
      timeTo: "11:59",
      errormsg : false
    };
    this.generateDates = this.generateDates.bind(this);
    this.setDate = this.setDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteSlot = this.deleteSlot.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.generateDates();
    try {
      if (isEmpty(this.props.user)) {
        const currentUser = await getCurrentUser();
        this.props.updateUser(currentUser);
        if (isEmpty(currentUser)) {
          console.log("Not Logged In!");
          this.props.history.push("/login");
        } else if (currentUser.type !== "EXPERT") {
          console.log("Experts only allowed");
          this.props.history.push("/experts");
        }
      }
      const bookedSlots = await API.get("/slots/getslots");
      this.setState({ bookedSlots: bookedSlots.data });
    } catch (error) {
      console.log(error);
    }
  }

  generateDates() {
    const dates = [];
    const d = new Date();

    for (let i = 0; i < 7; i++) {
      let s = new Date(d.setDate(d.getDate() + 1)).toISOString();
      s = s.slice(0, s.indexOf("T")).split("-");
      dates.push(
        [s[1], s[2], s[0]].toLocaleString().replace(",", "/").replace(",", "/")
      );
    }
    this.setState({ dates });
  }

  setDate(evt) {
    evt.preventDefault();
    if (this.state.currDate) {
      selectedDate.classList.remove("card-selected");
    }
    this.setState({ currDate: evt.target.id });
    evt.target.classList.add("card-selected");
    selectedDate = evt.target;
  }

  async handleChange(evt) {
    await this.setState({ [evt.target.name]: evt.target.value });

    let { timeFrom, timeTo, currDate, slots } = this.state;
    slots[currDate] = {};

    let time1 = parseInt(timeFrom.split(":")[0]);
    let time2 = parseInt(timeTo.split(":")[0]);
    console.log(time1);
    console.log(time2);

    if((time2-time1)>=12)
      this.setState({errormsg:true})
    else
      this.setState({errormsg:false})
    
    timeFrom = timeFrom.split(":").map((t) => parseInt(t, 10));
    timeTo = timeTo.split(":").map((t) => parseInt(t, 10));

    const lowLim = timeFrom[0] * 2 + Math.round(timeFrom[1] / 60);
    const upLim = timeTo[0] * 2 + Math.round(timeTo[1] / 60);
    for (let i = lowLim; i < upLim; i++) {
      slots[currDate][
        `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}-${Math.floor(
          (i + 1) / 2
        )}:${(i + 1) % 2 === 0 ? "00" : "25"}`
      ] = null;
    }
    this.setState({ slots });
  }

  deleteSlot(evt) {
    const { bookedSlots, slots, currDate } = this.state;
    const slot = evt.target.id;
    if (
      !isEmpty(bookedSlots) &&
      !isEmpty(bookedSlots[currDate]) &&
      bookedSlots[currDate][slot] !== null
    ) {
      console.log("ALREADY BOOKED");
    } else {
      delete slots[currDate][slot];
      this.setState({ slot });
    }
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    try {
      const res = await API.post("/slots/addslots", this.state.slots);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="add-slots-container">
        <div className="menu">
          <div className="txt">Thank you for your support</div>
          {/* <ul>
          <li><a  className="a active1" href="#apptments" >Appointments</a></li>
          <li><a className="a" href="../components/Slots" target="Frame">Time Slots</a></li>
          <li><a className="a" href="#contact">Messaging</a></li>
          <li><a className="a" href="#about">Your Profile </a></li>
          </ul> */}
          <div className="frame" name="Frame">
            <div className="date">
              <div className="txt1">Date:</div> <br />
              <div className="cards">
                {this.state.dates.map((date) => (
                  <div className="date-card" id={date} onClick={this.setDate}>
                    {date}
                  </div>
                ))}
              </div>
            </div>
            <div className="time">
              <div className="txt2">
                {" "}
                Add Time limit: &nbsp;
                <input
                  value={this.state.timeFrom}
                  onChange={this.handleChange}
                  type="time"
                  name="timeFrom"
                  id="from"
                />
                to &nbsp;
                <input
                  value={this.state.timeTo}
                  onChange={this.handleChange}
                  type="time"
                  name="timeTo"
                  id="to"
                />
              </div>
              {!this.state.errormsg ? (<div className="table-container">
                {isEmpty(this.state.slots) ||
                isEmpty(this.state.slots[this.state.currDate]) ? null : (
                  <div className="table">
                    {Object.keys(this.state.slots[this.state.currDate]).map(
                      (slot) => (
                        <div className="time-slots">
                          {" "}
                          {slot}{" "}
                          <span id={slot} onClick={this.deleteSlot}>
                            X
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>) : (<div> Select a time frame of less than 12 hrs </div>)}
              <button onClick={this.handleSubmit} type="submit">
                ADD SLOTS
              </button>
            </div>
          </div>
        </div>
        <div>{/* Dates */}</div>
        <div></div>
      </div>
    );
  }
}

export default withRouter(AddSlots);
