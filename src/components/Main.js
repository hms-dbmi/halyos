import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from '../views/About';
import DashboardContainer from '../views/DashboardContainer';

import './Main.css';

import {patientLocal, encountersLocal, conditionsLocal, medStatementsLocal, medRequestsLocal, observationsLocal } from '../data/fhirData.js';

class Main extends React.Component {

  componentDidMount() {
    // this.patient = this.props.ptapi.fetchAll({
    //   type: 'Patient',
    // });
    // this.observations = this.props.ptapi.fetchAll({
    //   type: 'Observation',
    //   query: {
    //     $sort: [['date', 'desc'], ['code', 'asc']],
    //   },
    // });
    // this.conditions = this.props.ptapi.fetchAll({
    //   type: 'Condition',
    // });
    // this.encounters = this.props.ptapi.fetchAll({
    //   type: 'Encounter',
    //   query: {
    //     $sort: [['date', 'desc']],
    //   },
    // });
    // this.medicationOrder = this.props.ptapi.fetchAll({
    //   type: 'MedicationStatement',
    // });
    // this.medicationRequest = this.props.ptapi.fetchAll({
    //   type: 'MedicationRequest',
    //   query: {
    //     'context.diagnosis.code': {
    //       $or: [
    //         // History of antihypertensive drug treatment
    //         // MedicationRequest?context.reason=10509002
    //         '38341003',
    //       ],
    //     },
    //   },
    // });

  }


  render() {
    return (
      <main className='content'>
        <Switch>
          <Route exact path='/about' component={About} />
          <Route exact path='/' render={props => (
              <DashboardContainer
                {...props}
                patientLocal={patientLocal[0].resource}
                observationsLocal={observationsLocal}
                conditionsLocal={conditionsLocal}
                medreq={medRequestsLocal}
              />
            )}
          />
        </Switch>
      </main>
    );
  }
}
/* For testing w/ live FHIR server
  <DashboardContainer
    {...props}
    meds={this.medicationOrder}
    patient={this.patient}
    encounters={this.encounters}
    observations={this.observations}
    conditions={this.conditions}
    medreq={this.medicationRequest}
  />
*/

export default Main;
