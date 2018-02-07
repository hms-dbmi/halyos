import PropTypes from 'prop-types';
import React from 'react';

//Components
import RiskVisualization from '../components/RiskVisualization';

// Styles
import './RiskTile.css';

const CONTEXT_MAX = 10;

const getLength = (context, contextMax) => ({
  width: `${100 * context / (contextMax || CONTEXT_MAX)}%`,
  height: `${(contextMax || CONTEXT_MAX) - context + 1}px`,
  bottom: `-${(contextMax || CONTEXT_MAX) - context}px`
});

class RiskTile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pastScore: parseInt(this.props.pastScore),
      pastBad: 0,
      pastGood: 0,
      currScore: parseInt(this.props.score),
      currBad: 0,
      currGood: 0,
      futScore: parseInt(this.props.futureScore),
      futBad: 0,
      futGood: 0
    }    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pastScore: parseInt(nextProps.pastScore),
      currScore: parseInt(nextProps.score),
      futScore: parseInt(nextProps.futureScore)
    })
    if(parseInt(nextProps.pastScore) > parseInt(nextProps.score)) {
      this.setState({
        pastScore: parseInt(nextProps.score),
        pastGood: parseInt(nextProps.pastScore) - parseInt(nextProps.score),
        pastBad: 0
      })
    } else {
      this.setState({
        pastBad: parseInt(nextProps.score)-parseInt(nextProps.pastScore),
        pastGood: 0
      })
    }
    if(parseInt(nextProps.futureScore) > parseInt(nextProps.score)) {
      this.setState({
        futScore: parseInt(nextProps.score),
        futGood: parseInt(nextProps.futureScore)-parseInt(nextProps.score),
        futBad: 0
      })
    } else {
      this.setState({
        futBad: parseInt(nextProps.score)-parseInt(nextProps.futureScore),
        futGood: 0
      })
    }
  }
    
  render() {
    let displayviz = false;

    //if the expanded risk is this one, display the visualization
    if(this.props.name === this.props.currRisk) {
      displayviz = true
    }

    let background = (this.props.activeMeasure ? '#EEB4B4' : '#EEEEEE')
    return (
      <div
        className="risk-tile"
        onClick={() => { this.props.expand(this.props.name); }}
      >
      {displayviz && <div className="risk-tile-content">
        <h2 className="risk-tile-title">{this.props.name}</h2>
        <div className="risk-tile-score flex-c flex-align-c">
          <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-past">
            <RiskVisualization 
            present={this.state.pastScore}
            worse={this.state.pastBad}
            better={this.state.pastGood}
            score={Math.round(this.props.pastScore)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div className="flex-c flex-align-c flex-v-bottom">
            <RiskVisualization present={Math.round(this.props.score)} score={Math.round(this.props.score)}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-future">
            <RiskVisualization 
            present={this.state.futScore}
            worse={this.state.futBad}
            better={this.state.futGood}
            score={Math.round(this.props.futureScore)}
            />
          </div>
        </div>
      </div>}
      {!displayviz &&
        <div className="risk-tile-content" style={{background: background}}>
          <h2 className="risk-tile-title">{this.props.name}</h2>
          <div className="risk-tile-status">{this.props.status}</div>
          <div className="risk-tile-score flex-c flex-align-c">
            {this.props.pastScore &&
              <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-past">
                <div className="risk-tile-score-value">{this.props.pastScore}</div>
                <div className="risk-tile-score-unit">{this.props.unit}</div>
              </div>
            } &nbsp;&nbsp;&nbsp;
            <div className="flex-c flex-align-c flex-v-bottom">
              <div className="risk-tile-score-value">{this.props.score}</div>
              <div className="risk-tile-score-unit">{this.props.unit}</div>
            </div> &nbsp;&nbsp;&nbsp;
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
      }
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
