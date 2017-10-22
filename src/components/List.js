import PropTypes from 'prop-types';
import React from 'react';

import VitalTile from './VitalTile';

const List = props => (
  <div className="pure-u-24-24">
  {props.items.map((item, index) => (
    <VitalTile
      key={index}
      measurementName={item.name}
      units={item.units}
      past={item.past}
      present={item.present}
    />
  ))}
  </div>
);

List.propTypes = {
  items: PropTypes.array
};

export default List;
