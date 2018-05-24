import PropTypes from 'prop-types';
import React from 'react';

//Components
import Icon from './Icon';
import RiskVisualization from '../components/RiskVisualization';

// Styles
import './RiskTile.css';

// const CONTEXT_MAX = 10;

// const getLength = (context, contextMax) => ({
//   width: `${100 * context / (contextMax || CONTEXT_MAX)}%`,
//   height: `${(contextMax || CONTEXT_MAX) - context + 1}px`,
//   bottom: `-${(contextMax || CONTEXT_MAX) - context}px`
// });

class RiskTile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pastScore: parseInt(this.props.pastScore, 10),
      pastBad: 0,
      pastGood: 0,
      currScore: parseInt(this.props.score, 10),
      currBad: 0,
      currGood: 0,
      futScore: parseInt(this.props.futureScore, 10),
      futBad: 0,
      futGood: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pastScore: parseInt(nextProps.pastScore, 10),
      currScore: parseInt(nextProps.score, 10),
      futScore: parseInt(nextProps.futureScore, 10)
    });
    if (parseInt(nextProps.pastScore, 10) > parseInt(nextProps.score, 10)) {
      this.setState({
        pastScore: parseInt(nextProps.score, 10),
        pastGood: parseInt(nextProps.pastScore, 10) - parseInt(nextProps.score, 10),
        pastBad: 0
      });
    } else {
      this.setState({
        pastBad: parseInt(nextProps.score, 10) - parseInt(nextProps.pastScore, 10),
        pastGood: 0
      });
    }
    if (parseInt(nextProps.futureScore, 10) > parseInt(nextProps.score, 10)) {
      this.setState({
        futScore: parseInt(nextProps.score, 10),
        futGood: parseInt(nextProps.futureScore, 10) - parseInt(nextProps.score, 10),
        futBad: 0
      });
    } else {
      this.setState({
        futBad: parseInt(nextProps.score, 10) - parseInt(nextProps.futureScore, 10),
        futGood: 0
      });
    }
  }


  render() {
    const msToYear = 1000 * 60 * 60 * 24 * 365;

    const yearsPast = Math.floor(
      (Date.now() - (new Date(this.props.pastDate)).getTime()) / msToYear
    );
    const monthsPast = Math.floor(
      (
        (Date.now() - (new Date(this.props.pastDate)).getTime()) /
        (msToYear) - yearsPast
      ) * 12
    );

    // if the expanded risk is this one, display the visualization
    const displayviz = this.props.name === this.props.currRisk;
    return (
      <div
        className="risk-tile"
      >
      {displayviz && (
        <div className="risk-tile-content risk-tile-large">
          <div className='flex-c flex-align-sb flex-v-stretch'>
            <div
              className="flex-c flex-align-c flex-v-center back"
              onClick={() => { this.props.expand(this.props.name); }}
            >
              <Icon id="arrow-right" mirrorV={true} />
            </div>
            <div className="flex-g-1">
              <h2 className="risk-tile-title">
                {this.props.name} Risk
              </h2>
              <div className="risk-tile-time">
                within <span className="highlight">{this.props.context} ({(this.props.context == 1) ? "year" : "years"})</span>
              </div>
              <div className="risk-tile-score flex-c flex-align-c">
                <RiskVisualization
                  present={this.state.pastScore}
                  worse={this.state.pastBad}
                  better={this.state.pastGood}
                  score={Math.round(this.props.pastScore)}
                  context={this.props.context}
                  period={"Past"}
                />
                <RiskVisualization
                  present={Math.round(this.props.score)}
                  score={Math.round(this.props.score)}
                  emphasize={true}
                  context={this.props.context}
                  period={"Today"}
                />
                <RiskVisualization
                  present={this.state.futScore}
                  worse={this.state.futBad}
                  better={this.state.futGood}
                  score={Math.round(this.props.futureScore)}
                  context={this.props.context}
                  period={"Future"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {!displayviz &&
        <div
          className={"risk-tile-content risk-tile-clickable " + (this.props.activeMeasure ? 'risk-active' : 'risk-inactive')}
          onClick={() => { this.props.expand(this.props.name); }}
        >
          <h2 className="risk-tile-title">{this.props.name} Risk</h2>
          <div className="risk-tile-status">{this.props.status}</div>
          <div className="risk-tile-score flex-c flex-align-c">

            {this.props.pastScore &&
              <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-past">
                <div className="risk-tile-score-value tooltip">{this.props.pastScore}
                  <span className="tooltiptext">{`${yearsPast} years, ${monthsPast} ${monthsPast == 1 ? 'month' : 'months'} ago` || 'N/A'}</span>
                </div>
                <div className="risk-tile-score-unit">{this.props.unit}</div>
              </div>
            } &nbsp;&nbsp;&nbsp;

            <div className="flex-c flex-align-c flex-v-bottom risk-tile-score-present">
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
            <div className="risk-tile-context">{`within ${this.props.context} ${(this.props.context == 1) ? "year" : "years"}`}</div>
            {/* <Button
              icon="info"
              iconOnly={true}
              className="risk-tile-info"
              onClick={() => alert('More info on the risk here.')} /> */}
          </div>
         {/* <div className="risk-tile-context-bar" style={getLength(this.props.context, this.props.contextMax)}></div>*/}
        </div>
      }
      </div>
    );
  }
}

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
