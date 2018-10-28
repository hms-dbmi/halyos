import React from 'react';

import { NavLink } from 'react-router-dom';

import Icon from './Icon';

// Styles
import './Topbar.css';
import {patientLocal} from '../data/fhirData.js';
import {observationsLocal} from '../data/fhirData.js';
// utils
import { getPatID } from '../services/smart_setup'

class Header extends React.Component {

  componentWillMount() {
    this.props.getPatientDemographics(getPatID());
    this.props.getMostRecentVisit(getPatID());
  }

  render() {
    var recentVisit = new Date();
    if(this.props.mostRecentVisit){
      recentVisit = new Date(this.props.mostRecentVisit);  
    } else {
      recentVisit = new Date(observationsLocal[0].resource.effectiveDateTime);
    }
    
    return (
      <header className="topbar flex-c flex-align-sb">
        <nav className="flex-c flex-v-center">
          <NavLink
            to="/"
            className="topbar-element topbar-logo flex-c flex-v-center"
            activeClassName="is-active"
          >
            Halyos
          </NavLink>
          <NavLink
            to="/about"
            className="topbar-element topbar-element-subtle"
            activeClassName="is-active"
          >
            About
          </NavLink>
        </nav>
        <nav className="flex-c topbar-padded-element">
          <div className="topbar-element topbar-user flex-c flex-v-center">
            <Icon id="person" title="Patient"/>
            {this.props.patient ? (
              <div>{this.props.patient.name[0].given[0]} {this.props.patient.name[0].family}&nbsp;</div>
              ) : (
              <div>{patientLocal[0].resource.name[0].given[0]} {patientLocal[0].resource.name[0].family}&nbsp;</div>
              )
            }
          </div>
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <Icon id="map" title="Location"/>
            {this.props.patient ? (
                <div>{this.props.patient.address[0].city}, {this.props.patient.address[0].state}</div>
              ) : (
                <div>{patientLocal[0].resource.address[0].city}, {patientLocal[0].resource.address[0].state}</div>
              )
            }
          </div>
          <div className="topbar-element topbar-last-visit flex-c flex-v-center">
            <Icon id="calendar" title="Last Visit"/>
            {this.props.mostRecentVisit ? (
              <date>{recentVisit.getMonth() + 1}/{recentVisit.getDate()}/{recentVisit.getFullYear().toString().substring(2,4)}</date>
              ) : (
              <date>{recentVisit.getMonth() + 1}/{recentVisit.getDate()}/{recentVisit.getFullYear().toString().substring(2,4)}</date>
              )
            }
          </div>
          
        </nav>
      </header>
    );
  }
}

export default Header;
