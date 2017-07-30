import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';
import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';

import { LinkContainer } from 'react-router-bootstrap';

class MeasurementCard extends Component {

	constructor(props){
		super(props);
		this.state = {hovered:false};
	}
	
	componentWillMount(){
//		console.log("in measurement card: ", this.props.data);
		var bottomLabel = this.props.data[this.props.data.length - 1].y;
		var number = parseInt(bottomLabel);

		var topLabel = this.props.data[0].y;

		this.marks = {};
		this.marks[bottomLabel] = bottomLabel;
		this.marks[topLabel] = topLabel;
		console.log("marks;", this.marks);

		this.link = "/measure/" + this.props.code;
	}
	
	componentWillReceiveProps(nextProps){
	}

	componentDidMount(){

	}

	onMouseOver() {
      this.setState({ hovered:true });
    }

    onMouseOut() {
      this.setState({ hovered:false });
    }

    style() {
      if (this.state.hovered) {
        return { 
        	marginTop: '0.83em',
		    marginBottom: '0.83em',
		    marginLeft: '0',
		    marginRight: '0',
		    display: 'block',
    		fontSize: '1.5em',
        	fontWeight: "bold",
        	cursor:"pointer" }
      } else {
        return { 
        	marginTop: '0.83em',
		    marginBottom: '0.83em',
		    marginLeft: '0',
		    marginRight: '0',
		    display: 'block',
    		fontSize: '1.5em',
        	fontWeight: "normal",
        	cursor:"pointer" }
      }
    }

	onSlide(value){
//		console.log("huh:", this.props);
		this.props.onUpdate(value,this.props.code);
	}

	render(){

		

		// const marks = {
		//   '-10': '-10°C',
		//   0: <strong>0°C</strong>,
		//   26: '26°C',
		//   100: {
		//     style: {
		//       color: 'red',
		//     },
		//     label: <strong>100°C</strong>,
		//   },
		// };

		//console.log("this is the dataa?", this.props.data);
		return (
			<div className="panel panel-default container-fluid">
				<div className="row">
					<div className="col-sm-12" onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)} style={this.style()}>
						<LinkContainer to={this.link}><p>{this.props.title}</p></LinkContainer>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-6">
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
						<div style={firstSliderStyle}>
							<Slider disabled vertical marks={this.marks} min={0} max={500} handle={handle} defaultValue={this.props.data[0].y}/>
						</div>
					</div>
					<div className="col-sm-3">
						<div style={secondSliderStyle}>
							<Slider vertical marks={this.marks} min={0} max={500} handle={handle} defaultValue={this.props.data[0].y} onChange={this.onSlide.bind(this)} />
						</div>
					</div>
				</div>
			</div>

		)

	}

}

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

		const firstSliderStyle = {
			float: 'left',
			height: 200,
			paddingLeft:"60px",
			width:40

		};
		const secondSliderStyle = {
			"float":"left",
			height: 200,
			paddingLeft:"50px",
			width:40
		}

export default MeasurementCard;



