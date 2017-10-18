import React from 'react';

// Styles
import './RiskTile.css';

const RiskTile = props => (
  <div className="risk-tile">
    <div>{props.scoreName}</div>
    <div>{props.status}</div>
    <div className="risk-tile-score">{props.score}{props.sym}</div>
    <div>{props.context}</div>
  </div>
);

export default RiskTile;
