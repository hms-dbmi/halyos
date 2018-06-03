import PropTypes from 'prop-types';
import React from 'react';

// Styles
import './PreventativeCareSuggestions.css';

//use lines below for getting live API response
//const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=';
//const getUrl = (birthDate, gender) => `${URL}${40 || calculateAge(birthDate)}&sex=${gender}`;

const staticURL = (birthDate, gender) => './data/preventativeCareSuggestions.json';

class PreventativeCareSuggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interventionsList: [],
      mounted: false
    };

  }

  componentDidMount() {
    this.setState({mounted:true,
      interventionsList:[]});
    this.props.getPreventativeCareSuggestions(this.props.birthDate, this.props.gender);
    this.loadData();
  }

  componentWillUnmount() {
    this.setState({
      mounted: false
    })
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
    if(this.state.mounted) {
      this.setState({
        interventionsList: interventions
      });
    }
  }

  render() {
    // this right here is real messy. find a better system if there is one. especially the render, data formats are different yet again.
    let suggestions;
    
    if(this.props.failedFetchingPrevCareData || this.props.prevCareSuggestions == null){
      suggestions = this.state.interventionsList;
    } else if (this.props.prevCareSuggestions) {
      suggestions = this.props.prevCareSuggestions.Result.Resources.All.Resource;
    } else {
      suggestions = this.state.interventionsList;
    }
    return (
      <div className="pcs full-wh flex-c flex-col">
        <h3 className="dashboard-panel-headline">Suggested Preventative Care</h3>
        <div className="flex-g-1 r">
          <ul className="pcs-list no-list-style full-dim scrollbar">
            {suggestions && suggestions.map((dataItem, index) => (
              <li key={index}>{dataItem.MyHFDescription || dataItem}</li>
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
