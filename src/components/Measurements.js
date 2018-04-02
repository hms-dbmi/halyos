import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Components
import Icon from './Icon';
import MeasurementContainer from './MeasurementContainer';
import ExternalContainer from './ExternalContainer'
// Actions
import { setPastDate } from '../actions';

// Styles
import './Measurements.css';
import 'react-datepicker/dist/react-datepicker.css';

// Text
import measuresForRisks from '../texts/measurementsForRiskScores';

class Measurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "measurements",
      isDatePickerShown: false,
      measurements: this.props.measurements.sort((item) => {
        for (const key in measuresForRisks) {
          if (!measuresForRisks.hasOwnProperty(key)) {
            continue;
          }
          if (measuresForRisks[key].includes(item.code)) {
            return -1;
          }
        }
        return 1;
      })
    };
  }

  filterList(query) {
    this.props.expandAbout(false)
    this.setState({
      measurements: this.props.measurements.filter(
        item => item.name.toLowerCase().indexOf(query) !== -1
      ).sort((item) => {
        for (const key in measuresForRisks) {
          if (!measuresForRisks.hasOwnProperty(key)) {
            continue;
          }
          if (measuresForRisks[key].includes(item.code)) {
            return -1;
          }
        }
        return 1;
      })
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

  onChange() {
    this.setState({
      view: this.myInput.value
    })
  }

  render() {
    const pastDate = moment(this.props.pastDate || undefined);
    return (
      <div className="measurements full-wh flex-c flex-col">
        <header className="dashboard-panel-headline pure-g flex-c flex-align-sb">
          <div className="pure-u-15-24">
            <div className="flex-c flexc-v-center">
              <input
                type="text"
                placeholder="Click here to search!"
                className="search flex-g-1"
                onChange={e => this.filterList(e.target.value.toLowerCase())}
              />
            </div>
          </div>
          <div
            className="pure-u-3-24 smaller flex-c flex-v-center past-label"
            onClick={this.toggleDatePicker.bind(this)}
          >
            <Icon id="calendar"/>
             &nbsp;Past
          </div>
          <div
            className="pure-u-3-24 smaller present-label"
            onClick={() => this.props.setTimePeriod('Present')}
          >
            Present
          </div>
          <div
            className="pure-u-3-24 smaller future-label"
            onClick={() => this.props.setTimePeriod('Future')}
          >
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
                    </div>
                  )}
                </div>
                <div className="pure-u-3-24"></div>
                <div className="pure-u-3-24"></div>
              </div>
            )}
            <hr/>
            <div className="dashboard-panel-subtopbar">
                <div className="pure-u-24-24">
                  <div className="flex-c flex-v-center" style={{fontSize:20}}>
                    <span>Data not available in EHR</span>
                  </div>
                </div>
            </div>
            <ExternalContainer risk={this.props.risk}/>
            <div className="dashboard-panel-subtopbar">
                <div className="pure-u-24-24">
                  <div className="flex-c flex-v-center" style={{fontSize:20}}>
                    <span>Data from EHR</span>
                  </div>
                </div>
            </div>
            {this.state.measurements.filter((item) => {
                if (this.props.risk) {
                  if (measuresForRisks[this.props.risk].includes(item.code)) {
                    return true;
                  }
                  return false;
                }
                return true;
              }
            ).map((item, index) => (
              <MeasurementContainer
                code={item.code}
                userPastDate={pastDate}
                name={item.name}
                key={index}
                isExpanded={this.props.isExpanded}
                expandAbout={this.props.expandAbout}
                unit={item.measurements[0].units}
                past={item.measurements[1] && item.measurements[1].value}
                present={item.measurements[0].value}
                pastDate={item.measurements[1] && item.measurements[1].date}
                presentDate={item.measurements[0].date}
                graphData={item.measurements}
                risk={this.props.risk}
                currMeasure={this.props.currMeasure}
              />
            ))}
          </main>
        {this.state.isDatePickerShown && (
          <DatePicker
            selected={pastDate}
            onChange={this.pastChangeHandler.bind(this)}
            onClickOutside={this.toggleDatePicker.bind(this)}
            monthsShown={1}
            minDate={moment().subtract(80, "years")}
            maxDate={moment()}
            fixedHeight
            withPortal
            inline
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={50}
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
  pastDate: PropTypes.instanceOf(Date),
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
