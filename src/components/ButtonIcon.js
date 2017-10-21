import { PropTypes } from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';

// Styles
import './ButtonIcon.css';

const classNames = (props) => {
  let className = 'flex-c flex-align-c lex-v-center button-icon';

  className += ` ${props.className}`;
  className += props.iconOnly ? ' button-icon-only' : '';
  className += props.isActive ? ' is-active' : '';

  return className;
};

const ButtonIcon = props => (
  <button
    className={classNames(props)}
    title={props.title}
    onClick={props.onClick}
    onMouseDown={props.onMouseDown}
    onMouseUp={props.onMouseUp}>
    <Icon
      id={props.icon}
      mirrorH={props.iconMirrorH}
      mirrorV={props.iconMirrorV} />
    <span>{props.children}</span>
  </button>
);

ButtonIcon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  iconMirrorH: PropTypes.bool,
  iconMirrorV: PropTypes.bool,
  iconOnly: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  title: PropTypes.string,
};

export default ButtonIcon;
