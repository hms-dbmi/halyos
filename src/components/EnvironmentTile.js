import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';

// Styles
import './EnvironmentTile.css';

const MIDDOT3 = `${String.fromCharCode(183)}${String.fromCharCode(183)}${String.fromCharCode(183)}`;

const getClass = (props) => {
  let className = `${props.name} environment-tile full-dim flex-c`;

  className += props.isLoading ? ' is-loading' : '';

  return className;
};

const getClassOverview = (props) => {
  let className = 'environment-tile-overview p';

  className += !props.isExpanded ? ' flex-g-1' : '';

  return className;
};

const getClassDetails = (props) => {
  let className = 'environment-tile-details flex-c flex-col';

  className += props.isExpanded ? ' flex-g-1 is-shown' : '';

  return className;
};

class EnvironmentTile extends React.Component {
  constructor(props) {
    super(props);

    this.overviewElWidth = 'auto';
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isExpanded === true && this.props.isExpanded === false) {
      const { clientWidth } = this.overviewEl;
      this.overviewElWidth = clientWidth;
    }
    if (nextProps.isExpanded === false) {
      this.overviewElWidth = 'auto';
    }
  }

  render() {
    return (
      <div className={getClass(this.props)}>
        <div
          className={getClassOverview(this.props)}
          onClick={() => (this.props.expand && this.props.expand(this.props.isExpanded))}
          style={{
            width: this.overviewElWidth
          }}
          ref={(el) => { this.overviewEl = el; }}
        >
          <div className="full-dim flex-c flex-col">
            <h4 className="environment-tile-title">
              {this.props.name}
            </h4>
            <div className="flex-g-1 flex-c flex-align-c flex-v-center r">
              <div
                className={`${this.props.name}-level environment-tile-level`}
              >
                {this.props.level || MIDDOT3}
              </div>
              <Icon id={this.props.icon || this.props.name} className="environment-tile-icon" />
            </div>
          </div>
        </div>
        <div className={getClassDetails(this.props)}>
          {this.props.isExpanded && (
            this.props.children
          )}
        </div>
      </div>
    );
  }
}

EnvironmentTile.propTypes = {
  children: PropTypes.node,
  expand: PropTypes.func,
  icon: PropTypes.string,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  level: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default EnvironmentTile;
