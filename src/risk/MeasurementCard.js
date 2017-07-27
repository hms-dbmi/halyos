import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';
import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';

class MeasurementCard extends Component {

	constructor(props){
		super(props);
		this.state = {};
	}
	
	componentWillMount(){
		
	}
	
	componentWillReceiveProps(nextProps){
	}

	componentDidMount(){

	}

	render(){

		const Handle = Slider.Handle;


		const handle = (props) => {
		  const { value, dragging, index, ...restProps } = props;
		  return (
		    <Tooltip
		      prefixCls="rc-slider-tooltip"
		      overlay={value}
		      visible={dragging}
		      placement="top"
		      key={index}
		    >
		      <Handle value={value} {...restProps} />
		    </Tooltip>
		  );
		};

		const style = { float: 'left', height: 200 };
		const parentStyle = { };

		const marks = {
		  '-10': '-10°C',
		  0: <strong>0°C</strong>,
		  26: '26°C',
		  100: {
		    style: {
		      color: 'red',
		    },
		    label: <strong>100°C</strong>,
		  },
		};

		console.log("this is the dataa?", this.props.data);
		return (
			<div className="panel panel-default container-fluid">
				<div className="row">
					<div className="col-sm-1">
						<h1>BP</h1>
					</div>
					<div className="col-sm-5">
						<PastGraph 
							obs_data={this.props.data}
							units={this.props.units}
							mainWidth={500}
							mainHeight={200}
							viewWidth={500}
							viewHeight={50}
						 />
					</div>
					<div className="col-sm-3">
						<div style={parentStyle}>
    						<div style={style}>
								<Slider vertical min={-10} max={20} handle={handle} defaultValue={5}/>
							</div>
						</div>
					</div>
					<div className="col-sm-3">
						<div style={parentStyle}>
    						<div style={style}>
								<Slider vertical min={-10} max={20} handle={handle} defaultValue={5}/>
							</div>
						</div>
					</div>
				</div>
			</div>

		)

	}

}

export default MeasurementCard;



