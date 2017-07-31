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
		this.state = {hovered:false, value: this.props.data[0].y};
	}
	
	componentWillMount(){
//		console.log("in measurement card: ", this.props.data);
		
		this.marks = {};
		this.minVal;
		this.maxVal;
		this.stepSize;

		var maxBottom;
		var maxTop;
		

		maxBottom = Math.min(this.props.data[this.props.data.length - 1].y, isNaN(this.props.reference[0]) ? Infinity : this.props.reference[0]);
		maxTop = Math.max(this.props.data[0].y, isNaN(this.props.reference[1]) ? -Infinity : this.props.reference[1]);
	
		//console.log("maxBottom", maxBottom, "maxTop", maxTop);
		this.marks = {};
		
		//make the max and min 50% greater than the largest and smallest numbers (coming from either the value of the patient or the reference ranges, whichever is bigger)
		maxBottom = maxBottom*0.5;
		maxTop = maxTop*1.5;

		//console.log("maxBottom", maxBottom, "maxTop", maxTop);

		this.marks[maxBottom] = Math.floor(maxBottom);
		this.marks[maxTop] = Math.ceil(maxTop);

		this.maxVal = maxTop;
		this.minVal = maxBottom;
//		console.log("marks;", this.marks);

		this.stepSize = ((maxTop - maxBottom)/20.0).toFixed(4);
		//console.log("this is the step size", this.stepSize);

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
			<div className="panel panel-default container-fluid" style={{boxShadow:"1px 2px 11px 0px black"}}>
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
							refRange={this.props.reference}
						 />
					</div>
					<div className="col-sm-3">
						<div style={firstSliderStyle}>
							<Slider disabled vertical 
								trackStyle={{ backgroundColor: '#BDBDBD', width: 30 }}
								railStyle={{ backgroundColor: '#EEEEEE', width: 30 }}
								handleStyle={{
						          borderColor: '#EEEEEE',
						          height: 28,
						          width: 28,
						          marginLeft:1,
						          backgroundColor: 'white',
						        }}
								marks={this.marks}
								min={this.minVal}
								max={this.maxVal}
								handle={handle}
								defaultValue={this.props.data[0].y}
								step={this.stepSize}
							/>
							<text style={{fontFamily: "HiraKakuPro-W3, Hiragino Kaku Gothic Pro", fontSize: "12", fontWeight: "300", fill: "#000000"}}>
			                    <tspan>{this.state.value}{this.props.units}</tspan>
			                </text>
						</div>
					</div>
					<div className="col-sm-3">
						<div style={secondSliderStyle}>
							<Slider vertical
								trackStyle={{ backgroundColor: '#2196F3', width: 30 }}
								railStyle={{ backgroundColor: '#90CAF9', width: 30 }}
								handleStyle={{
						          borderColor: '#90CAF9',
						          height: 28,
						          width: 28,
						          marginLeft:1,
						          backgroundColor: 'white',
						        }}
								marks={this.marks}
								min={this.minVal}
								max={this.maxVal}
								handle={handle}
								defaultValue={this.props.data[0].y}
								onChange={this.onSlide.bind(this)}
								step={this.stepSize}
							/>
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
      overlay={value.toFixed(2)}
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
	paddingLeft:"80px",
	width:40
}

export default MeasurementCard;



