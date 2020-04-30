import React, { Component } from "react";
import logo from "../public/logo2.svg";
import '../css/FilterBar.css'

export default function FilterBar(props) {
  return (
    <div>
      <div className="FilterBar">
        <ul>
          <li>
            <img className='logo1' src={logo} alt="logo" />
          </li>
          {props.filters.map((filter) => (
            <li className='filter' id={filter} onClick={props.sortBy}>
              {filter[0].toUpperCase()+filter.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
