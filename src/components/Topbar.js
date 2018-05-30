import React from 'react';

import { NavLink } from 'react-router-dom';

import Icon from './Icon';

// Styles
import './Topbar.css';
import {patientLocal} from '../data/fhirData.js';

// utils
import { getPatID } from '../services/smart_setup'

class Header extends React.Component {
  
  componentWillMount() {
    this.props.getPatientDemographics(getPatID());
    this.props.getMostRecentVisit(getPatID());
  }

  render() {
    const recentVisit = new Date(this.props.mostRecentVisit);
    
    return (
      <header className="topbar flex-c flex-align-sb">
        <nav className="flex-c flex-v-center">
          <NavLink
            to="/"
            className="topbar-element flex-c flex-v-center"
            activeClassName="is-active"
          >
            <div style={{fontWeight: 'bold', fontSize: 26}}>Halyos</div>
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
            {this.props.patient ? (
                <div>{this.props.patient.address[0].city}, {this.props.patient.address[0].state}</div>
              ) : (
                <div>{patientLocal[0].resource.address[0].city}, {patientLocal[0].resource.address[0].state}</div>
              )
            }            
            <Icon id="map"/>
          </div>
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <div className="topbar-element-subtle">Last Visit&nbsp;</div>
            {this.props.mostRecentVisit ? (
              <date>{recentVisit.getMonth() + 1}/{recentVisit.getDate()}/{recentVisit.getFullYear().toString().substring(2,4)}</date>
              ) : (
              <date>8/18/16</date>
              )
            }            
            <Icon id="calendar"/>
          </div>
          <div className="topbar-element topbar-user flex-c flex-v-center">
            {this.props.patient ? (
              <div>{this.props.patient.name[0].given[0]} {this.props.patient.name[0].family}&nbsp;</div>
              ) : (
              <div>{patientLocal[0].resource.name[0].given[0]} {patientLocal[0].resource.name[0].family}&nbsp;</div>
              )
            }            
            <Icon id="person"/>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
