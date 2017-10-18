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

const getViewBox = id => (icons[id] && icons[id].viewBox ?
  icons[id].viewBox : '0 0 16 16');

const convertId = id => (id ? id.replace(/-/g, '_').toUpperCase() : '');

const Icon = props => (
  <div
    className={`icon icon-${props.id} ${props.mirrorH ? 'is-mirror-h' : ''} ${props.mirrorV ? 'is-mirror-v' : ''}`}
    title={props.title}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="full-dim"
      viewBox={getViewBox(convertId(props.id))}
      fillRule={getFillRule(convertId(props.id))}
      dangerouslySetInnerHTML={getSvg(convertId(props.id))} />
  </div>
);

Icon.propTypes = {
  id: PropTypes.string.isRequired,
  mirrorH: PropTypes.bool,
  mirrorV: PropTypes.bool,
  title: PropTypes.string,
};

export default Icon;
