import PropTypes from 'prop-types';
import React from 'react';

// Components
import Button from './Button';

// Styles
import './MeasurementAbout.css';

//Texts
import text from '../texts/measurementText';

const MeasurementAbout = props => (
  <div className="measurement-about full-wh flex-c flex-col">
    <header className="dashboard-panel-headline flex-c flex-align-sb">
      <h3 className="dashboard-panel-headline-no-colon" style={{fontSize:"16px"}}>About: {props.name || "Click on a measurement to learn more!"}</h3>
      {props.isExpanded && (
        <Button
          icon="cross"
          iconOnly={true}
          onClick={() => props.expand(true)}
        />
      )}
    </header>{!props.name ||
    <div className="flex-g-1 r">
      <h4><strong>What</strong> does my {props.name} mean?</h4>
      <p>{(props.name && text[props.name] && text[props.name].meaning) || 'Not available...'}</p>
      <h4><strong>Why</strong> is my {props.name} important?</h4>
      <p>{(props.name && text[props.name] && text[props.name].important) || 'Not available...'}</p>
      <h4><strong>How</strong> can I make it better?</h4>
      <p>{(props.name && text[props.name] && text[props.name].improve) || 'Not available...'}</p>
    </div>}
  </div>
);

MeasurementAbout.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  name: PropTypes.string, 
  what: PropTypes.string,
  why: PropTypes.string,
  how: PropTypes.string,
};

export default MeasurementAbout;
