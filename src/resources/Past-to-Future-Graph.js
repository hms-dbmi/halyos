import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryTooltip, VictoryVoronoiContainer, VictoryArea, VictoryGroup, VictoryScatter, createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar } from 'victory';

class PastToFutureGraph extends Component {

	constructor(props){
		super(props);
		this.state = {userData:[], otherLine:[], view_data:[]};

		this.FUTURE_YEAR_SUBTRACTION = 2.2;
		this.FUTURE_YEAR_ADDITION = 3.5;

	}

	componentDidMount(){
		console.log("Mounted");
		this.setState({view_data:this.props.obs_data});
		
	}

	componentWillReceiveProps(nextProps){
		this.setState({view_data:nextProps.obs_data});

		if(nextProps.obs_data.length  > 0){
			var firstFuturePoint = { x: nextProps.futureMeasurementDate, y: nextProps.lastDataPoint }
			this.setState({userData:[firstFuturePoint]});
		}
		var startingLinePts = [];
		startingLinePts.push(firstFuturePoint);
		startingLinePts.push(nextProps.obs_data[0]);
		this.setState({otherLine:startingLinePts});
		

	}

	// handleZoom(domain) {
 //    	this.setState({selectedDomain: domain});
 //  	}

 //  	handleBrush(domain) {
 //    	this.setState({zoomDomain: domain});
 //  	}



	render(){
    
		Number.prototype.map = function (in_min, in_max, out_min, out_max) {
		  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		}

	  	this.func2;
	  	this.boundFunction = function onMouseMove(event) {

	  		//if the mouse is currently pressed down
	  		if(event.which === 1){

				//the below is assuming default viewBox: check this stackoverflow if that isn't the case
				//https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
				var maxSVGHeight = 0;

				if(event.target){
					if(event.target.nearestViewportElement){
					 	maxSVGHeight =  event.target.farthestViewportElement.getBoundingClientRect();
					} else {
					 	maxSVGHeight = event.target.getBoundingClientRect();
					}
				}

				var newYVal = event.offsetY.map(maxSVGHeight.height,0,this.props.yMin,this.props.yMax);
				if (newYVal < this.props.yMinPadded){
					newYVal = this.props.yMinPadded;
				} else if (newYVal > this.props.yMaxPadded){
					newYVal = this.props.yMaxPadded;
				}
		  		var movedPointLoc = { x: this.props.futureMeasurementDate, y: newYVal };
		    	this.setState({userData:[
				    movedPointLoc
				]})

				var otherLine = this.state.view_data.slice(0,1);
				otherLine.push(movedPointLoc);
				this.setState({otherLine:otherLine})

	  		}
	  	}

	  	var test1 = this.props.firstYear;
	  	var test2 = this.props.lastYear;

	  	var firstYearPadded = new Date(test1,1);
	  	firstYearPadded.setFullYear(firstYearPadded.getFullYear() - this.FUTURE_YEAR_SUBTRACTION);

	  	var lastYearPadded = new Date(test2,1);
	  	lastYearPadded.setFullYear(lastYearPadded.getFullYear() + this.FUTURE_YEAR_ADDITION);

	  	var yMinPadded = (this.props.yMin)*0.9;
	  	var yMaxPadded = (this.props.yMax)*1.1;
		
		const hasRefRange = this.props.refRange == true;
		return (
		      <div>
		          <VictoryChart width={1000} responsive={false} height={400} scale={{x: "time"}} 
		          				domain={{x:[firstYearPadded,lastYearPadded], y:[yMinPadded,yMaxPadded]}} 

		          >     

		          {hasRefRange && <VictoryArea y0={() => this.props.refRange[0][1]} y={() => this.props.refRange[0][0]}
						style={{
						    data: {
						      fill: "#8BC34A", fillOpacity: 0.3, strokeWidth:0
						    }
						}}
					 />
			  //         <VictoryArea y0={() => yMinPadded} y={() => this.props.refRange[0][0]}
				 //          style={{
					//     	data: {
					//       		fill: "#8BC34A", fillOpacity: 0.3, strokeWidth:0
					//     	}
					// 	}} 
					// /> 
					}
			          	<VictoryGroup 
			          	containerComponent={
		              		<VictoryVoronoiContainer
		              	// labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`}
		                // 		dimension="x"
		                // zoomDomain={this.state.zoomDomain}
		                // onDomainChange={this.handleZoom.bind(this)}
		              		/>
		            	}
		            	>
				            
				            <VictoryLine
				            	 style={{
				                	data: {strokeWidth:3}
				              	}}    
				            	labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`}
		    					labelComponent={<VictoryTooltip/>}
								data={this.state.view_data}
				            />

				            <VictoryLine    
								style={{
				                	data: {stroke:"blue", strokeDasharray: "5,5"}
				              	}}
				              	data={this.state.otherLine}
				            />

				            <VictoryScatter 
				            	labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`}
		    					labelComponent={<VictoryTooltip/>}
		    					name="test" ref={(ref) => this.svg = ref}
							    style={{ data: { fill: "#c43a31",strokeWidth:3 } }}
							    width={10}
							    size={7}
							    data={this.state.userData}
							    events={[{
							      target: "data",
							      eventHandlers: {

							      	onMouseDown: (evt) => {
							      		return [
							      		{
							              target: "data",
							              mutation: (props) => {
							            
							              	document.addEventListener('mousemove', this.boundFunction.bind(this));

							                return null;
							              }
							            }];},

							     //  	onMouseUp: (evt) => {
							     //  		console.log("on mouse up triggered: ", evt);
							     //  		return [
							     //  		{
							     //          target: "data",
							     //          mutation: (props) => {
												// document.removeEventListener('mousemove', this.func2);

							     //          }
							     //        }];}  
							      }
							    }]}
				            />
				        </VictoryGroup>
				        
		          

		         	</VictoryChart>

		      </div>
	    );

		}

}

export default PastToFutureGraph;