import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import API from '../API';
import ExpertCard from './ExpertCard';

import isEmpty from '../utils/isEmpty';
import getCurrentUser from '../utils/getCurrentUser';

class UserApptPage extends Component {
  constructor(){
    super();
    this.state={
      wishlist : [],
      upcoming : [],
      past : [],
    }
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

      const { data } = API.get('/user/appointments');
      const wishlist = data.wishlist;
      const appts = data.appts;
      const upcoming = [];
      const past = [];
      for(let i=0; i<appts.length; i++){
          if (appts[i].slot.Date.split('T')[0]>date 
          || (appts[i].slot.Date.split('T')[0]===date 
          && appts[i].slot.slot > time)) {
            upcoming.push(appts[i])
          } 
          else {
            past.push(appts[i])
          }
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
        <div>
          <div>
            <h2>Wishlist</h2>
            <div>
              {this.state.wishlist.map((appts) => 
                <ExpertCard expert={appts}/>
              )}
            </div>
          </div>
          <div>
            <h2>Current Advisors</h2>
            <div>

            </div>
          </div>
          <div>
            <h2>Past Advisor</h2>
            <div>

            </div>
          </div>
      </div>
    )
  }
}

export default withRouter(UserApptPage);