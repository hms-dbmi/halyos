import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileView from './profile/Profile_View.js'
import MeasurementView from './measurement/Measurement_View.js'
import RiskScoreView from './risk/Risk_View.js'

class Main extends Component {

  constructor(props){
    super(props); 
  }

  render() {
    return (
	    <main>
			<Switch>
			    <Route exact path='/' render={(props) => (
  					<ProfileView api={this.props.api}/>
				)} />
		    	<Route exact path='/measure' render={(props) => (
  					<MeasurementView {...props}/>
				)} />
				<Route path='/measure/:measureName' render={(props) => (
  					<MeasurementView {...props}/>
				)} />
		        <Route exact path='/risk' render={(props) => (
  					<RiskScoreView {...props}/>
				)} />
				<Route path='/risk/:riskName' render={(props) => (
  					<RiskScoreView {...props}/>
				)} />
				
			</Switch>
		</main>
    );
  }

}

export default Main;
