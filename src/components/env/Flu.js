import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

//Static Data
import {fluLocal} from '../../data/fhirData';

const Flu = props => (
  <EnvironmentTile
    name="Flu"
    expand={props.expand}
    isCollapsed={props.isCollapsed}
    isExpanded={props.isExpanded}
    level={"Low"}
    /*level={props.level}*/
  >
    <div>
      <h5>Mentions of Flu Symptoms Near You</h5>
      <p>
        {/*{props.destination}*/}
      </p>
      <h5>Explanation</h5>
      <p>
        {/*{props.levelExplanation}*/}
        There are a few cases of flu in your area. You might not need the seasonal vaccine, but if it is flu season, check with your healthcare provider.
      </p>
    </div>
  </EnvironmentTile>
);

Flu.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  level: PropTypes.string,
  levelExplanation: PropTypes.string,
  destination: PropTypes.string,
};

export default Flu;

