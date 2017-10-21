import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';

// Services
import { calculateAge } from '../services/risk_score_utils';

// STyles
import './PreventativeCareSuggestions.css';

const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=';

const getUrl = (birthDate, gender) => `${URL}${40 || calculateAge(birthDate)}&sex=${gender}`;

class PreventativeCareSuggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interventionsList: []
    };

    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    $.get(getUrl(this.props.birthDate, this.props.gender)).done((data) => {
      const interventions = [];

      for (let i = 0; i < data.Result.Resources.All.Resource.length; i++) {
        interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
      }

      this.setState({
        interventionsList: interventions
      });
    });
  }

  render() {
    return (
      <div className="pcs full-wh flex-c flex-col">
        <h3 className="dashboard-panel-headline">Suggested Preventative Care</h3>
        <div className="flex-g-1 r">
          <ul className="pcs-list no-list-style full-dim scrollbar">
            {this.state.interventionsList.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

PreventativeCareSuggestions.propTypes = {
  birthDate: PropTypes.string,
  gender: PropTypes.string,
};

export default PreventativeCareSuggestions;
