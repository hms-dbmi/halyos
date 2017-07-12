import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const FHIR = window.FHIR;

class App extends Component {
  constructor(props){
    super(props); 

    var smart = FHIR.client({
        serviceUrl: 'http://fhirtest.uhn.ca/baseDstu3',
        auth: {
              type: 'none'
          }
     });

    smart.api.search({type: "Observation", query: {subject: "99912345"}})
      .then(function(r){
        console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
    });  

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
