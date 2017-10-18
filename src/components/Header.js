import React from 'react';

import { Navbar, NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Icon from './Icon';

import { getValueQuantities, riskObject } from '../services/general_utils.js';
import LastVisit from './LastVisit.js';
import Name from './Name.js';
import { HeaderStyle } from './Header-style.js'

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
            for (let comp of data[i].component){
              //console.log(comp.code.coding[0].code);
              var name = JSON.stringify(comp.code.coding[0]);
              observationList.add(name);
            }
          } else {
            //console.log(data[i].code.coding[0].code);
            var name = JSON.stringify(data[i].code.coding[0]);
            observationList.add(name);
          }
        }

        for (let item of observationList){
          var parsedItem = JSON.parse(item);
          //console.log("parseditem", parsedItem);
          if (!(parsedItem.code === '48643-1' || parsedItem.code === '48642-3')) {
            updatedList.push(parsedItem);
          }
        }

        this.setState({ observations:updatedList })
      });
  }

  render() {
    return (
    <div>
      <div style={{"display":"flex", "flex-direction":"row", "justify-content":"space-between", "align-items":"flex-end", "font-size":"16"}}> 
        <div style={{order:"1"}}>
          <div style={{}}>Creative title, preferably with a pun </div>
        </div>
        <div style={{order:"2"}}>
          <div style={{"display":"flex", "flex-direction":"row", "align-items":"flex-end"}}>
            <LastVisit encounters={[{effectiveDateTime:"03-19-2017"}]}/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            <Name patient="Samson Mataraso"/>
          </div>
        </div>
      </div>
      <br/>
    </div>
    );
  }
  //   if(!this.state.observations){
  //     return (
  //       <Navbar collapseOnSelect>
  //         <Navbar.Header>
  //           <Navbar.Brand>
  //             <a href="/"><Icon id="logo"/></a>
  //           </Navbar.Brand>
  //           <Navbar.Toggle />
  //         </Navbar.Header>
  //         <Navbar.Collapse>
  //           <Nav>
  //             <NavDropdown key={3} title="Measurements" id="basic-nav-dropdown">
  //               <LinkContainer to="/"><MenuItem key={3.1}>Loading...</MenuItem></LinkContainer>
  //             </NavDropdown>
  //             <NavDropdown key={4} title="Risk Scores" id="basic-nav-dropdown">
  //               <MenuItem key={4.2}>Cardiavascular Disease</MenuItem>
  //               <MenuItem key={4.3}>Stroke</MenuItem>
  //               <MenuItem key={4.4}>Kidney Failure</MenuItem>
  //               <MenuItem key={4.5}>COPD</MenuItem>
  //               <MenuItem key={4.6}>Diabetes</MenuItem>
  //             </NavDropdown>
  //             <LinkContainer to={'/about'}><MenuItem key={5.1}>About</MenuItem></LinkContainer>
  //           </Nav>
  //         </Navbar.Collapse>
  //       </Navbar>
  //     )
  //   }

  //   return (
  //     <Navbar collapseOnSelect>
  //       <Navbar.Header>
  //         <Navbar.Brand>
  //           <a href="/"><Icon id="logo"/></a>
  //         </Navbar.Brand>
  //         <Navbar.Toggle />
  //       </Navbar.Header>
  //       <Navbar.Collapse>
  //         <Nav>
  //           <NavDropdown key={5} title="Measurements" id="basic-nav-dropdown">
  //             {
  //               this.state.observations.map(function(obs){
  //                 var link = "/measure/" + obs.code;
  //                 //console.log("obsCOde:", obs.code);
  //                 return <LinkContainer key={obs.code.toString()} to={link}><MenuItem key={obs.code.toString()}>{obs.display}</MenuItem></LinkContainer>
  //               })
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
  //       </Navbar.Collapse>
  //     </Navbar>
  //   );
  // }
}

export default Header;
