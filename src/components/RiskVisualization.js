import React, { Component } from 'react';

import './RiskVisualization.css';

export default class RiskVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      present: (this.props.present > 0 ? this.props.present : 0),
      better: (this.props.better > 0 ? this.props.better : 0),
      worse: (this.props.worse > 0 ? this.props.worse : 0),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      present: (nextProps.present > 0 ? nextProps.present : 0),
      better: (nextProps.better > 0 ? nextProps.better : 0),
      worse: (nextProps.worse > 0 ? nextProps.worse : 0),
    })
  }

  createViz() {
    let code = '<svg viewBox="0 0 120 100">';
    let count = 0;

    const isBetter = !!this.state.better;
    const isWorse = !!this.state.worse;

    for (let i = count; i < 100; i++) {
      const x = (i % 10) * 12;
      const y = Math.floor(i / 10) * 12;
      if (isBetter && i >= this.state.present && i < this.state.present + this.state.better) {
        code += `<circle cx="${x + 6}" cy="${y + 6}" class="risk-viz-dot-better" />`
        code += `<circle cx="${x + 6}" cy="${y + 6}" class="risk-viz-dot-better-outline" />`
      }
      else if (isWorse && i >= this.state.present - this.state.worse && i < this.state.present) {
        code += `<circle cx="${x + 6}" cy="${y + 6}" class="risk-viz-dot-worse" />`;
      }
      else if (i < this.state.present) {
        code += `<circle cx="${x + 6}" cy="${y + 6}" class="risk-viz-dot-normal" />`
      }
      else {
        code += `<circle cx="${x + 6}" cy="${y + 6}" class="risk-viz-dot" />`;
      }
    }
    code = code + '</svg>';
    return {__html: code};
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
