import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { Link } from 'react-router-dom';

import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Header extends Component {

  constructor(props){
    super(props); 
    this.state = {observations:null};

  }

  componentWillMount() {
    //a Set is used below for unique observation codes, could be {} probably.
    this.observationList = [];
    this.props.ptapi.fetchAll({type: "Observation", query:{$sort: [['code','asc']], _elements:['code']}})
              .done(function(data){
                //console.log(data);
                let observationList = new Set();
                let updatedList = []
                for (let i = 0; i < data.length; i++){
                  //adding stringified text so they can be compared for equality and we keep all the info, just JSON parse it
                  observationList.add(JSON.stringify(data[i].code.coding[0]));
                }
                for (let item of observationList){
                  updatedList.push(JSON.parse(item));
                }
                
                this.setState({observations:updatedList})
            
            }.bind(this));
    // console.log('list', observationList);
    // for (let item of observationList){
    //   console.log("item: ", item)
    //   this.observationList.push(JSON.parse(item));
    // }

  }

  render() {
    if(!this.state.observations){
      return (
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Ignite FHIR</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown eventKey={3} title="Measurements" id="basic-nav-dropdown">
                <LinkContainer to="/"><MenuItem eventKey={3.1}>Loading...</MenuItem></LinkContainer>
              </NavDropdown>
              <NavDropdown eventKey={3} title="Risk Scores" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Cardiavascular Disease</MenuItem>
                <MenuItem eventKey={3.2}>Stroke</MenuItem>
                <MenuItem eventKey={3.3}>Kidney Failure</MenuItem>
                <MenuItem eventKey={3.4}>COPD</MenuItem>
                <MenuItem eventKey={3.5}>Diabetes</MenuItem>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
    console.log("asdfasdfasfqweqdafsqwerasd", this.state.observations);
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Ignite FHIR</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavDropdown eventKey={3} title="Measurements" id="basic-nav-dropdown">
              { 
                this.state.observations.map(function(obs){
                  var link = "/measure/" + obs.code;
                  return <LinkContainer to={link}><MenuItem eventKey={obs.code}>{obs.display}</MenuItem></LinkContainer>  
                })  
              }
            </NavDropdown>
            <NavDropdown eventKey={3} title="Risk Scores" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Cardiavascular Disease</MenuItem>
              <MenuItem eventKey={3.2}>Stroke</MenuItem>
              <MenuItem eventKey={3.3}>Kidney Failure</MenuItem>
              <MenuItem eventKey={3.4}>COPD</MenuItem>
              <MenuItem eventKey={3.5}>Diabetes</MenuItem>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;