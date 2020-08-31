import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar bg-custom navbar-expand-lg">
        <NavLink to="/" className="navbar-brand">
            <img src="/images/pethut-logo2.png" width="50" alt="PetHut"/>
            <p>Pet Hut</p>
        </NavLink>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="navbar-item">
            <NavLink to="/pets" className="nav-link">Find a Pet</NavLink>
           </li>
          <li className="navbar-item">
            <NavLink to="/owners" className="nav-link">Pet Owners</NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/adoptions" className="nav-link">Adoptions</NavLink>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}