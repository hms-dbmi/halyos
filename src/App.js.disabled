import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ProfileView from './profile/Profile_View.js'
import MeasurementView from './measurement/Measurement_View.js'
import RiskScoreView from './risk/Risk_View.js'

const FHIR = window.FHIR;

class App extends Component {

  constructor(props){
    super(props); 

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Ignite FHIR</h2>
        </div>
        <ProfileView client={this.props.smart} />
        <MeasurementView client={this.props.smart} />
        <RiskScoreView client={this.props.smart} />
      </div>
    );
  }

}

App.defaultProps = {
  smart: FHIR.client({
        serviceUrl: 'http://fhirtest.uhn.ca/baseDstu3',
        auth: {
              type: 'none'
          }
     }),
}

export default App;
