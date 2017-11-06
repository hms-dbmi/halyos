import PropTypes from 'prop-types';
import React from 'react';

// Services
import { calculateAge } from '../services/risk_score_utils';

// Styles
import './PreventativeCareSuggestions.css';

const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=';

const getUrl = (birthDate, gender) => `${URL}${40 || calculateAge(birthDate)}&sex=${gender}`;

const staticURL = (birthDate, gender) => './data/preventativeCareSuggestions.json';

class PreventativeCareSuggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interventionsList: []
    };

    this.loadData();
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.birthDate !== this.props.birthDate ||
      nextProps.gender !== this.props.gender
    ) {
      this.loadData();
    }
  }

  loadData() {
    fetch(staticURL(this.props.birthDate, this.props.gender))
      .then(response => response.json())
      .then((data) => {
        this.wrangleData(data);
      })
      .catch((error) => {
        console.error('Could not retrieve or parse preventative care suggestions.', error);
      });
  }

  wrangleData(data) {
    const interventions = [];

    for (let i = 0; i < data.Result.Resources.All.Resource.length; i++) {
      interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
    }

    this.setState({
      interventionsList: interventions
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
