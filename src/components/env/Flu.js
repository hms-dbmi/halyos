import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

const Flu = props => (
  <EnvironmentTile
    name="Flu"
    expand={props.expand}
    isCollapsed={props.isCollapsed}
    isExpanded={props.isExpanded}
    level={props.level}
  >
    <div>
      <h5>Mentions of Flu Symptoms Near You</h5>
      <p>{props.destination}</p>
      <h5>Explanation</h5>
      <p>{props.levelExplanation}</p>
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

