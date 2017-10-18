import React from 'react';
import { Switch, Route } from 'react-router-dom';

import About from '../views/About';
import Dashboard from '../views/Dashboard.js';
import MeasurementView from '../views/measurement/Measurement_View.js';
import RiskScoreView from '../views/risk/Risk_View.js';

import { riskObject } from '../services/general_utils.js';

class Main extends React.Component {
  render() {
    const patient = this.props.ptapi.fetchAll({
      type: "Patient"
    });
    const observations = this.props.ptapi.fetchAll({
      type: "Observation",
      query: {
        $sort: [['date','desc'],['code','asc']]
      }
    });
    const conditions = this.props.ptapi.fetchAll({
      type: "Condition"
    });
    const encounters = this.props.ptapi.fetchAll({
      type: "Encounter",
      query: {
        $sort: [['date','desc']]
      }
    })
    const medicationOrder = this.props.ptapi.fetchAll({
      type: "MedicationStatement"
    });
    const medicationRequest = this.props.ptapi.fetchAll({
      type: "MedicationRequest",
      query: {
        'context.diagnosis.code': {
          $or: [
            // History of antihypertensive drug treatment
            //MedicationRequest?context.reason=10509002
            '38341003'
          ]
        }
      }
    });

    return (
      <main>
        <Switch>
          <Route exact path='/about' component={About} />
          <Route exact path='/measure' render={props => (
              <MeasurementView
                {...props}
              />
            )}
          />
          <Route path='/measure/:measureId' render={props => (
            <MeasurementView
              {...props}
              meds={medicationOrder}
              patient={patient}
              encounters={encounters}
              medreq={medicationRequest}
              observations={observations}
              conditions={conditions}
              riskObject={riskObject}/>
            )}
          />
          <Route path='/risk/:riskName' render={props => (
              <RiskScoreView
                {...props}
                meds={medicationOrder}
                patient={patient}
                encounters={encounters}
                medreq={medicationRequest}
                observations={observations}
                conditions={conditions}
              />
            )}
          />
          <Route exact path='/risk' render={props => (
              <RiskScoreView
                {...props}
              />
            )}
          />
          <Route exact path='/' render={props => (
              <Dashboard
                {...props}
                meds={medicationOrder}
                patient={patient}
                encounters={encounters}
                observations={observations}
                conditions={conditions}
                medreq={medicationRequest}
              />
            )}
          />
        </Switch>
      </main>
    );
  }
}

export default Main;
