import PropTypes from 'prop-types';
import React from 'react';

// Components
import List from './List';

class FilteredList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialItems: this.props.measurements,
      items: this.props.measurements
    };
  }

  filterList(query) {
    this.setState({
      items: this.state.initialItems
        .filter(item => item.name.toLowerCase().indexOf(query) !== -1)
    });
  }

  render() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-12-24">
            <span>Measurements:</span>
            <input
              type="text"
              placeholder="Search"
              onChange={e => this.filterList(e.target.value.toLowerCase())}
            />
          </div>
          <div className="pure-u-4-24">
            Past
          </div>
          <div className="pure-u-4-24">
            Present
          </div>
          <div className="pure-u-4-24">
            Future
          </div>
        </div>
        <List items={this.state.items} />
      </div>
    );
  }
}

FilteredList.propTypes = {
  measurements: PropTypes.array
};

export default FilteredList;
