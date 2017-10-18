import React from 'react';

import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink } from 'react-router-dom';

import Icon from './Icon';

import { getValueQuantities, riskObject } from '../services/general_utils.js';

// Styles
import './Topbar.css';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = { observations: null };
  }

  componentWillMount() {
    //a Set is used below for unique observation codes, could be {} probably.
    this.observationList = [];
    this.props.ptapi.fetchAll({
      type: "Observation",
      query: {
        $sort: [['code','asc']],
        _elements:['code']
      }
    })
      .done(data => {
        let observationList = new Set();
        let updatedList = []
        for (let i = 0; i < data.length; i++){
          //adding stringified text so they can be compared for equality and we keep all the info, just JSON parse it
          if(data[i].component) {
            for (let comp of data[i].component) {
              let name = JSON.stringify(comp.code.coding[0]);
              observationList.add(name);
            }
          } else {
            let name = JSON.stringify(data[i].code.coding[0]);
            observationList.add(name);
          }
        }

        for (let item of observationList){
          let parsedItem = JSON.parse(item);
          if (!(parsedItem.code === '48643-1' || parsedItem.code === '48642-3')) {
            updatedList.push(parsedItem);
          }
        }

        this.setState({ observations:updatedList })
      });
  }

  render() {
    return (
      <header className="topbar flex-c flex-align-sb">
        <nav className="flex-c flex-v-center">
          <NavLink
            to="/"
            className="topbar-element flex-c flex-v-center"
            activeClassName="is-active"
          >
            <Icon id="logo"/>
          </NavLink>
          <NavLink
            to="/about"
            className="topbar-element"
            activeClassName="is-active"
          >
            About
          </NavLink>
        </nav>
        <nav className="flex-c">
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <label className="topbar-element-label">Last Visit</label>
            <date>8/18/16</date>
            <Icon id="calendar"/>
          </div>
          <div className="topbar-element topbar-user flex-c flex-v-center">
            <div>John Doe</div>
            <Icon id="person"/>
          </div>
        </nav>
      </header>
    );

    // return (
    //   <Navbar collapseOnSelect className="topbar">
    //     <Navbar.Header>
    //       <Navbar.Brand>
    //         <a href="/"><Icon id="logo"/></a>
    //       </Navbar.Brand>
    //       <Navbar.Toggle />
    //     </Navbar.Header>
    //     <Navbar.Collapse>
    //       { !this.state.observations ? (
    //         <Nav>
    //           <NavDropdown key={3} title="Measurements" id="basic-nav-dropdown">
    //             <LinkContainer to="/"><MenuItem key={3.1}>Loading...</MenuItem></LinkContainer>
    //           </NavDropdown>
    //           <NavDropdown key={4} title="Risk Scores" id="basic-nav-dropdown">
    //             <MenuItem key={4.2}>Cardiavascular Disease</MenuItem>
    //             <MenuItem key={4.3}>Stroke</MenuItem>
    //             <MenuItem key={4.4}>Kidney Failure</MenuItem>
    //             <MenuItem key={4.5}>COPD</MenuItem>
    //             <MenuItem key={4.6}>Diabetes</MenuItem>
    //           </NavDropdown>
    //           <LinkContainer to={'/about'}><MenuItem key={5.1}>About</MenuItem></LinkContainer>
    //         </Nav>
    //       ) : (
    //         <Nav>
    //           <NavDropdown key={5} title="Measurements" id="basic-nav-dropdown">
    //             {
    //               this.state.observations.map(obs =>
    //                 <LinkContainer key={obs.code.toString()} to={`/measure/${obs.code}`}><MenuItem key={obs.code.toString()}>{obs.display}</MenuItem></LinkContainer>
    //               )
    //             }
    //           </NavDropdown>
    //           <NavDropdown key={6} title="Risk Scores" id="basic-nav-dropdown">
    //             <LinkContainer to={'/risk/General_Cardiac'}><MenuItem key={6.1}>Cardiavascular Disease</MenuItem></LinkContainer>
    //             <LinkContainer to={'/risk/Kidney_Failure'}><MenuItem key={6.2}>Kidney Failure</MenuItem></LinkContainer>
    //             <LinkContainer to={'/risk/COPD_Mortality'}><MenuItem key={6.4}>COPD</MenuItem></LinkContainer>
    //             <LinkContainer to={'/risk/Stroke'}><MenuItem key={6.5}>Stroke</MenuItem></LinkContainer>
    //             <LinkContainer to={'/risk/Diabetes'}><MenuItem key={6.6}>Diabetes</MenuItem></LinkContainer>
    //           </NavDropdown>
    //           <LinkContainer to={'/about'}><MenuItem key={5.1}>About</MenuItem></LinkContainer>
    //         </Nav>
    //       )}
    //     </Navbar.Collapse>
    //   </Navbar>
    // );
  }
}

export default Header;
