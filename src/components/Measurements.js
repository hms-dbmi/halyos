import PropTypes from 'prop-types';
import React from 'react';

// Components
import Measurement from './Measurement';

// Styles
import './Measurements.css';

class Measurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      measurements: this.props.measurements
    };
  }

  filterList(query) {
    this.setState({
      measurements: this.props.measurements
        .filter(item => item.name.toLowerCase().indexOf(query) !== -1)
    });
  }

  render() {
    return (
      <div className="measuremrents full-wh flex-c flex-col">
        <header className="dashboard-panel-headline pure-g flex-c flex-align-sb">
          <div className="pure-u-15-24">
            <div className="flex-c flexc-v-center">
              <h3>Measurements</h3>
              <input
                type="text"
                placeholder="Search"
                className="search flex-g-1"
                onChange={e => this.filterList(e.target.value.toLowerCase())}
              />
            </div>
          </div>
          <div className="pure-u-3-24 smaller">
            Past
          </div>
          <div className="pure-u-3-24 smaller">
            Present
          </div>
          <div className="pure-u-3-24 smaller">
            Future
          </div>
        </header>
        <main className="measurements-list flex-c flex-col flex-g-1 r scrollbar">
          {this.state.measurements.map((item, index) => (
            <Measurement
              key={index}
              name={item.name}
              unit={item.measurements[0].units}
              past={item.measurements[1] && item.measurements[1].value}
              present={item.measurements[0].value}
            />
          ))}
        </main>
      </div>
    );
  }
}

Measurements.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  measurements: PropTypes.array,
};

export default Measurements;
