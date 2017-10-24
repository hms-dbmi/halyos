import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from '../views/About';
import DashboardContainer from '../views/DashboardContainer';

import './Main.css';

import {patient, encounters, conditions, medStatements, medRequests, observations } from '../data/fhirData.js';
import {sortMeasurements} from '../services/general_utils.js';

class Main extends React.Component {
  componentDidMount() {
    this.patient = this.props.ptapi.fetchAll({
      type: 'Patient',
    });
    this.observations = this.props.ptapi.fetchAll({
      type: 'Observation',
      query: {
        $sort: [['date', 'desc'], ['code', 'asc']],
      },
    });
    this.conditions = this.props.ptapi.fetchAll({
      type: 'Condition',
    });
    this.encounters = this.props.ptapi.fetchAll({
      type: 'Encounter',
      query: {
        $sort: [['date', 'desc']],
      },
    });
    this.medicationOrder = this.props.ptapi.fetchAll({
      type: 'MedicationStatement',
    });
    this.medicationRequest = this.props.ptapi.fetchAll({
      type: 'MedicationRequest',
      query: {
        'context.diagnosis.code': {
          $or: [
            // History of antihypertensive drug treatment
            // MedicationRequest?context.reason=10509002
            '38341003',
          ],
        },
      },
    });
  }

  observations = sortMeasurements(observations);

  render() {
    return (
      <main className='content'>
        <Switch>
          <Route exact path='/about' component={About} />
          <Route exact path='/' render={props => (
              <DashboardContainer
                {...props}
                meds={medStatements}
                patient={patient}
                encounters={encounters}
                observations={observations}
                conditions={conditions}
                medreq={medRequests}
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
