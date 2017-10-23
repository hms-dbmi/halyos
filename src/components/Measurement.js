import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';
import PastGraph from './Graphs/Past-Graph';

// Styles
import './Measurement.css';

const getArrowDir = (past, present) => (past !== present
  ? 'arrow-top-right'
  : 'arrow-right'
);

const getMirrorH = (past, present) => past > present;

const VitalTile = props => (
  <div className="measurement pure-g">
    <div className="pure-u-15-24">
      <div className="full-wh flex-c flex-v-center">
        <div className="measurement-title">{props.name}</div>
        <div className="measurement-unit">[{props.unit}]</div>
      </div>
    </div>
    <div className="measurement-past pure-u-2-24 flex-c flex-v-center">
      {props.past}
    </div>
    <div className="measurement-past-to-future pure-u-1-24 flex-c flex-v-center">
      <Icon
        id={getArrowDir(props.past, props.present)}
        mirrorH={getMirrorH(props.past, props.present)}
      />
    </div>
    <div className="measurement-present pure-u-3-24 flex-c flex-v-center">
      {props.present}
    </div>
    <div className="measurement-future pure-u-3-24 flex-c flex-v-center">
      {props.future}
    </div>
    {false && (
      <PastGraph
        obs_data={{}}
        units="mmHg"
        reference_range={{ min: 110, max: 130 }}
        mainWidth={500}
        mainHeight={200}
        viewWidth={500}
        viewHeight={50}
      />
    )}
  </div>
);

VitalTile.propTypes = {
  name: PropTypes.string,
  unit: PropTypes.string,
  past: PropTypes.string,
  present: PropTypes.string,
  future: PropTypes.string,
};

export default VitalTile;
