import PropTypes from 'prop-types';
import React from 'react';

// Styles
import './PreventativeCareSuggestions.css';

//use lines below for getting live API response
//const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=';
//const getUrl = (birthDate, gender) => `${URL}${40 || calculateAge(birthDate)}&sex=${gender}`;

const staticURL = (birthDate, gender) => './data/preventativeCareSuggestions.json';

class PreventativeCareSuggestions extends React.Component {

  componentDidMount() {
    this.props.getPreventativeCareSuggestions(this.props.birthDate, this.props.gender);
  }

  render() {

    let suggestions;
    if(this.props.prevCareSuggestions){
      suggestions = this.props.prevCareSuggestions.Result.Resources.All.Resource;
    }
     console.log("data", this.props.prevCareSuggestions);
    return (
      <div className="pcs full-wh flex-c flex-col">
        <h3 className="dashboard-panel-headline">Suggested Preventative Care</h3>
        <div className="flex-g-1 r">
          <ul className="pcs-list no-list-style full-dim scrollbar">
            {suggestions && suggestions.map((dataItem, index) => (
              <li key={index}>{dataItem.MyHFDescription}</li>
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
