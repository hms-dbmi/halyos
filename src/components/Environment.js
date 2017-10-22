import PropTypes from 'prop-types';
import React from 'react';

// Components
import PollenContainer from './env/PollenContainer';
import AirQuality from './env/AirQuality';
import Flu from './env/Flu';
import Button from './Button';

// Styles
import './Environment.css';

const Environment = props => (
  <div className="environment full-wh flex-c flex-col">
    <header className="dashboard-panel-headline flex-c flex-align-sb">
      <h3>Environment</h3>
      {props.isExpanded && (
        <Button
          icon="cross"
          iconOnly={true}
          onClick={() => props.expand(true)}
        />
      )}
    </header>
    <main className="flex-c flex-col flex-g-1 r">
      <div
        className="environment-tile-wrapper flex-g-1 r"
        onClick={() => props.expand()}
      >
        <PollenContainer
          expand={props.expand}
          isCollapsed={props.isCollapsed}
          isExpanded={props.isExpanded}
          location={props.ptLoc}
        />
      </div>
      <div
        className="environment-tile-wrapper flex-g-1 r"
        onClick={() => props.expand()}
      >
        <AirQuality
          expand={props.expand}
          isCollapsed={props.isCollapsed}
          isExpanded={props.isExpanded}
          location={props.ptLoc}
        />
      </div>
      <div
        className="environment-tile-wrapper flex-g-1 r"
        onClick={() => props.expand()}
      >
        <Flu
          expand={props.expand}
          isCollapsed={props.isCollapsed}
          isExpanded={props.isExpanded}
          location={props.ptLoc}
        />
      </div>
    </main>
  </div>
);

Environment.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  ptLoc: PropTypes.object,
};

export default Environment;
