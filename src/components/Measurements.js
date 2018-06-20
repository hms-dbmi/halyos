import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Components
import Icon from './Icon';
import MeasurementContainer from './MeasurementContainer';
import ExternalContainer from './ExternalContainer';
// Actions
import { setPastDate } from '../actions';

// Styles
import './Measurements.css';
import 'react-datepicker/dist/react-datepicker.css';

// Text
import measuresForRisks from '../texts/measurementsForRiskScores';
import requiresExternalData from '../texts/requiresExternalData';

//utils
import deepContains from '../utils/deep-contains';

import sortBy from 'lodash/sortBy';

class Measurements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      isDatePickerShown: false,
      measurements: []   
    };
  }

  shouldComponentUpdate(nextProps, nextState){
   return true;
  }

  componentDidMount(){
    this.setState({
        measurements: sortBy(this.props.measurements, [this.measurementSort, this.measurementSort2])
    });
  }

  measurementSort(mea1){
    for (const key in measuresForRisks) {
      if (!measuresForRisks.hasOwnProperty(key)) {
        continue;
      }
      if (deepContains(measuresForRisks[key],(mea1.code))) {
        return -1;
      }
    }    
    return 1;
  }

  measurementSort2(mea1){
    return mea1.code;
  }

  componentWillReceiveProps(nextProps){
    if(this.props.measurements.length !== nextProps.measurements.length){
      this.setState({
          measurements: sortBy(nextProps.measurements, [this.measurementSort, this.measurementSort2])
      });
    }
  }

  filterList(query) {
    let outputList = this.props.measurements.filter(function(item){
        return item.name.toLowerCase().indexOf(query) !== -1;
      })
    sortBy(outputList, [this.measurementSort, this.measurementSort2])
    this.setState({
      measurements: outputList
    });
  }

  toggleDatePicker() {
    this.setState({ isDatePickerShown: !this.state.isDatePickerShown });
  }

  pastChangeHandler(date) {
    this.toggleDatePicker();
    this.props.setPastDate(date.unix() * 1000);
  }

  blurSearch() {
    if (!this.state.query.length) this.setState({ isSearchFocus: false });
  }

  focusSearch() {
    this.setState({
      titleWidth: this.titleEl.getBoundingClientRect().width,
      isSearchFocus: true
    });
  }

  getPxLen(prop, len) {
    return { [prop]: `${len}px` }
  }

  render() {
    const pastDate = moment(this.props.pastDate || undefined);
    const titleClass = this.state.isSearchFocus ? 'is-collapsed' : '';
    let searchClass = 'search flex-c flex-v-center';
    let titleStyle = null;
    let searchStyle = null;
    if (this.state.isSearchFocus) {
      const titleWidth = this.titleEl.getBoundingClientRect().width;
      const searchWidth = this.wurstEl.getBoundingClientRect().width;
      titleStyle = this.getPxLen('marginLeft', -titleWidth);
      searchStyle = this.getPxLen('width', searchWidth - 0.25);
      searchClass += ' is-expanded';
    }
    return (
      <div className="measurements full-wh flex-c flex-col">
        <header className="dashboard-panel-headline ass pure-g flex-c flex-align-sb">
          <div className="pure-u-15-24">
            <div className="flex-c flexc-v-center title-bar" ref={(r) => { this.wurstEl = r; }}>
              <h3
                className={titleClass}
                ref={(r) => { this.titleEl = r; }}
                style={titleStyle}
              >Measurements</h3>
              <div
                className={searchClass}
                style={searchStyle}
              >
                <Icon id="magnifier" />
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-g-1"
                  onChange={e => this.filterList(e.target.value.toLowerCase())}
                  onBlur={() => this.blurSearch()}
                  onFocus={() => this.focusSearch()}
                />
              </div>
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
            {(this.props.risk == null || requiresExternalData.includes(this.props.risk)) &&
            (<div className="measurements-sublist-header">
              <div className="pure-u-24-24">
                <div className="flex-c flex-v-center">
                  <span>Data not available in EHR:</span>
                </div>
              </div>
            </div>)
            }
            <ExternalContainer risk={this.props.risk}/>
            <div className="measurements-sublist-header">
              <div className="pure-u-24-24">
                <div className="flex-c flex-v-center">
                  <span>Data from EHR:</span>
                </div>
              </div>
            </div>
            <div className='none-found'>
            {this.state.measurements.length == 0 ? "None found." : ""}
            </div>
            {this.state.measurements.filter((item) => {
                if (this.props.risk) {
                  if (deepContains(measuresForRisks[this.props.risk],item.code)) {
                    return true;
                  }
                  return false;
                }
                return true;
              }
            ).map((item, index) => {
              return <MeasurementContainer
                code={item.code}
                userPastDate={pastDate}
                name={item.name}
                key={item.code}
                isExpanded={this.props.isExpanded}
                expandAbout={this.props.expandAbout}
                unit={item.measurements[0].unit}
                past={item.measurements[1] && item.measurements[1].value}
                present={item.measurements[0].value}
                pastDate={item.measurements[1] && item.measurements[1].date}
                presentDate={item.measurements[0].date}
                graphData={item.measurements}
                risk={this.props.risk}
                currMeasure={this.props.currMeasure}
                absWidth={this.props.absWidth}
              />
            })}
          </main>
        {this.state.isDatePickerShown && (
          <DatePicker
            selected={pastDate}
            onChange={this.pastChangeHandler.bind(this)}
            onClickOutside={this.toggleDatePicker.bind(this)}
            monthsShown={1}
            minDate={moment().subtract(80, 'years')}
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
  setTimePeriod: PropTypes.func,
  currMeasure: PropTypes.string,
  risk: PropTypes.string,
  absWidth: PropTypes.number,
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
