import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';

// Styles
import './EnvironmentTile.css';

const EnvironmentTile = props => (
  <div className={`${props.name} environment-tile full-dim`}>
    <h4 onClick={() => props.expand ? props.expand(props.isExpanded) : {}}>{props.name}</h4>
    <div className="flex-c">
      <div className={`${props.name}-level`}>{props.level || '…'}</div>
      <Icon id={props.icon || props.name} />
      {props.isExpanded && (
        props.children
      )}
    </div>
  </div>
);

EnvironmentTile.propTypes = {
  children: PropTypes.node,
  expand: PropTypes.func,
  icon: PropTypes.string,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  level: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default EnvironmentTile;
