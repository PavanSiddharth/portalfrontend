import React, { Component } from "react";
import { useEffect } from 'react';
import API from "../API";
import { withRouter, Link } from 'react-router-dom';
import getCurrentUser from "../utils/getCurrentUser";
import isEmpty from "../utils/isEmpty";
import Razorpay from 'razorpay';

class Payment extends Component {
  constructor() {
    super();
    
    this.state = {
        payment_amount: 0,
        refund_id: 0
      };
      this.paymentHandler = this.paymentHandler.bind(this);
      this.refundHandler = this.refundHandler.bind(this);
  }

 async componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

  }
  paymentHandler(e) {
    e.preventDefault();

    const  payment_amount  = this.state.payment_amount;
    const self = this;
    const options = {
      key_id: "rzp_test_4JLpoFGA17xkZq",
      key_secret:"89CUTDzmDYbIYqgpUabjGtav",
      amount: 50000,
      name: 'Payments',
      description: 'Donate yourself some time',

      handler(response) {
        const paymentId = response.razorpay_payment_id;
        const url ="http://localhost:3000/payment"+paymentId+'/'+payment_amount;
        // Using my server endpoints to capture the payment
        fetch(url, {
          method: 'get',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
        .then(resp =>  resp.json())
        .then(function (data) {
          console.log('Request succeeded with JSON response', data);
          self.setState({
            refund_id: response.razorpay_payment_id
          });
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
      },

      prefill: {
        name: 'Shashank Shekhar',
        email: 'ss@localtrip.in',
      },
      notes: {
        address: 'Goa,India',
      },
      theme: {
        color: '#9D50BB',
      },
    };
    const rzp1 = new Razorpay(options);

    rzp1.open();
  }

  refundHandler(e) {
    e.preventDefault();
    const { refund_id } = this.state;
    const url = "http://localhost:3000/payment/refund/"+refund_id;

    // Using my server endpoints to initiate the refund
    fetch(url, {
      method: 'get',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
    .then(resp =>  resp.json())
    .then(function (data) {
      console.log('Request succeeded with JSON response', data);
      alert("Refund Succeeded", )
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });

  }

  

    render(){
        const { payment_amount, refund_id } = this.state;
        return(
            
  <div className="wrapper">
        <div className="payments">
          <div className="payments-title">
            <h1>Test Payments</h1>
          </div>
          <div className="payments-form">
            <form action="#" onSubmit={this.paymentHandler}>
              <p>
                <label htmlFor="pay_amount" className="pay_amount">
                  Amount to be paid
                </label>
              </p>
              <input
                type="number"
                value={payment_amount}
                className="pay_amount"
                placeholder="Amount in INR"
                onChange={e =>
                  this.setState({ payment_amount: e.target.value })
                }
              />
              <p>
                <button type="submit">Pay Now</button>
              </p>
            </form>
          </div>
        </div>
        <div className="refunds">
          <div className="refunds-title">
            <h1>Test Refunds</h1>
          </div>
          <div className="refunds-form">
            <form action="#" onSubmit={this.refundHandler}>
              <p>
                <label htmlFor="refund_amount" className="refund_amount">
                  Payment Transaction ID
                </label>
              </p>
              <input
                value={refund_id}
                type="text"
                className="refund_amount"
                onChange={e => this.setState({ refund_id: e.target.value })}
              />
              <p>
                <button type="submit">Refund Now</button>
              </p>
            </form>
          </div>
        </div>
      </div>
  
        );
    }
    }
    export default withRouter(Payment);

