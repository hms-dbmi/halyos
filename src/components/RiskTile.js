import React from 'react';

// Components
import ButtonIcon from './ButtonIcon';

// Styles
import './RiskTile.css';

const CONTEXT_MAX = 10;

const getLength = (context, contextMax) => ({
  width: `${100 * context / (contextMax || CONTEXT_MAX)}%`,
  height: `${(contextMax || CONTEXT_MAX) - context}px`,
  bottom: `-${(contextMax || CONTEXT_MAX) - context}px`
});

const RiskTile = props => (
  <div className="risk-tile">
    <div className="risk-tile-content">
      <h2 className="risk-tile-title">{props.scoreName}</h2>
      <div className="risk-tile-status">{props.status}</div>
      <div className="risk-tile-score flex-c flex-align-c flex-v-bottom">
        <div className="risk-tile-score-value">{props.score}</div>
        <div className="risk-tile-score-unit">{props.unit}</div>
      </div>
      <div className="flex-c flex-align-sb">
        <div className="risk-tile-context">{`within ${props.context} years`}</div>
        <ButtonIcon
          icon="info"
          iconOnly={true}
          className="risk-tile-info"
          onClick={() => alert('My Ass')} />
      </div>
      <div className="risk-tile-context-bar" style={getLength(props.context, props.contextMax)}></div>
    </div>
  </div>
);

export default RiskTile;
