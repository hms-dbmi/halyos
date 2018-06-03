import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';
import { coordDistance } from '../../services/general_utils';

// Styles
//import './Flu.css';

//Static Data
import {fluLocal} from '../../data/fhirData';

// utils
import { findClosestMarker } from '../../services/Environment/environmental_utils'


//currently arbitary rankings
const FLU_LEVELS = [
  [3,"Low", "#006ba4","There are a few cases of flu in your area. You might not need the seasonal vaccine, but if it is flu season, check with your healthcare provider."],
  [5,"Moderate","#FFFF00","There are a considerable number of cases of the flu in your area, gettting the seasonal vaccine is recommended."],
  [10,"High","","There are many cases of flu in your area, get your seasonal flu vaccine ASAP!"],
]

class Flu extends React.Component {
  render() {

    var currentFluLevel = [0, "...", "...", "Loading..."];
    let closestFluMarkerLocalOrRemote;
    if(this.props.failedFetchFluData || this.props.closestFluMarker == null){
      closestFluMarkerLocalOrRemote = findClosestMarker(fluLocal, this.props.location.latitude, this.props.location.longitude);
    } else if(this.props.closestFluMarker){
      closestFluMarkerLocalOrRemote = this.props.closestFluMarker;
    } else {
      closestFluMarkerLocalOrRemote = findClosestMarker(fluLocal, this.props.location.latitude, this.props.location.longitude);
    }

    if (this.props.closestFluMarker){
      for (let val of FLU_LEVELS){
        if (this.props.closestFluMarker.flu < parseInt(val[0])){
          currentFluLevel = val;
          break;
        }
      }
    }

    return(
      <EnvironmentTile
        name="Flu"
        expand={this.props.expand}
        isCollapsed={this.props.isCollapsed}
        isExpanded={this.props.isExpanded}
        level={currentFluLevel[1]}
      >
        <div>
          <h5>Mentions of Flu Symptoms Near You</h5>
            {this.props.closestFluMarker && (
              <p>
                { this.props.closestFluMarker.flu } Mentions of Flu Symptoms
              </p> )}
          <h5>Explanation</h5>
            {this.props.closestFluMarker && (
              <p className="flu-explanation-text">
                { currentFluLevel[3] }
              </p> )}        
        </div>
      </EnvironmentTile>
    );
  }
}

Flu.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  level: PropTypes.string,
  levelExplanation: PropTypes.string,
  destination: PropTypes.string,
};

export default Flu;

