import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import API from '../API';
import ExpertCard from './ExpertCard';
import FilterBar from './FilterBar';
import "../css/carousel-styles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import isEmpty from '../utils/isEmpty';
import getCurrentUser from '../utils/getCurrentUser';
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 2,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

class UserApptPage extends Component {
  constructor(){
    super();
    this.state={
      wishlist : [],
      upcoming : [],
      past : [],
      sortBy: "upcoming",
      loaded: false,
    }
    this.setSort=this.setSort.bind(this);
  }

  setSort(e) {
    this.setState({
      sortBy: e.target.id,
    });
  }

  async componentDidMount() {
    const d = new Date();
    const date = d.toISOString().split('T')[0]
		const time = d.toTimeString();
    try {
      if (isEmpty(this.props.user)) {
        const currentUser = await getCurrentUser();
        this.props.updateUser(currentUser);
        if (isEmpty(currentUser)) {
          console.log('Not Logged In!');
          this.props.history.push('/login');
        }
      }

      const { data } = await API.get('/user/appointments');
      console.log(data);
      this.setState({...data, loaded: true});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // if(this.state.loaded)
      return (
          <div>
            <FilterBar filters={['wishlist', 'upcoming', 'past']} sortBy={this.setSort}/>
            
            <div>
              <div>
              <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={true}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  keyBoardControl={true}
                  customTransition="all .5"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  deviceType={this.props.deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                >
                {this.state[this.state.sortBy].map((appts) => 
                  <ExpertCard appt={true} expert={appts}/>
                )}
                </Carousel>
              </div>
            </div>
            {/* <div>
              <h2>Current Advisors</h2>
              <div>
              {this.state.upcoming.map((appts) => 
                  <ExpertCard appt={true} expert={appts}/>
                )}
              </div>
            </div>
            <div>
              <h2>Past Advisor</h2>
              <div>
              {this.state.prev.map((appts) => 
                  <ExpertCard appt={true} expert={appts}/>
                )}
              </div>
            </div> */}
        </div>
      )
    // else
    //   return(null)
  }
}

export default withRouter(UserApptPage);