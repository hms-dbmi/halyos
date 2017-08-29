import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileView from './views/profile/Profile_View.js'
import MeasurementView from './views/measurement/Measurement_View.js'
import RiskScoreView from './views/risk/Risk_View.js'
import {getPatID} from './services/smart_setup.js';
import {riskObject} from './services/general_utils.js';

class Main extends Component {

  constructor(props){
    super(props); 
    //console.log("thsese are them: ", props)

  }
  render() {
	var patient = this.props.ptapi.fetchAll({type: "Patient"});
	var observations = this.props.ptapi.fetchAll({type: "Observation", query:{$sort: [['date','desc'],['code','asc']]}});
	var conditions = this.props.ptapi.fetchAll({type: "Condition"});
	var encounters = this.props.ptapi.fetchAll({type: "Encounter", query:{$sort: [['date','desc']]}})
	var medicationOrder = this.props.ptapi.fetchAll({type: "MedicationStatement"});
	var medicationRequest = this.props.ptapi.fetchAll({type: "MedicationRequest", query: {'context.diagnosis.code': {$or: [
            // History of antihypertensive drug treatment
            //MedicationRequest?context.reason=10509002
           '38341003'
           ]}}});
    
    return (
	    <main>
			<Switch>
          <Route exact path='/about' render={(props) => (
            <About />
          )} />
			    <Route exact path='/' render={(props) => (
  					<ProfileView {...props} 
  								meds={medicationOrder}
  								patient={patient}
  								encounters={encounters}
  								observations={observations}
  								conditions={conditions}
  								api={this.props.api}
  								ptapi={this.props.ptapi}
  								medreq={medicationRequest}/>
				)} />
		    	<Route exact path='/measure' render={(props) => (
  					<MeasurementView {...props} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
				<Route path='/measure/:measureId' render={(props) => (
  					<MeasurementView {...props} 
  								meds={medicationOrder}
  								patient={patient}
  								encounters={encounters}
  								api={this.props.api}
  								ptapi={this.props.ptapi}
  								medreq={medicationRequest}
  								observations={observations}
  								conditions={conditions} 
  								riskObject={riskObject}/>
				)} />
		        <Route exact path='/risk' render={(props) => (
  					<RiskScoreView {...props} api={this.props.api} ptapi={this.props.ptapi}/>
				)} />
				<Route path='/risk/:riskName' render={(props) => (
  					<RiskScoreView {...props} 
  								meds={medicationOrder}
  								patient={patient}
  								encounters={encounters} 
  								api={this.props.api}
  								ptapi={this.props.ptapi}
  								medreq={medicationRequest}
  								observations={observations}
  								conditions={conditions} />
                  
				)} />
				
			</Switch>
		</main>
    );
  }

}

export default Main;

const About = React.createClass({
  render() {
    return (
      <div>
        <h2>Contributors</h2>
        <p>Harvard Medical School DMBI 2017 Summer Interns: Samson Mataraso and Vimig Socrates</p>
        <p>Thanks to everyone that helped out with brainstorming, design, and technical issues!</p>
        <div>Icons made by <a href="https://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
      </div>
    );
  }
});
