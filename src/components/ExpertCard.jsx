import React, { Component } from 'react'
import API from '../API';
import isEmpty from '../utils/isEmpty';
import '../css/expertCard.css'

export default class ExpertCard extends Component {
	constructor(props) {
		super(props);
		const { expert } = props
		this.state={
			currDate : isEmpty(expert.slots) ? null : Object.keys(expert.slots)[0],
			bookSlot : undefined,
			showDetails : false,
		}
		this.setDate=this.setDate.bind(this);
		this.bookSlot=this.bookSlot.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
	}

	setDate(evt) {
		const date = evt.target.id;
		this.setState({
			currDate : date,
		})
	}

	bookSlot(evt) {
		const slot = evt.target.id;
		if(this.props.expert.slots[this.state.currDate][slot] !== null){
			console.log("BOOKED")
		}
		else {
			this.setState({
				bookSlot : slot,
			})
		}
	}

	handleSubmit(evt) {
		evt.preventDefault();
		console.log(this.state)
		const slot = API.post('/slots/bookslot',{
			date : this.state.currDate,
			slot : this.state.bookSlot,
			expertId : this.props.expert._id,
		})
	}

	render() {
		return (
			<div className="Expert-Card">
				<div className="info">
					{this.props.expert.pic}
					<div>
						<h3>{this.props.expert.name}</h3>
						<h3>{this.props.expert.university}</h3>
						<h3>{this.props.expert.branch}</h3>
						<button onClick={this.handleSubmit}>BOOK SLOT</button>
					</div>
				</div>
				<div className="details">
					<div className="description">
						<h1>Description</h1>
						<p>
							{this.props.expert.bio}
						</p>
					</div>
					<div className="form">
						<div class="duration">
							<h2>Select Call Duration</h2>
							<div class="duration-input"> 
								<input type="radio" name="duration" id="30min" value="30" checked />
								<label for="30min"> <span>30 min&nbsp;</span> <span>100 Rs</span></label>

								<input type="radio" name="duration" id="60min" value="60" />
								<label for="60min"> <span>60 min&nbsp;</span> <span>200 Rs</span></label>
							</div>
						</div>
						<div>
							
						</div>
					</div>
				</div>
				{isEmpty(this.props.expert.slots) ? null :
				<div className="slots">
					<h2>Slots Available</h2>
					<div className="slots=input">
						{Object.keys(this.props.expert.slots[this.state.currDate]).map((slot) => 
							<label
								id={slot}
								onClick={this.bookSlot}
							>
								{slot}
							</label>
						)}
					</div>
					<div className="date-input">
						{Object.keys(this.props.expert.slots).map((date) => 
							<label
								id={date} 
								onClick={this.setDate}
							>
								{date}
							</label>
						)}
					</div>
					</div>
				}
				<div>Slots</div>
			</div>
		)
	}
}
