import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileView from './profile/Profile_View.js'
import MeasurementView from './measurement/Measurement_View.js'
import RiskScoreView from './risk/Risk_View.js'

class Main extends Component {

  constructor(props){
    super(props); 
    console.log("thsese are them: ", props)

  }
  render() {
	var observations = this.props.ptapi.fetchAll({type: "Observation", query:{$sort: [['date','desc'],['code','asc']]}});
	var conditions = this.props.ptapi.fetchAll({type: "Condition"});
    return (
	    <main>
			<Switch>
			    <Route exact path='/' render={(props) => (
  					<ProfileView {...props} observations={observations} conditions={conditions} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
		    	<Route exact path='/measure' render={(props) => (
  					<MeasurementView {...props} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
				<Route path='/measure/:measureId' render={(props) => (
  					<MeasurementView {...props} observations={observations} conditions={conditions} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
		        <Route exact path='/risk' render={(props) => (
  					<RiskScoreView {...props} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
				<Route path='/risk/:riskName' render={(props) => (
  					<RiskScoreView {...props} observations={observations} conditions={conditions} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
				
			</Switch>
		</main>
    );
  }

}

export default Main;
