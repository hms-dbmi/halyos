import { PropTypes } from 'prop-types';
import React from 'react';

// Config
import icons, { WARNING } from '../configs/icons';

// Styles
import './Icon.css';

const wrapHtml = html => ({ __html: html });

const getSvg = id => wrapHtml(icons[id] ? icons[id].svg : WARNING.svg);

const getFillRule = id => (icons[id] && icons[id].fillRule ?
  icons[id].fillRule : '');

const getStrokeLinecap = id => (icons[id] && icons[id].strokeLinecap ?
  icons[id].strokeLinecap : '');

const getViewBox = id => (icons[id] && icons[id].viewBox ?
  icons[id].viewBox : '0 0 16 16');

const convertId = id => (id ? id.replace(/-/g, '_').toUpperCase() : '');

const getClass = (props) => {
  let className = `icon icon-${props.id} flex-c`;

  className += props.className ? ` ${props.className}` : '';
  className += props.mirrorH ? ' is-mirror-h' : '';
  className += props.mirrorV ? ' is-mirror-v' : '';
  
  return className;
};

const getAngle = (props) => {
  return `rotate(${props.rotate | 0}deg)`;
};

const getStyle = (props) => {
  if (props.rotate) {
    return { transform: getAngle(props) };
  }
  return {};
};

const Icon = props => (
  <div
    className={getClass(props)}
    title={props.title}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="full-dim"
      viewBox={getViewBox(convertId(props.id))}
      fillRule={getFillRule(convertId(props.id))}
      strokeLinecap={getStrokeLinecap(convertId(props.id))}
      dangerouslySetInnerHTML={getSvg(convertId(props.id))}
      style={getStyle(props)}
    />
  </div>
);

Icon.defaultProps = {
  rotate: 0
};

Icon.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  mirrorH: PropTypes.bool,
  mirrorV: PropTypes.bool,
  rotate: PropTypes.number,
  title: PropTypes.string,
};

export default Icon;
