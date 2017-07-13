import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { Link } from 'react-router-dom';

import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Header extends Component {

  constructor(props){
    super(props); 

  }

  on

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Ignite FHIR</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="Measurements" id="basic-nav-dropdown">
              <LinkContainer to="/measure/test"><MenuItem eventKey={3.1}>Action</MenuItem></LinkContainer>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
            </NavDropdown>
            <NavDropdown eventKey={3} title="Risk Scores" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;