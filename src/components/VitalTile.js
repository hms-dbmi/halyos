import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';
import PastGraph from './Graphs/Past-Graph';

const getArrowDir = (past, present) => (past !== present
  ? 'arrow-top-right'
  : 'arrow-right'
);

const getMirrorH = (past, present) => past > present;

const VitalTile = props => (
  <div>
    <div className="pure-u-12-24 flex-c flex-v-center">
      <div>{props.name}</div>
      <div className="unit">[{props.unit}]</div>
    </div>
    <div className="pure-u-2-24">
      {props.past}
    </div>
    <div className="pure-u-2-24">
      <Icon
        id={getArrowDir(props.past, props.present)}
        mirrorH={getMirrorH(props.past, props.present)}
      />
    </div>
    <div className="pure-u-4-24">
      {props.present}
    </div>
    <div className="pure-u-4-24">
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
