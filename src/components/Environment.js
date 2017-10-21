import PropTypes from 'prop-types';
import React from 'react';

// Components
import PollenContainer from './env/PollenContainer';
import AirQuality from './env/AirQuality';
import Flu from './env/Flu';

// Styles
import './Environment.css';

const Environment = props => (
  <div className="environment full-wh flex-c flex-col">
    <h3 className="dashboard-panel-headline">Environment</h3>
    <div className="flex-g-1 r">
      <div className="environment-tile">
        <PollenContainer location={props.ptLoc} />
      </div>
      <div className="environment-tile">
        <AirQuality location={props.ptLoc} />
      </div>
      <div className="environment-tile">
        <Flu location={props.ptLoc} />
      </div>
    </div>
  </div>
);

Environment.propTypes = {
  ptLoc: PropTypes.func,
};

export default Environment;
