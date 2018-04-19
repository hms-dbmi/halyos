import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './RiskVisualization.css';

export default class RiskVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      present: (this.props.present > 0 ? this.props.present : 0),
      better: (this.props.better > 0 ? this.props.better : 0),
      worse: (this.props.worse > 0 ? this.props.worse : 0),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      present: (nextProps.present > 0 ? nextProps.present : 0),
      better: (nextProps.better > 0 ? nextProps.better : 0),
      worse: (nextProps.worse > 0 ? nextProps.worse : 0),
    });
  }

  createViz() {
    let code = '<svg width="100%" height="100%" viewBox="0 0 200 200"><g>';
    let i = 0;
    for (; i < this.state.present; i++) {
      const cx = 10 + ((i % 10) * 20);
      const cy = 10 + (Math.floor(i / 10) * 20);
      code += `<circle cx="${cx}" cy="${cy}" r="7" stroke="black" stroke-width="0" fill="#656565" />`;
      if (i % 10 === 9) {
        code = '</g>';
      }
    }
    for (; i < this.state.present + this.state.better; i++) {
      const cx = 10 + ((i % 10) * 20);
      const cy = 10 + (Math.floor(i / 10) * 20);
      code += `<circle cx="${cx}" cy="${cy}" r="7" stroke="black" stroke-width="1" fill="#1C1C1C" />`;
      code += `<circle cx="${cx}" cy="${cy}" r="9" stroke="black" stroke-width="1" fill="none" />`;
      if (i % 10 === 9) {
        code += '</g><g>';
      }
    }
    for (; i < this.state.present + this.state.better + this.state.worse; i++) {
      const cx = 10 + ((i % 10) * 20);
      const cy = 10 + (Math.floor(i / 10) * 20);
      code += `<circle cx="${cx}" cy="${cy}" r="2" stroke="black" stroke-width="1" fill="#1C1C1C" />`;
      if (i % 10 === 9) {
        code += '</g><g>';
      }
    }
    for (; i < 100; i++) {
      const cx = 10 + ((i % 10) * 20);
      const cy = 10 + (Math.floor(i / 10) * 20);
      code += `<circle cx="${cx}" cy="${cy}" r="7" stroke="black" stroke-width="0" fill="#D4D4D4" />`;
      if (i % 10 === 9) {
        code += '</g><g>';
      }
    }
    code += '</g></svg>';
    return { __html: code };
  }

  render() {
    let className = this.props.emphasize ? 'present-risk' : 'risk';

    if (this.props.period === 'Past') className += ' risk-tile-score-past';
    if (this.props.period === 'Future') className += ' risk-tile-score-future';

    return (
      <div className={className}>
        <div className='header flex-c flex-v-bottom flex-align-sb'>
          <span className="percentage">
            {this.props.score}
            <span className="percentage-sign">%</span>
          </span>
          <span className="time">{this.props.period}</span>
        </div>
        <div className="risk-viz">
          <div className="full-dim" dangerouslySetInnerHTML={this.createViz()} />
        </div>
      </div>
    );
  }
}

RiskVisualization.propTypes = {
  emphasize: PropTypes.bool,
  present: PropTypes.number,
  better: PropTypes.number,
  worse: PropTypes.number,
  score: PropTypes.number,
  period: PropTypes.string,
};
