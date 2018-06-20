import PropTypes from 'prop-types';
import React from 'react';

// Components
import PollenContainer from './env/PollenContainer';
import AirQualityContainer from './env/AirQualityContainer';
import FluContainer from './env/FluContainer';
import Button from './Button';

// Styles
import './Environment.css';

class Environment extends React.Component {
  constructor(props) {
    super(props);

    //by the time that we create the Env tile, if the ptLoc data has already been pulled, then we don't do it again below
    if(this.props.ptLoc){
      this.props.getPollenLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);
      this.props.getAIQLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);
      this.props.getFluLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);
    }
  }

  componentWillReceiveProps(nextProps){
    // we make the call for the environmental factors here
    if(!this.props.ptLoc && this.props.ptLoc.latitude !== nextProps.ptLoc.latitude && this.props.ptLoc.longitude !== nextProps.ptLoc.longitiude){
      this.props.getPollenLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);
      this.props.getAIQLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);
      this.props.getFluLevels(this.props.ptLoc.latitude,this.props.ptLoc.longitude);

    }

  }


  render(){
    return (
      <div className="environment full-wh flex-c flex-col">
        <header className="dashboard-panel-headline flex-c flex-align-sb">
          <h3>Environment</h3>
          {this.props.isExpanded && (
            <Button
              icon="cross"
              iconOnly={true}
              onClick={() => this.props.expand(true)}
            />
          )}
        </header>
        <main className="flex-c flex-col flex-g-1 r">
          <div className="environment-tile-wrapper flex-g-1 r">
            <PollenContainer
              expand={this.props.expand}
              isCollapsed={this.props.isCollapsed}
              isExpanded={this.props.isExpanded}
              location={this.props.ptLoc}
            />
          </div>
          <div className="environment-tile-wrapper flex-g-1 r">
            <AirQualityContainer
              expand={this.props.expand}
              isCollapsed={this.props.isCollapsed}
              isExpanded={this.props.isExpanded}
              location={this.props.ptLoc}
            />
          </div>
          <div className="environment-tile-wrapper flex-g-1 r">
            <FluContainer
              expand={this.props.expand}
              isCollapsed={this.props.isCollapsed}
              isExpanded={this.props.isExpanded}
              location={this.props.ptLoc}
            />
          </div>
        </main>
      </div>
    );
  }
}

Environment.propTypes = {
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  ptLoc: PropTypes.object,
};

export default Environment;
