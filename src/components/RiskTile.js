import PropTypes from 'prop-types';
import React from 'react';

// Styles
import './RiskTile.css';

const CONTEXT_MAX = 10;

const getLength = (context, contextMax) => ({
  width: `${100 * context / (contextMax || CONTEXT_MAX)}%`,
  height: `${(contextMax || CONTEXT_MAX) - context + 1}px`,
  bottom: `-${(contextMax || CONTEXT_MAX) - context}px`
});

const RiskTile = props => (
  <div
    className="risk-tile"
    onClick={() => { props.expand(props.name); }}
  >
    <div className="risk-tile-content">
      <h2 className="risk-tile-title">{props.name}</h2>
      <div className="risk-tile-status">{props.status}</div>
      <div className="risk-tile-score flex-c flex-align-c">
        {props.pastScore &&
          <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-past">
            <div className="risk-tile-score-value">{props.pastScore}</div>
            <div className="risk-tile-score-unit">{props.unit}</div>
          </div>
        }
        <div className="flex-c flex-align-c flex-v-bottom">
          <div className="risk-tile-score-value">{props.score}</div>
          <div className="risk-tile-score-unit">{props.unit}</div>
        </div>
        {props.futureScore &&
          <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-future">
            <div className="risk-tile-score-value">{props.futureScore}</div>
            <div className="risk-tile-score-unit">{props.unit}</div>
          </div>
        }
      </div>
      <div className="flex-c flex-align-sb">
        <div className="risk-tile-context">{`within ${props.context} years`}</div>
        {/* <Button
          icon="info"
          iconOnly={true}
          className="risk-tile-info"
          onClick={() => alert('More info on the risk here.')} /> */}
      </div>
      <div className="risk-tile-context-bar" style={getLength(props.context, props.contextMax)}></div>
    </div>
  </div>
);

RiskTile.propTypes = {
  expand: PropTypes.func,
  context: PropTypes.number,
  contextMax: PropTypes.number,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  name: PropTypes.string,
  status: PropTypes.string,
  unit: PropTypes.string,
};

export default RiskTile;
