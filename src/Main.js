import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileViewContainer from './views/profile/Profile_ViewContainer'
import {riskObject} from './services/general_utils.js';

import { fetchAllObservations } from './services/fhir/FhirActions'
import { getPatID } from './services/smart_setup'

class Main extends Component {

  constructor(props){
    super(props); 
    //console.log("thsese are them: ", props)
    // store.dispatch(fetchAllObservations(getPatID()))

  }
  render() {
	const patient = this.props.ptapi.fetchAll({type: "Patient"});
	const observations = this.props.ptapi.fetchAll({type: "Observation", query:{$sort: [['date','desc'],['code','asc']]}});
	const conditions = this.props.ptapi.fetchAll({type: "Condition"});
	const encounters = this.props.ptapi.fetchAll({type: "Encounter", query:{$sort: [['date','desc']]}})
	const medicationOrder = this.props.ptapi.fetchAll({type: "MedicationStatement"});
	const medicationRequest = this.props.ptapi.fetchAll({type: "MedicationRequest", query: {'context.diagnosis.code': {$or: [
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
  					<ProfileViewContainer {...props} 
                  store={this.props.store}
  								meds={medicationOrder}
  								patient={patient}
  								encounters={encounters}
  								observations={observations}
  								conditions={conditions}
  								api={this.props.api}
  								ptapi={this.props.ptapi}
  								medreq={medicationRequest}/>
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
