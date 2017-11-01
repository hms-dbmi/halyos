import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Components
import Button from './Button';
import Icon from './Icon';
import Measurement from './Measurement';

// Actions
import { setPastDate } from '../actions';

// Styles
import './Measurements.css';
import 'react-datepicker/dist/react-datepicker.css';

class Measurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerShown: false,
      measurements: this.props.measurements
    };
  }

  filterList(query) {
    this.setState({
      measurements: this.props.measurements
        .filter(item => item.name.toLowerCase().indexOf(query) !== -1)
    });
  }

  toggleDatePicker() {
    this.setState({
      isDatePickerShown: !this.state.isDatePickerShown
    });
  }

  pastChangeHandler(date) {
    this.toggleDatePicker();
    this.props.setPastDate(date.unix() * 1000);
  }

  render() {
    const pastDate = moment(this.props.pastDate || undefined);

    console.log('AAAAAAAAAAAAAAAAAAAAAAAA', pastDate);

    return (
      <div className="measurements full-wh flex-c flex-col">
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
          <div
            className="pure-u-3-24 smaller flex-c flex-v-center"
            onClick={this.toggleDatePicker.bind(this)}
          >
            <Icon id="calendar"/>
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
          {this.props.pastDate && (
            <div className="dashboard-panel-subtopbar">
              <div className="pure-u-15-24"></div>
              <div className="pure-u-3-24">
                {this.props.pastDate && (
                  <div className="flex-c flex-v-center">
                    <span>{pastDate.format('MM/DD/YY')}</span>
                    <Button
                      icon="cross"
                      onClick={() => { this.props.setPastDate(null); }}
                    />
                  </div>
                )}
              </div>
              <div className="pure-u-3-24"></div>
              <div className="pure-u-3-24"></div>
            </div>
          )}
          {this.state.measurements.map((item, index) => (
            <Measurement
              key={index}
              expandAbout={this.props.expandAbout}
              name={item.name}
              unit={item.measurements[0].units}
              past={item.measurements[1] && item.measurements[1].value}
              present={item.measurements[0].value}
            />
          ))}
        </main>
        {this.state.isDatePickerShown && (
          <DatePicker
            selected={pastDate}
            onChange={this.pastChangeHandler.bind(this)}
            onClickOutside={this.toggleDatePicker.bind(this)}
            monthsShown={2}
            fixedHeight
            withPortal
            inline
          />
        )}
      </div>
    );
  }
}

Measurements.propTypes = {
  expand: PropTypes.func,
  expandAbout: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  measurements: PropTypes.array,
  pastDate: PropTypes.number,
  setPastDate: PropTypes.func,
};

const mapStateToProps = state => ({
  pastDate: state.pastDate,
});

const mapDispatchToProps = dispatch => ({
  setPastDate: pastDate =>
    dispatch(setPastDate(pastDate)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurements));
