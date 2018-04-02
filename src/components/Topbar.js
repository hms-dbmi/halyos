import React from 'react';

import { NavLink } from 'react-router-dom';

import Icon from './Icon';

// Styles
import './Topbar.css';
import {patientLocal} from '../data/fhirData.js';

class Header extends React.Component {
  
  componentWillMount() {
    // a Set is used below for unique observation codes, could be {} probably.
    this.observationList = [];
    this.props.ptapi.fetchAll({
      type: 'Observation',
      query: {
        $sort: [['code', 'asc']],
        _elements: ['code'],
      },
    })
      .done((data) => {
        const observationList = new Set();
        const updatedList = [];
        for (let i = 0; i < data.length; i++) {
          // Adding stringified text so they can be compared for equality and we
          // keep all the info, just JSON parse it
          if (data[i].component) {
            for (let comp of data[i].component) {
              const name = JSON.stringify(comp.code.coding[0]);
              observationList.add(name);
            }
          } else {
            //TODO: there's an error here where an obs can exist in the data, but without a code, if statement is a bandaid, figure out how/why 
            let name = "";
            if(data[i].code){
              name = JSON.stringify(data[i].code.coding[0]);
              observationList.add(name);
            }
          }
        }

        for (let item of observationList) {
          const parsedItem = JSON.parse(item);
          if (!(parsedItem.code === '48643-1' || parsedItem.code === '48642-3')) {
            updatedList.push(parsedItem);
          }
        }

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
            className="topbar-element topbar-element-subtle"
            activeClassName="is-active"
          >
            About
          </NavLink>
        </nav>
        <nav className="flex-c">
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <div className="topbar-element-subtle">Location&nbsp;</div>
            <div>{patientLocal[0].resource.address[0].city}, {patientLocal[0].resource.address[0].state}</div>
            <Icon id="map"/>
          </div>
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <div className="topbar-element-subtle">Last Visit&nbsp;</div>
            <date>8/18/16</date>
            <Icon id="calendar"/>
          </div>
          <div className="topbar-element topbar-user flex-c flex-v-center">
            <div>Jane Doe&nbsp;</div>
            <Icon id="person"/>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
