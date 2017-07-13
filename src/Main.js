import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileView from './profile/Profile_View.js'
import MeasurementView from './measurement/Measurement_View.js'
import RiskScoreView from './risk/Risk_View.js'

class Main extends Component {

  constructor(props){
    super(props); 
    console.log("thsese are them: ", props)
    this.props.ptapi.fetchAll({type: "Observation", query:{$sort: [['code','asc']]}})
	      			.then(function(r){ 
	        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
		    		});
  }

  render() {
    return (
	    <main>
			<Switch>
			    <Route exact path='/' render={(props) => (
  					<ProfileView {...props}/>
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
