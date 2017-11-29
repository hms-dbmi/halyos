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

class RiskTile extends React.Component {

  render() {
    let background = (this.props.activeMeasure ? '#EEB4B4' : '#EEEEEE')
    return (
      <div
        className="risk-tile"
        onClick={() => { this.props.expand(this.props.name); }}
      >
        <div className="risk-tile-content" style={{background: background}}>
          <h2 className="risk-tile-title">{this.props.name}</h2>
          <div className="risk-tile-status">{this.props.status}</div>
          <div className="risk-tile-score flex-c flex-align-c">
            {this.props.pastScore &&
              <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-past">
                <div className="risk-tile-score-value">{this.props.pastScore}</div>
                <div className="risk-tile-score-unit">{this.props.unit}</div>
              </div>
            }
            <div className="flex-c flex-align-c flex-v-bottom">
              <div className="risk-tile-score-value">{this.props.score}</div>
              <div className="risk-tile-score-unit">{this.props.unit}</div>
            </div>
            {this.props.futureScore &&
              <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-future">
                <div className="risk-tile-score-value">{this.props.futureScore}</div>
                <div className="risk-tile-score-unit">{this.props.unit}</div>
              </div>
            }
          </div>
          <div className="flex-c flex-align-sb">
            <div className="risk-tile-context">{`within ${this.props.context} years`}</div>
            {/* <Button
              icon="info"
              iconOnly={true}
              className="risk-tile-info"
              onClick={() => alert('More info on the risk here.')} /> */}
          </div>
          <div className="risk-tile-context-bar" style={getLength(this.props.context, this.props.contextMax)}></div>
        </div>
      </div>)
  }
  
};

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
